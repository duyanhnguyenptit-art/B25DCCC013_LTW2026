import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LETTERS } from '../data';
import { getStars, starText } from '../utils';

const Result = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) return <Navigate to="/" replace />;

  const { name, answers, score, correctCount } = state;
  const star = getStars(correctCount);

  return (
    <div>
      <h2>{star.message}</h2>
      <p>{`Người chơi: ${name}`}</p>
      <p>{`Số câu trả lời đúng: ${correctCount}/15`}</p>
      <p>{`Điểm: ${score}`}</p>
      <p>
        {`Xếp loại: ${star.stars} sao `}
        <span className="stars">{starText(star.stars)}</span>
      </p>

      <h3>Xem lại</h3>
      <table>
        <thead>
          <tr>
            <th>Câu</th>
            <th>Bạn chọn</th>
            <th>Đáp án đúng</th>
            <th>Còn lại</th>
            <th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((a, i) => (
            <tr key={i} className={a.correct ? 'row-correct' : 'row-wrong'}>
              <td>{a.id === a.origId ? `Câu ${i + 1}` : `Câu ${i + 1} (đổi sang câu ${a.id})`}</td>
              <td>{a.chosen === null ? '—' : LETTERS[a.chosen]}</td>
              <td>{LETTERS[a.correctIndex]}</td>
              <td>{`${a.timeLeft} giây`}</td>
              <td>{a.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="toolbar">
        <button onClick={() => navigate('/play')}>Chơi lại</button>
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    </div>
  );
};

export default Result;
