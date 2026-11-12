import { TIME_PER_QUESTION } from '../data';

const TimeBar = ({ timeLeft, paused }) => {
  const percent = (timeLeft / TIME_PER_QUESTION) * 100;
  const color = timeLeft <= 5 ? '#e53935' : '#43a047';
  return (
    <div>
      <p style={{ margin: '4px 0' }}>{`Còn ${timeLeft} giây${paused ? ' (đã dừng)' : ''}`}</p>
      <div className="timebar-track">
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: color,
            transition: 'width 1s linear',
          }}
        />
      </div>
    </div>
  );
};

export default TimeBar;
