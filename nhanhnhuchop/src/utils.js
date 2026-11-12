import { POINTS, BONUS_PER_SECOND, STARS } from './data';

export const calcPoints = (question, timeLeft) =>
  POINTS[question.level] + timeLeft * BONUS_PER_SECOND;

export const calcTotal = (answers) =>
  answers.reduce((sum, a) => sum + a.points, 0);

export const getStars = (correctCount) =>
  STARS.find((s) => correctCount >= s.min);

export const starText = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);
