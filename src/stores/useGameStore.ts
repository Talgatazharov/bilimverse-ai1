import { create } from 'zustand';
import {
  Role,
  StudentProgress,
  VillageBuilding,
  Achievement,
  DailyQuest,
  DailyProgress,
  ChallengeItem,
  TeacherProfileData,
  ParentProfileData,
  PetMood,
  PetStage,
} from '@/types';
import { GAME_RULES } from '@/lib/game-rules';
import { INITIAL_BUILDINGS, ACHIEVEMENTS, DAILY_QUESTS } from '@/data/seed-data';
import { sounds } from '@/lib/sound-manager';

export function getTodayDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWeekDates(): { start: string; end: string } {
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const key = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return { start: key(monday), end: key(sunday) };
}

function currentChallenges(challenges: ChallengeItem[]): ChallengeItem[] {
  const week = getWeekDates();
  return challenges.map((challenge) => challenge.category === 'weekly'
    ? challenge.periodEnd && challenge.periodEnd < getTodayDate()
      ? { ...challenge, current: 0, completed: false, claimed: false, periodStart: week.start, periodEnd: week.end }
      : { ...challenge, periodStart: challenge.periodStart || week.start, periodEnd: challenge.periodEnd || week.end }
    : challenge);
}

interface GameState {
  // Auth & Roles
  role: Role;
  setRole: (role: Role) => void;

  // Student Profile
  student: StudentProgress;
  setStudentName: (name: string) => void;
  setStudentAvatar: (avatar: string) => void;
  setStudentGrade: (grade: number) => void;

  // Teacher & Parent Profiles
  teacherProfile: TeacherProfileData;
  parentProfile: ParentProfileData;
  setTeacherProfile: (profile: Partial<TeacherProfileData>) => void;
  setParentProfile: (profile: Partial<ParentProfileData>) => void;

  // Progression & Daily tracking
  dailyProgress: DailyProgress;
  challenges: ChallengeItem[];
  claimChallengeReward: (challengeId: string) => boolean;
  claimAchievementReward: (achievementId: string) => boolean;
  recordQyranChat: () => void;
  recordKazakhWord: (questionId: string) => void;
  syncCalendar: () => void;

  // Village & Progression
  buildings: VillageBuilding[];
  achievements: Achievement[];
  dailyQuests: DailyQuest[];

  // Mascot Qyran state
  qyranMood: PetMood;
  setQyranMood: (mood: PetMood) => void;

  // UI Notifications & Modals
  levelUpModal: { show: boolean; newLevel: number; newTitle: string } | null;
  chestModal: {
    show: boolean;
    tier: 'wood' | 'silver' | 'gold' | 'legendary';
    reward: { xp: number; tumar: number; item?: string };
  } | null;
  activeNotification: string | null;

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  reducedMotion: boolean;

  // Actions
  addXp: (amount: number) => { leveledUp: boolean; newLevel: number };
  addCurrency: (amount: number) => void;
  claimParentPraise: () => boolean;
  completeMission: (
    missionId: string,
    stars: number,
    xpReward: number,
    coinReward: number,
    unlocks?: string[]
  ) => boolean;
  upgradeBuilding: (buildingKey: string) => boolean;
  claimDailyQuest: (questId: string) => void;
  feedPet: () => void;
  playWithPet: () => void;
  closeLevelUpModal: () => void;
  closeChestModal: () => void;
  openChest: (tier: 'wood' | 'silver' | 'gold' | 'legendary') => boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleReducedMotion: () => void;
  resetProgress: () => void;
}

const DEFAULT_STUDENT: StudentProgress = {
  id: 'student_current',
  name: 'Оқушы',
  grade: 3,
  xp: 0,
  level: 1,
  currency: 0,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: undefined,
  avatar: 'boy',
  title: 'Балапан',
  petName: 'Қыран',
  petStage: 'egg',
  petExp: 0,
  completedMissions: {},
  unlockedRegions: ['home'],
  achievements: [],
  claimedAchievements: [],
  qyranChatCount: 0,
  kazakhWordQuestionIds: [],
  inventory: [],
};

