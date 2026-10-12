export type Role = 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';

export type PetStage = 'egg' | 'baby' | 'explorer' | 'guardian' | 'legendary';

export type PetMood = 'idle' | 'happy' | 'thinking' | 'flying' | 'explaining' | 'celebrating' | 'sleeping';

export type SubjectId = 'math' | 'kazakh' | 'literature' | 'science' | 'world' | 'english' | 'digital';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  realmName: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  bgImage: string;
  monumentDesc: string;
  totalMissions: number;
}

export interface StudentProgress {
  id: string;
  name: string;
  grade: number;
  xp: number;
  level: number;
  currency: number; // Тұмар (Crystals)
  streak: number; // Күндік қатарлық
  avatar: string; // 'boy' | 'girl' or path
  title: string;
  petName: string;
  petStage: PetStage;
  petExp: number;
  completedMissions: Record<string, { stars: number; completedAt: string }>;
  unlockedRegions: string[];
  achievements: string[];
  inventory: string[];
  claimedAchievements?: string[];
  qyranChatCount?: number;
  kazakhWordQuestionIds?: string[];
  lastActiveDate?: string;
  longestStreak?: number;
  lastParentPraiseDate?: string;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  earnedXp: number;
  requiredXp: number; // e.g. 100 XP
  completedMissionIds: string[];
  chestUnlocked: boolean;
  chestClaimed: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  category: 'weekly' | 'class' | 'special';
  target: number;
  current: number;
  rewardXp: number;
  rewardCoins: number;
  badge?: string;
  completed: boolean;
  claimed: boolean;
  periodStart?: string;
  periodEnd?: string;
}

export interface TeacherProfileData {
  id: string;
  name: string;
  school: string;
  className: string;
}

export interface ParentProfileData {
  id: string;
  name: string;
  childName: string;
}

export type QuestionType =
  | 'multipleChoice'
  | 'dragDrop'
  | 'matching'
  | 'ordering'
  | 'wordBuilder'
  | 'sentenceBuilder'
  | 'memory'
  | 'trueFalse'
  | 'imageChoice';

export interface Question {
  id: string;
  subjectId: SubjectId;
  missionId: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  difficulty: 'easy' | 'normal' | 'hard';
  xp: number;
  asset?: string;
  pairItems?: { id?: string; left: MatchingItem; right: MatchingItem }[];
  orderItems?: string[];
  wordLetters?: string[];
}

export type MatchingItem = string | { text?: string; image?: string; alt?: string };

export interface Mission {
  id: string;
  subjectId: SubjectId;
  title: string;
  description: string;
  grade: number;
  order: number;
  xpReward: number;
  coinReward: number;
  hasBoss: boolean;
  bossName?: string;
  unlocks?: string[];
  questions: Question[];
}

export interface VillageBuilding {
  id: string;
  key: string;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  costToUpgrade: number;
  icon: string;
  image: string;
  perk: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'math' | 'streak' | 'world' | 'qyran' | 'adventure' | 'general';
  icon: string;
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  target: number;
  current: number;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
}

export interface TeacherClass {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
  avgProgress: number;
  weakTopics: string[];
  strongTopics: string[];
  needsHelpStudents: { name: string; topic: string; score: number }[];
}
