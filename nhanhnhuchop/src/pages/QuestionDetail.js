import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  if (loading) return <h2>Đang tải câu hỏi...</h2>;
  if (error) return <h2>Không tải được câu hỏi</h2>;

  const q = questions.find((item) => item.id === Number(id));

  if (!q) {
    return (
      <div>
        <h2>Không tìm thấy câu hỏi</h2>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div>
      <h2>{`Câu hỏi số ${q.id} – ${LEVELS[q.level]} · ${q.reserve ? 'Dự bị' : 'Chính thức'}`}</h2>
      <p style={{ fontSize: 18 }}>{q.question}</p>
      {q.options.map((opt, i) => {
        const isRight = show && i === q.answer;
        return (
          <p
            key={i}
            style={{
              padding: 8,
              background: isRight ? '#a5d6a7' : 'transparent',
              borderRadius: 6,
            }}
          >
            {`${LETTERS[i]}. ${opt}`}
            {isRight && <b> (Đáp án đúng)</b>}
          </p>
        );
      })}
      {show && <p>{`Giải thích: ${q.explain}`}</p>}
      <div className="toolbar">
        <button onClick={() => setShow(!show)}>{show ? 'Ẩn đáp án' : 'Xem đáp án'}</button>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    </div>
  );
};

export default QuestionDetail;