const DEFAULT_DAILY_PROGRESS: DailyProgress = {
  date: getTodayDate(),
  earnedXp: 0,
  requiredXp: 100,
  completedMissionIds: [],
  chestUnlocked: false,
  chestClaimed: false,
};

const INITIAL_CHALLENGES: ChallengeItem[] = [
  {
    id: 'ch_weekly_steppe',
    title: 'Ұлы Дала Апталығы',
    description: 'Осы аптада барлық пәндер бойынша 15 миссияны сәтті аяқта',
    category: 'weekly',
    target: 15,
    current: 0,
    rewardXp: 300,
    rewardCoins: 50,
    badge: '🥇 Ұлы Дала Жеңімпазы',
    completed: false,
    claimed: false,
  },
  {
    id: 'ch_perfect_master',
    title: 'Сүрінбес Сұңқар',
    description: 'Кемінде 5 миссияны 3 жұлдызбен (100% дәлдік) орындап шық',
    category: 'weekly',
    target: 5,
    current: 0,
    rewardXp: 200,
    rewardCoins: 40,
    badge: '⭐ Дәлдік Шебері',
    completed: false,
    claimed: false,
  },
  {
    id: 'ch_class_team',
    title: '3А Сыныбының Ынтымағы',
    description: 'Сыныптастарыңмен бірге оқу миссияларын орындап, ортақ мақсатқа жет',
    category: 'class',
    target: 10,
    current: 0,
    rewardXp: 250,
    rewardCoins: 35,
    badge: '🤝 Достық Туы',
    completed: false,
    claimed: false,
  },
  {
    id: 'ch_reading_quest',
    title: 'Сөз Зергері Саяхаты',
    description: 'Қазақ тілі мен Әдебиеттік оқудан 5 тапсырма шеш',
    category: 'special',
    target: 5,
    current: 0,
    rewardXp: 180,
    rewardCoins: 30,
    badge: '📖 Сөз Зергері',
    completed: false,
    claimed: false,
  },
];

function updateDailyStreak(student: StudentProgress): StudentProgress {
  const today = getTodayDate();
  const last = student.lastActiveDate;

  if (!last) {
    return {
      ...student,
      streak: 1,
      longestStreak: Math.max(student.longestStreak || 0, 1),
      lastActiveDate: today,
    };
  }

  if (last === today) {
    // Older fresh profiles may have a date saved before their first lesson.
    return student.streak === 0 ? { ...student, streak: 1, longestStreak: Math.max(student.longestStreak || 0, 1) } : student;
  }

  const yesterday = getYesterdayDate();
  if (last === yesterday) {
    // Consecutive day
    const newStreak = (student.streak || 0) + 1;
    const longest = Math.max(student.longestStreak || 1, newStreak);
    return {
      ...student,
      streak: newStreak,
      longestStreak: longest,
      lastActiveDate: today,
    };
  }

  // Missed more than one day -> resets to 1
  return {
    ...student,
    streak: 1,
    lastActiveDate: today,
  };
}

