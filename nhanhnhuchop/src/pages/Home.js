import { Link, useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  const best = history.reduce((b, h) => (!b || h.score > b.score ? h : b), null);

  return (
    <div>
      <h1>Nhanh như chớp</h1>
      <p>
        Trả lời 15 câu hỏi về HTML, CSS, JavaScript và React. Mỗi câu có 15 giây. Trả lời sai hay
        hết giờ chỉ bị 0 điểm, không bị loại. Trả lời càng nhanh, điểm càng cao. Cuối lượt bạn được
        xếp loại từ 0 đến 3 sao.
      </p>
      {best && <p><b>{`Kỷ lục: ${best.score} điểm – ${best.name}`}</b></p>}
      <div className="toolbar">
        <label htmlFor="name">Tên người chơi: </label>
        <input
          id="name"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button disabled={!playerName.trim()} onClick={() => navigate('/play')}>
          Bắt đầu
        </button>
      </div>
      <p><Link to="/questions">Xem ngân hàng câu hỏi</Link></p>
    </div>
  );
};

export default Home;
