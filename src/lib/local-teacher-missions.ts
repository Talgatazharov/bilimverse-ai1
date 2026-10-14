import type { Mission, SubjectId } from '@/types';

const KEY = 'bilimverse_local_teacher_missions_v1';

export type LocalTeacherMission = {
  mission: Mission;
  assignedClass: string;
  createdAt: string;
};

export function loadTeacherMissions(): LocalTeacherMission[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(value) ? value.filter((item) =>
      item && typeof item === 'object' && item.mission &&
      typeof item.mission.id === 'string' && Array.isArray(item.mission.questions)
    ) : [];
  } catch { return []; }
}

export function saveTeacherMission(generated: {
  title: string;
  description: string;
  questions: { question: string; options: string[]; correctAnswer: string; hint: string; explanation: string }[];
}, details: { grade: number; subject: string; assignedClass: string }): Mission {
  const subjects: Record<string, SubjectId> = {
    'Математика': 'math', 'Қазақ тілі': 'kazakh', 'Әдебиеттік оқу': 'literature',
    'Жаратылыстану': 'science', 'Дүниетану': 'world', 'Ағылшын тілі': 'english',
    'Цифрлық сауаттылық': 'digital',
  };
  const subjectId = subjects[details.subject] || 'math';
  const id = `teacher-${Date.now()}`;
  const mission: Mission = {
    id, subjectId, title: generated.title, description: generated.description,
    grade: details.grade, order: 0, xpReward: 60, coinReward: 10, hasBoss: false,
    questions: generated.questions.map((q, index) => ({
      id: `${id}-q${index + 1}`, missionId: id, subjectId, type: 'multipleChoice',
      question: q.question, options: q.options, correctAnswer: q.correctAnswer,
      hint: q.hint, explanation: q.explanation, difficulty: 'normal', xp: 10,
    })),
  };
  localStorage.setItem(KEY, JSON.stringify([...loadTeacherMissions(), {
    mission, assignedClass: details.assignedClass, createdAt: new Date().toISOString(),
  }]));
  return mission;
}
