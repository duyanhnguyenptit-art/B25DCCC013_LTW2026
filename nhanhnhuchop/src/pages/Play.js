import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION } from '../data';
import { calcPoints, calcTotal, getStars } from '../utils';
import Countdown from '../components/Countdown';
import QuestionCard from '../components/QuestionCard';
import TimeBar from '../components/TimeBar';
import ScorePanel from '../components/ScorePanel';
import PowerUps from '../components/PowerUps';

const TOTAL = 15;

const Play = ({ playerName, questions, loading, error, onFinish }) => {
  const navigate = useNavigate();

  const official = questions.filter((q) => !q.reserve);
  const ready = official.length >= TOTAL;

  const [status, setStatus] = useState('countdown'); // countdown | answering | revealed
  const [count, setCount] = useState(3);
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [focus, setFocus] = useState(0);
  const [swapped, setSwapped] = useState({}); // idx -> câu dự bị đã thay vào
  const [used, setUsed] = useState({ swap: false, double: false, pause: false });
  const [doubled, setDoubled] = useState(false);
  const [paused, setPaused] = useState(false);

  const current = swapped[idx] || official[idx];
  const qid = current ? current.id : null;
  const canUse = status === 'answering' && chosen === null;

  const reveal = (choice) => {
    const correct = choice !== null && choice === current.answer;
    let points = correct ? calcPoints(current, timeLeft) : 0;
    if (correct && doubled) points = points * 2;
    const record = {
      id: current.id,
      origId: official[idx].id,
      chosen: choice,
      correctIndex: current.answer,
      correct,
      timeLeft,
      points,
    };
    setAnswers([...answers, record]);
    setChosen(choice);
    setStatus('revealed');
  };

  const handleChoose = (i) => {
    if (!canUse) return;
    reveal(i);
  };

  const handleSwap = () => {
    if (!canUse || used.swap) return;
    const reserve = questions.find((q) => q.reserve && q.level === current.level);
    if (!reserve) return;
    setSwapped({ ...swapped, [idx]: reserve });
    setTimeLeft(TIME_PER_QUESTION);
    setUsed({ ...used, swap: true });
  };

  const handleDouble = () => {
    if (!canUse || used.double) return;
    setDoubled(true);
    setUsed({ ...used, double: true });
  };

  const handlePause = () => {
    if (!canUse || used.pause) return;
    setPaused(true);
    setUsed({ ...used, pause: true });
  };

  // Đếm ngược 3, 2, 1
  useEffect(() => {
    if (status !== 'countdown' || !ready) return;
    const t = setTimeout(() => {
      if (count > 1) {
        setCount(count - 1);
      } else {
        setStatus('answering');
        setTimeLeft(TIME_PER_QUESTION);
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [status, count, ready]);

  // Đồng hồ 15 giây mỗi câu
  useEffect(() => {
    if (status !== 'answering' || paused) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [status, qid, paused]);

  // Hết giờ
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) reveal(null);
    // eslint-disable-next-line
  }, [timeLeft, status]);

  // Chờ 1,5 giây rồi sang câu tiếp hoặc kết thúc
  useEffect(() => {
    if (status !== 'revealed') return;
    const t = setTimeout(() => {
      if (idx + 1 >= TOTAL) {
        const correctCount = answers.filter((a) => a.correct).length;
        const score = calcTotal(answers);
        onFinish({
          id: Date.now(),
          name: playerName,
          score,
          correctCount,
          stars: getStars(correctCount).stars,
          playedAt: new Date().toLocaleString('vi-VN'),
        });
        navigate('/result', {
          replace: true,
          state: { name: playerName, answers, score, correctCount },
        });
      } else {
        setIdx(idx + 1);
        setStatus('answering');
        setTimeLeft(TIME_PER_QUESTION);
        setChosen(null);
        setFocus(0);
        setDoubled(false);
        setPaused(false);
      }
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [status]);

  // Phím tắt
  useEffect(() => {
    const handleKey = (e) => {
      if (status !== 'answering' || chosen !== null) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocus((f) => (f % 2 === 0 ? f + 1 : f));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocus((f) => (f % 2 === 1 ? f - 1 : f));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocus((f) => (f < 2 ? f + 2 : f));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocus((f) => (f >= 2 ? f - 2 : f));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleChoose(focus);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line
  }, [status, chosen, focus, qid, timeLeft, doubled]);

  // Tiêu đề tab
  useEffect(() => {
    const correctCount = answers.filter((a) => a.correct).length;
    document.title = `Câu ${idx + 1}/${TOTAL} – đúng ${correctCount} câu`;
    return () => {
      document.title = 'Nhanh như chớp';
    };
  }, [idx, answers]);

  if (!playerName.trim()) return <Navigate to="/" replace />;
  if (loading) return <h2>Đang tải câu hỏi...</h2>;
  if (error || !ready) return <h2>Không tải được câu hỏi</h2>;
  if (status === 'countdown') return <Countdown count={count} />;

  const correctCount = answers.filter((a) => a.correct).length;
  const last = answers[answers.length - 1];
  const gain = status === 'revealed' && last && last.correct ? last.points : 0;

  return (
    <div>
      <QuestionCard
        index={idx}
        total={TOTAL}
        question={current}
        chosen={chosen}
        revealed={status === 'revealed'}
        focus={focus}
        disabled={!canUse}
        onChoose={handleChoose}
      />
      <TimeBar timeLeft={timeLeft} paused={paused} />
      <PowerUps
        used={used}
        canUse={canUse}
        doubled={doubled}
        onSwap={handleSwap}
        onDouble={handleDouble}
        onPause={handlePause}
      />
      <ScorePanel score={calcTotal(answers)} correctCount={correctCount} gain={gain} />
    </div>
  );
};

export default Play;
