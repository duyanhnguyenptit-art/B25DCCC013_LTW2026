// status: 'normal' | 'correct' | 'wrong'
const AnswerButton = ({ letter, text, status, focused, disabled, onClick }) => {
  const bg = status === 'correct' ? '#43a047' : status === 'wrong' ? '#e53935' : '#f1f1f1';
  const color = status === 'normal' ? '#222' : '#fff';
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        background: bg,
        color,
        border: focused ? '4px solid #0d47a1' : '4px solid transparent',
      }}
    >
      {`${letter}. ${text}`}
    </button>
  );
};

export default AnswerButton;
