const ScorePanel = ({ score, correctCount, gain }) => (
  <div>
    <p style={{ margin: '4px 0' }}>{`Điểm: ${score}`}</p>
    <p style={{ margin: '4px 0' }}>{`Số câu đúng: ${correctCount}`}</p>
    {gain > 0 && <p style={{ margin: '4px 0', color: '#43a047', fontWeight: 'bold' }}>{`+${gain} điểm`}</p>}
  </div>
);

export default ScorePanel;
