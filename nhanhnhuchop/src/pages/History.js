import { starText } from '../utils';

const History = ({ history, setHistory }) => {
  const sorted = [...history].sort(
    (a, b) => b.score - a.score || b.correctCount - a.correctCount
  );

  const n = history.length;
  const totalScore = history.reduce((sum, h) => sum + h.score, 0);
  const totalCorrect = history.reduce((sum, h) => sum + h.correctCount, 0);
  const avg = n === 0 ? 0 : Math.round(totalScore / n);
  const rate = n === 0 ? 0 : Math.round((totalCorrect / (15 * n)) * 100);

  const handleDelete = (id) => setHistory(history.filter((h) => h.id !== id));

  return (
    <div>
      <h2>Lịch sử</h2>
      {n === 0 ? (
        <p>Chưa có lượt chơi nào</p>
      ) : (
        <div>
          <p>{`Số lượt chơi: ${n}`}</p>
          <p>{`Điểm trung bình: ${avg}`}</p>
          <p>{`Tỉ lệ trả lời đúng: ${rate}%`}</p>
          <button onClick={() => setHistory([])}>Xóa lịch sử</button>
          <table>
            <thead>
              <tr>
                <th>Người chơi</th>
                <th>Số câu đúng</th>
                <th>Xếp loại</th>
                <th>Điểm</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((h) => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.correctCount}</td>
                  <td>{starText(h.stars)}</td>
                  <td>{h.score}</td>
                  <td>{h.playedAt}</td>
                  <td><button onClick={() => handleDelete(h.id)}>Xóa</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
