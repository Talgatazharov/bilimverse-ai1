import type { Question } from '@/types';

const KEY = 'bilimverse_learning_attempts_v1';
export type LearningAttempt = { questionId: string; subjectId: string; topic: string; correct: boolean; at: string };

export function loadLearningAttempts(): LearningAttempt[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(value) ? value.filter((item) => item && typeof item.subjectId === 'string' && typeof item.correct === 'boolean') : [];
  } catch { return []; }
}

export function recordLearningAttempt(question: Question, topic: string, correct: boolean) {
  const attempts = loadLearningAttempts();
  attempts.push({ questionId: question.id, subjectId: question.subjectId, topic, correct, at: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(attempts.slice(-500)));
}

export function getTopicScores(attempts: LearningAttempt[]) {
  const groups = new Map<string, { topic: string; subjectId: string; attempts: number; correct: number }>();
  attempts.forEach((item) => {
    const key = `${item.subjectId}:${item.topic}`;
    const value = groups.get(key) || { topic: item.topic, subjectId: item.subjectId, attempts: 0, correct: 0 };
    value.attempts += 1;
    value.correct += Number(item.correct);
    groups.set(key, value);
  });
  return Array.from(groups.values()).sort((a, b) => a.correct / a.attempts - b.correct / b.attempts);
}
