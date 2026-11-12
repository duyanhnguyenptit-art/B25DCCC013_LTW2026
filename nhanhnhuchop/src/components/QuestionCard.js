import AnswerButton from './AnswerButton';
import { LEVELS, LETTERS } from '../data';

const QuestionCard = ({ index, total, question, chosen, revealed, focus, disabled, onChoose }) => {
  const getStatus = (i) => {
    if (!revealed) return 'normal';
    if (i === question.answer) return 'correct';
    if (i === chosen) return 'wrong';
    return 'normal';
  };

  return (
    <div>
      <h3>{`Câu ${index + 1}/${total} · ${LEVELS[question.level]}`}</h3>
      <p style={{ fontSize: 20 }}>{question.question}</p>
      <div className="answers-grid">
        {question.options.map((opt, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={opt}
            status={getStatus(i)}
            focused={!disabled && focus === i}
            disabled={disabled}
            onClick={() => onChoose(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
