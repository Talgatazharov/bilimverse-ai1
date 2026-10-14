import type { Mission, Question } from '@/types';

export type RecentQuestion = { id: string; fingerprint: string };

export function questionFingerprint(question: Question): string {
  const raw = question.question.toLocaleLowerCase('kk-KZ').replace(/[×xх]/g, '*').replace(/[÷:]/g, '/').replace(/[−–]/g, '-');
  const equation = raw.match(/(\d+)\s*([+*/-])\s*(\d+)/);
  if (equation) return `${question.type}:math:${equation[1]}${equation[2]}${equation[3]}:${question.correctAnswer.trim().toLowerCase()}`;
  const normalized = raw.replace(/[^а-яәғқңөұүһіa-z0-9]+/gi, ' ').trim().replace(/\s+/g, ' ');
  return `${question.type}:${normalized}:${question.correctAnswer.trim().toLowerCase()}`;
}

function near(a: Question, b: Question): boolean {
  if (questionFingerprint(a) === questionFingerprint(b)) return true;
  if (a.type !== b.type) return false;
  const words = (value: string) => new Set(value.toLocaleLowerCase('kk-KZ').match(/[а-яәғқңөұүһіa-z0-9]+/gi)?.filter((word) => word.length > 2) || []);
  const left = words(a.question);
  const right = words(b.question);
  if (left.size < 3 || right.size < 3) return false;
  const overlap = Array.from(left).filter((word) => right.has(word)).length;
  return overlap / Math.min(left.size, right.size) >= .8 && a.correctAnswer === b.correctAnswer;
}

export function selectQuestions(pool: Question[], count: number, recent: RecentQuestion[], random: () => number = Math.random): Question[] {
  const ids = new Set<string>();
  const unique = pool.filter((question) => {
    if (!question.id || ids.has(question.id)) return false;
    ids.add(question.id);
    return true;
  });
  const shuffled = [...unique];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  const result: Question[] = [];
  const recentIds = new Set(recent.map((entry) => entry.id));
  const recentPrints = new Set(recent.map((entry) => entry.fingerprint));
  const fingerprint = (question: Question) => questionFingerprint(question);
  const eligible = (question: Question) => !result.some((used) => used.id === question.id || near(used, question));
  const passes = [
    (question: Question) => !recentIds.has(question.id) && !recentPrints.has(fingerprint(question)),
    (question: Question) => !recentIds.has(question.id),
    (_question: Question) => true,
  ];
  for (let passIndex = 0; passIndex < passes.length; passIndex++) {
    const pass = passes[passIndex];
    const candidates = passIndex === 2 ? [...shuffled].sort((a, b) => recent.findIndex((item) => item.id === a.id) - recent.findIndex((item) => item.id === b.id)) : shuffled;
    for (const question of candidates) {
      if (result.length >= count) break;
      if (eligible(question) && pass(question)) result.push(question);
    }
  }
  // If the whole pool is small, never repeat an ID inside the same session.
  for (const question of shuffled) {
    if (result.length >= count) break;
    if (!result.some((used) => used.id === question.id)) result.push(question);
  }
  return result;
}

export function startMissionSession(mission: Mission, extraQuestions: Question[] = [], count = 5): Mission {
  if (typeof window === 'undefined') return mission;
  const key = `bilimverse_recent_questions_${mission.subjectId}`;
  let recent: RecentQuestion[] = [];
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) recent = saved.filter((entry) => entry && typeof entry.id === 'string' && typeof entry.fingerprint === 'string');
  } catch { /* old or disabled storage */ }
  const questions = selectQuestions([...mission.questions, ...extraQuestions], count, recent).map((question) => {
    if (question.type !== 'multipleChoice' && question.type !== 'trueFalse') return question;
    const options = [...question.options];
    for (let index = options.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [options[index], options[other]] = [options[other], options[index]];
    }
    return { ...question, options };
  });
  try {
    const additions = questions.map((question) => ({ id: question.id, fingerprint: questionFingerprint(question) }));
    localStorage.setItem(key, JSON.stringify([...recent, ...additions].slice(-60)));
  } catch { /* gameplay still works without persistence */ }
  return { ...mission, questions };
}
