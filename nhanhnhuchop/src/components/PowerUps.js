const PowerUps = ({ used, canUse, doubled, onSwap, onDouble, onPause }) => (
  <div className="powerups">
    <button disabled={!canUse || used.swap} onClick={onSwap}>Đổi câu hỏi</button>
    <button disabled={!canUse || used.double} onClick={onDouble}>
      {doubled ? 'Đang nhân đôi' : 'Nhân đôi'}
    </button>
    <button disabled={!canUse || used.pause} onClick={onPause}>Dừng giờ</button>
  </div>
);

export default PowerUps;