export const useGameStore = create<GameState>((set, get) => {
  // Load student from localStorage safely
  let initialStudent = DEFAULT_STUDENT;
  let initialDailyProgress = DEFAULT_DAILY_PROGRESS;
  let initialChallenges = currentChallenges(INITIAL_CHALLENGES);
  let initialBuildings = INITIAL_BUILDINGS;
  let initialQuests = DAILY_QUESTS;
  let initialTeacher: TeacherProfileData = {
    id: 'teacher_1',
    name: 'Ұстаз',
    school: 'BILIMVERSE мектебі',
    className: '3А сыныбы',
  };
  let initialParent: ParentProfileData = {
    id: 'parent_1',
    name: 'Ата-ана',
    childName: 'Оқушы',
  };

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('bilimverse_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        initialStudent = {
          ...DEFAULT_STUDENT,
          ...parsed,
        };
        initialStudent.level = GAME_RULES.levelFor(initialStudent.xp);
        initialStudent.title = GAME_RULES.titleFor(initialStudent.level);
        initialStudent.petStage = GAME_RULES.petStageFor(initialStudent.level);
      }

      const savedDaily = localStorage.getItem('bilimverse_daily_progress');
      if (savedDaily) {
        const parsedDaily = JSON.parse(savedDaily);
        if (parsedDaily.date === getTodayDate()) {
          initialDailyProgress = { ...DEFAULT_DAILY_PROGRESS, ...parsedDaily };
        }
      }

      const savedChallenges = localStorage.getItem('bilimverse_challenges');
      if (savedChallenges) {
        initialChallenges = currentChallenges(JSON.parse(savedChallenges));
      }

      const savedBuildings = localStorage.getItem('bilimverse_buildings');
      if (savedBuildings) {
        const parsedBuildings: VillageBuilding[] = JSON.parse(savedBuildings);
        initialBuildings = INITIAL_BUILDINGS.map((building) => {
          const savedBuilding = parsedBuildings.find((item) => item.key === building.key);
          return savedBuilding
            ? { ...building, level: savedBuilding.level, costToUpgrade: savedBuilding.costToUpgrade }
            : building;
        });
      }

      const savedQuests = localStorage.getItem('bilimverse_daily_quests');
      if (savedQuests && initialDailyProgress.date === getTodayDate()) {
        const parsedQuests = JSON.parse(savedQuests);
        if (parsedQuests.date === getTodayDate()) initialQuests = parsedQuests.quests;
      }

      const savedTeacher = localStorage.getItem('bilimverse_teacher');
      if (savedTeacher) initialTeacher = JSON.parse(savedTeacher);

      const savedParent = localStorage.getItem('bilimverse_parent');
      if (savedParent) initialParent = JSON.parse(savedParent);
    } catch (e) {
      console.warn('Failed to parse saved state:', e);
    }
  }

  const saveStudentToLocal = (s: StudentProgress) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bilimverse_student', JSON.stringify(s));
    }
  };

  const saveDailyToLocal = (dp: DailyProgress) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bilimverse_daily_progress', JSON.stringify(dp));
    }
  };

  const saveChallengesToLocal = (ch: ChallengeItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bilimverse_challenges', JSON.stringify(ch));
    }
  };

  return {
    role: 'STUDENT',
    setRole: (role: Role) => set({ role }),

    student: initialStudent,
    dailyProgress: initialDailyProgress,
    challenges: initialChallenges,
    teacherProfile: initialTeacher,
    parentProfile: initialParent,

    buildings: initialBuildings,
    achievements: ACHIEVEMENTS,
    dailyQuests: initialQuests,

    qyranMood: 'idle',
    setQyranMood: (mood: PetMood) => set({ qyranMood: mood }),

    levelUpModal: null,
    chestModal: null,
    activeNotification: null,

    soundEnabled: true,
    musicEnabled: true,
    reducedMotion: false,

    syncCalendar: () => {
      const today = getTodayDate();
      const { dailyProgress, challenges } = get();
      if (dailyProgress.date !== today) {
        const freshDaily = { ...DEFAULT_DAILY_PROGRESS, date: today };
        saveDailyToLocal(freshDaily);
        if (typeof window !== 'undefined') {
          localStorage.setItem('bilimverse_daily_quests', JSON.stringify({ date: today, quests: DAILY_QUESTS }));
        }
        set({ dailyProgress: freshDaily, dailyQuests: DAILY_QUESTS });
      }
      const refreshedChallenges = currentChallenges(challenges);
      if (refreshedChallenges.some((challenge, index) => challenge.periodEnd !== challenges[index].periodEnd || challenge.current !== challenges[index].current)) {
        saveChallengesToLocal(refreshedChallenges);
        set({ challenges: refreshedChallenges });
      }
    },

    setStudentName: (name: string) => {
      const updated = { ...get().student, name: name.trim() || 'Оқушы' };
      saveStudentToLocal(updated);
      set({ student: updated });
    },

    setStudentAvatar: (avatar: string) => {
      const updated = { ...get().student, avatar };
      saveStudentToLocal(updated);
      set({ student: updated });
    },

    setStudentGrade: (grade: number) => {
      const updated = { ...get().student, grade };
      saveStudentToLocal(updated);
      set({ student: updated });
    },

    setTeacherProfile: (profile: Partial<TeacherProfileData>) => {
      const updated = { ...get().teacherProfile, ...profile };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bilimverse_teacher', JSON.stringify(updated));
      }
      set({ teacherProfile: updated });
    },

    setParentProfile: (profile: Partial<ParentProfileData>) => {
      const updated = { ...get().parentProfile, ...profile };
      if (typeof window !== 'undefined') {
        localStorage.setItem('bilimverse_parent', JSON.stringify(updated));
      }
      set({ parentProfile: updated });
    },

    addXp: (amount: number) => {
      get().syncCalendar();
      const { student, dailyProgress } = get();
      const newXp = student.xp + amount;
      const oldLevel = student.level;
      const newLevel = GAME_RULES.levelFor(newXp);
      const newTitle = GAME_RULES.titleFor(newLevel);
      const newPetStage = GAME_RULES.petStageFor(newLevel);
      const leveledUp = newLevel > oldLevel;

      sounds.play('xp');

      const updatedStudent: StudentProgress = {
        ...student,
        xp: newXp,
        level: newLevel,
        title: newTitle,
        petStage: newPetStage,
      };

      // Update daily XP & unlock chest if threshold reached
      const newEarnedXp = dailyProgress.earnedXp + amount;
      const chestUnlocked = newEarnedXp >= dailyProgress.requiredXp;
      const updatedDaily: DailyProgress = {
        ...dailyProgress,
        earnedXp: newEarnedXp,
        chestUnlocked: chestUnlocked || dailyProgress.chestUnlocked,
      };

      saveStudentToLocal(updatedStudent);
      saveDailyToLocal(updatedDaily);

      set({
        student: updatedStudent,
        dailyProgress: updatedDaily,
        ...(leveledUp
          ? {
              levelUpModal: { show: true, newLevel, newTitle },
              qyranMood: 'celebrating',
            }
          : {}),
      });

      if (leveledUp) {
        sounds.play('levelUp');
      }

      return { leveledUp, newLevel };
    },

    addCurrency: (amount: number) => {
      const { student } = get();
      const updated: StudentProgress = {
        ...student,
        currency: student.currency + amount,
      };
      saveStudentToLocal(updated);
      set({ student: updated });
    },

    claimParentPraise: () => {
      const today = getTodayDate();
      const student = get().student;
      if (student.lastParentPraiseDate === today) return false;

      const updated = { ...student, lastParentPraiseDate: today };
      saveStudentToLocal(updated);
      set({ student: updated });
      get().addXp(50);
      get().addCurrency(20);
      return true;
    },

    claimChallengeReward: (challengeId: string) => {
      get().syncCalendar();
      const { challenges } = get();
      const ch = challenges.find((c) => c.id === challengeId);
      if (!ch || ch.category === 'class' || !ch.completed || ch.claimed) return false;

      // Idempotent: mark claimed once
      const updatedChallenges = challenges.map((c) =>
        c.id === challengeId ? { ...c, claimed: true } : c
      );
      saveChallengesToLocal(updatedChallenges);

      get().addXp(ch.rewardXp);
      get().addCurrency(ch.rewardCoins);
      sounds.play('chest');

      set({ challenges: updatedChallenges });
      return true;
    },

    claimAchievementReward: (achievementId: string) => {
      const { student, achievements } = get();
      const achievement = achievements.find((item) => item.id === achievementId);
      if (!achievement || !student.achievements.includes(achievementId) || student.claimedAchievements?.includes(achievementId)) return false;
      const updated = { ...student, claimedAchievements: [...(student.claimedAchievements || []), achievementId] };
      saveStudentToLocal(updated);
      set({ student: updated });
      get().addXp(achievement.xpReward);
      get().addCurrency(achievement.coinReward);
      return true;
    },

    recordQyranChat: () => {
      const student = get().student;
      const count = (student.qyranChatCount || 0) + 1;
      const achievements = count >= 10
        ? Array.from(new Set([...student.achievements, 'qyran_friend']))
        : student.achievements;
      const updated = { ...student, qyranChatCount: count, achievements };
      saveStudentToLocal(updated);
      set({ student: updated });
    },

    recordKazakhWord: (questionId: string) => {
      const student = get().student;
      if (student.kazakhWordQuestionIds?.includes(questionId)) return;
      const ids = [...(student.kazakhWordQuestionIds || []), questionId];
      const achievements = ids.length >= 15
        ? Array.from(new Set([...student.achievements, 'kazakh_polyglot']))
        : student.achievements;
      const updated = { ...student, kazakhWordQuestionIds: ids, achievements };
      saveStudentToLocal(updated);
      set({ student: updated });
    },

    completeMission: (missionId, stars, xpReward, coinReward, unlocks = []) => {
      get().syncCalendar();
      const { student, dailyQuests, dailyProgress, challenges } = get();
      const isAlreadyCompleted = !!student.completedMissions[missionId];

      // If already completed, give reduced practice reward (idempotency against grinding)
      const actualXp = isAlreadyCompleted ? Math.round(xpReward * 0.2) : xpReward;
      const actualCoins = isAlreadyCompleted ? Math.round(coinReward * 0.2) : coinReward;

      const updatedCompleted = {
        ...student.completedMissions,
        [missionId]: { stars, completedAt: new Date().toISOString() },
      };

      const updatedUnlocked = Array.from(new Set([...student.unlockedRegions, ...unlocks]));

      const activeStudent = updateDailyStreak(student);
      const unlockedAchievements = new Set(activeStudent.achievements);
      unlockedAchievements.add('first_step');
      if (missionId === 'math-boss') unlockedAchievements.add('math_bridge');
      if (missionId === 'math-boss' && stars === 3) unlockedAchievements.add('boss_slayer');
      if (activeStudent.streak >= 6) unlockedAchievements.add('streak_master');
      if (['math-1', 'kazakh-1', 'lit-1', 'science-1', 'world-1', 'eng-1', 'dig-1'].every((id) => updatedCompleted[id])) {
        unlockedAchievements.add('steppes_hero');
      }

      const updatedStudent: StudentProgress = {
        ...activeStudent,
        completedMissions: updatedCompleted,
        unlockedRegions: updatedUnlocked,
        achievements: Array.from(unlockedAchievements),
      };

      // Update daily quests
      const updatedQuests = dailyQuests.map((q) => {
        if (q.id === 'dq_1' && missionId.startsWith('math')) {
          const next = Math.min(q.current + 1, q.target);
          return { ...q, current: next, completed: next >= q.target };
        }
        if (q.id === 'dq_2' && (missionId.startsWith('kazakh') || missionId.startsWith('lit-'))) {
          const next = Math.min(q.current + 1, q.target);
          return { ...q, current: next, completed: next >= q.target };
        }
        if (q.id === 'dq_3') {
          const next = Math.min(q.current + 1, q.target);
          return { ...q, current: next, completed: next >= q.target };
        }
        return q;
      });

      // Update challenges progression
      const updatedChallenges = challenges.map((ch) => {
        let cur = ch.current;
        if (ch.id === 'ch_weekly_steppe' && !isAlreadyCompleted) cur += 1;
        if (ch.id === 'ch_perfect_master' && stars === 3 && !isAlreadyCompleted) cur += 1;
        if (ch.id === 'ch_reading_quest' && !isAlreadyCompleted && (missionId.startsWith('kazakh') || missionId.startsWith('lit-'))) {
          cur += 1;
        }
        const completed = cur >= ch.target;
        return { ...ch, current: Math.min(cur, ch.target), completed: completed || ch.completed };
      });

      // Update daily progress
      const completedIds = Array.from(new Set([...dailyProgress.completedMissionIds, missionId]));

      const updatedDaily: DailyProgress = {
        ...dailyProgress,
        completedMissionIds: completedIds,
        chestUnlocked: dailyProgress.chestUnlocked,
      };

      saveStudentToLocal(updatedStudent);
      saveDailyToLocal(updatedDaily);
      saveChallengesToLocal(updatedChallenges);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bilimverse_daily_quests', JSON.stringify({ date: getTodayDate(), quests: updatedQuests }));
      }

      set({
        student: updatedStudent,
        dailyQuests: updatedQuests,
        dailyProgress: updatedDaily,
        challenges: updatedChallenges,
      });

      get().addXp(actualXp);
      get().addCurrency(actualCoins);

      return true;
    },

    openChest: (tier) => {
      get().syncCalendar();
      const { dailyProgress } = get();

      // STRICT VALIDATION: cannot claim if already claimed today!
      if (dailyProgress.chestClaimed) {
        sounds.play('click');
        return false;
      }

      // STRICT VALIDATION: cannot claim if not unlocked!
      if (!dailyProgress.chestUnlocked) {
        sounds.play('click');
        return false;
      }

      sounds.play('chest');
      const rewardsByTier = {
        wood: { xp: 50, tumar: 15 },
        silver: { xp: 100, tumar: 25 },
        gold: { xp: 200, tumar: 50, item: 'Алтын Қыранның сиқырлы қауырсыны' },
        legendary: { xp: 500, tumar: 150, item: 'Аңызға айналған Хан шапаны' },
      };
      const reward = rewardsByTier[tier];

      // Mark chest as claimed today
      const updatedDaily: DailyProgress = {
        ...dailyProgress,
        chestClaimed: true,
      };
      saveDailyToLocal(updatedDaily);
      set({ dailyProgress: updatedDaily });

      get().addXp(reward.xp);
      get().addCurrency(reward.tumar);

      set({
        chestModal: { show: true, tier, reward },
        qyranMood: 'celebrating',
      });

      return true;
    },

    claimDailyQuest: (questId: string) => {
      get().syncCalendar();
      const { dailyQuests } = get();
      const quest = dailyQuests.find((q) => q.id === questId);
      if (!quest || !quest.completed) return;

      const remainingQuests = dailyQuests.filter((q) => q.id !== questId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('bilimverse_daily_quests', JSON.stringify({ date: getTodayDate(), quests: remainingQuests }));
      }
      set({ dailyQuests: remainingQuests });

      get().addXp(quest.rewardXp);
      get().addCurrency(quest.rewardCoins);
    },

    upgradeBuilding: (buildingKey: string) => {
      const { buildings, student } = get();
      const building = buildings.find((b) => b.key === buildingKey);
      if (!building) return false;
      if (building.level >= building.maxLevel) return false;
      if (student.currency < building.costToUpgrade) return false;

      const updatedStudent = {
        ...student,
        currency: student.currency - building.costToUpgrade,
      };

      const updatedBuildings = buildings.map((b) => {
        if (b.key === buildingKey) {
          return {
            ...b,
            level: b.level + 1,
            costToUpgrade: Math.round(b.costToUpgrade * 1.5),
          };
        }
        return b;
      });

      if (updatedBuildings.filter((b) => b.level >= 2).length >= 5) {
        updatedStudent.achievements = Array.from(new Set([...student.achievements, 'village_builder']));
      }

      saveStudentToLocal(updatedStudent);
      if (typeof window !== 'undefined') localStorage.setItem('bilimverse_buildings', JSON.stringify(updatedBuildings));
      sounds.play('worldUnlock');
      set({
        student: updatedStudent,
        buildings: updatedBuildings,
        qyranMood: 'happy',
      });
      return true;
    },

    feedPet: () => {
      const { student } = get();
      if (student.currency < 10) return;
      sounds.play('correct');
      const updated = {
        ...student,
        currency: student.currency - 10,
        petExp: student.petExp + 25,
      };
      saveStudentToLocal(updated);
      set({ student: updated, qyranMood: 'happy' });
    },

    playWithPet: () => {
      sounds.play('click');
      set({ qyranMood: 'flying' });
    },

    closeLevelUpModal: () => set({ levelUpModal: null, qyranMood: 'idle' }),
    closeChestModal: () => set({ chestModal: null, qyranMood: 'idle' }),

    toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
    toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),

    resetProgress: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bilimverse_student');
        localStorage.removeItem('bilimverse_daily_progress');
        localStorage.removeItem('bilimverse_challenges');
        localStorage.removeItem('bilimverse_buildings');
        localStorage.removeItem('bilimverse_daily_quests');
      }
      set({
        student: DEFAULT_STUDENT,
        dailyProgress: { ...DEFAULT_DAILY_PROGRESS, date: getTodayDate() },
        challenges: currentChallenges(INITIAL_CHALLENGES),
        buildings: INITIAL_BUILDINGS,
        achievements: ACHIEVEMENTS,
        dailyQuests: DAILY_QUESTS,
        qyranMood: 'idle',
      });
    },
  };
});
