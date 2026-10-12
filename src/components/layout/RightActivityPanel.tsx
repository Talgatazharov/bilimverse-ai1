'use client';

import { ASSET_MANIFEST } from '@/lib/asset-manifest';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gift, Flame, CheckCircle2, Circle, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';

export const RightActivityPanel: React.FC = () => {
  const { student, dailyQuests, dailyProgress, openChest } = useGameStore();

  const allCompleted = dailyQuests.every((q) => q.completed);
  const isChestReady = dailyProgress.chestUnlocked && !dailyProgress.chestClaimed;
  const isChestClaimed = dailyProgress.chestClaimed;
  const xpRemaining = Math.max(0, dailyProgress.requiredXp - dailyProgress.earnedXp);

  const handleOpenChest = () => {
    if (isChestClaimed || !dailyProgress.chestUnlocked) return;
    openChest('gold');
  };

  return (
    <aside className="w-80 bg-game-deep/95 border-l border-game-panel/80 p-5 flex flex-col gap-6 h-screen sticky top-0 overflow-y-auto scrollbar-thin scrollbar-thumb-game-panel select-none backdrop-blur-md z-30">
      {/* 1. Daily Missions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-slate-100 tracking-wide">
              Бүгінгі миссиялар
            </h3>
          </div>
          <span className="text-[11px] font-bold text-amber-400">
            {dailyQuests.filter((q) => q.completed).length}/{dailyQuests.length} ✓
          </span>
        </div>

        {/* Quests List */}
        <div className="space-y-3">
          {dailyQuests.map((quest) => (
            <div
              key={quest.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                quest.completed
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-game-surface/80 border-game-panel/80 hover:border-amber-400/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-xs font-semibold ${
                    quest.completed ? 'text-emerald-300' : 'text-slate-200'
                  }`}
                >
                  {quest.title}
                </span>
                {quest.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    quest.completed
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min((quest.current / quest.target) * 100, 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400">
                <span>
                  {quest.current}/{quest.target}
                </span>
                <span className="text-amber-400 font-bold">
                  +{quest.rewardXp} XP · +{quest.rewardCoins} 💎
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive Treasure Chest (Requirement 8) */}
      <div
        className={`rounded-3xl p-5 border text-center relative transition-all ${
          isChestClaimed
            ? 'bg-slate-900/60 border-slate-700/60'
            : isChestReady
            ? 'bg-gradient-to-b from-amber-950/60 to-game-navy/90 border-amber-400 shadow-gold-glow animate-pulse-glow'
            : 'bg-gradient-to-b from-game-surface/90 to-game-navy/90 border-game-panel'
        }`}
      >
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
              isChestClaimed
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : isChestReady
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {isChestClaimed ? 'АЛЫНДЫ ✓' : isChestReady ? 'ДАЙЫН! ✨' : 'ҚҰЛЫПТАУЛЫ 🔒'}
          </span>
        </div>

        {/* Chest Illustration */}
        <div className="relative w-24 h-24 mx-auto my-2 transition-transform">
          <Image
            src={
              isChestClaimed
                ? ASSET_MANIFEST.chests.opened
                : isChestReady
                ? ASSET_MANIFEST.chests.ready
                : ASSET_MANIFEST.chests.locked
            }
            alt="Алтын Сандық"
            width={96}
            height={96}
            className={`object-contain filter ${
              isChestReady
                ? 'drop-shadow-[0_8px_20px_rgba(245,158,11,0.8)] animate-bounce'
                : 'opacity-85'
            }`}
          />
        </div>

        <h4 className="text-sm font-extrabold text-amber-200 mt-2">
          {isChestClaimed
            ? 'Бүгінгі сыйлық алынды'
            : isChestReady
            ? 'Алтын Сандық дайын!'
            : 'Күнделікті Сыйлық'}
        </h4>

        {/* Progress condition text */}
        <div className="text-[11px] text-slate-300 mt-1 mb-3">
          {isChestClaimed ? (
            <span className="text-emerald-400 font-semibold">
              Келесі сандық ертең жаңа күні ашылады.
            </span>
          ) : isChestReady ? (
            <span className="text-amber-300 font-semibold">
              Тапсырмалар орындалды! Сандықты ашып, сыйлығыңды ал.
            </span>
          ) : (
            <div>
              <div className="text-slate-400 mb-1.5">
                Ашу үшін тағы <strong className="text-amber-400">{xpRemaining} XP</strong> жина
              </div>
              {/* Daily XP progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (dailyProgress.earnedXp / dailyProgress.requiredXp) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {dailyProgress.earnedXp} / {dailyProgress.requiredXp} XP
              </div>
            </div>
          )}
        </div>

        {/* Claim / Status Button */}
        <button
          onClick={handleOpenChest}
          disabled={!isChestReady}
          className={`w-full py-3 px-4 rounded-2xl font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
            isChestClaimed
              ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
              : isChestReady
              ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-gold-glow hover:shadow-gold-glow-lg active:scale-95 border-b-4 border-amber-700 cursor-pointer'
              : 'bg-slate-800/80 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          {isChestClaimed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ашылды ✓
            </>
          ) : isChestReady ? (
            <>
              <Gift className="w-4 h-4" /> Сыйлықты ашу
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" /> 🔒 Құлыптаулы ({dailyProgress.earnedXp}/
              {dailyProgress.requiredXp} XP)
            </>
          )}
        </button>
      </div>

      {/* 3. Daily Streak Section (Requirement 9) */}
      <div className="bg-game-surface/80 rounded-3xl p-4 border border-game-panel/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400 filter drop-shadow-[0_0_6px_rgba(251,146,60,0.8)]" />
            <h3 className="font-extrabold text-xs text-slate-200">Күнделікті қатарлық</h3>
          </div>
          <span className="text-xs font-extrabold text-amber-400">{student.streak} күн</span>
        </div>

        {/* 7 Days Flame Nodes */}
        <div className="grid grid-cols-7 gap-1.5 text-center mt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isCompleted = day <= student.streak;
            const isCurrent = day === student.streak;
            const isRewardDay = day === 7;

            return (
              <div
                key={day}
                className={`flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                    : 'bg-game-navy/60 border-game-panel/60 text-slate-500'
                } ${isCurrent ? 'ring-2 ring-amber-400 shadow-gold-glow' : ''}`}
              >
                <span className="text-[10px] font-bold mb-1">{day}</span>
                <Flame
                  className={`w-4 h-4 ${
                    isCompleted
                      ? 'text-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.9)]'
                      : 'text-slate-600'
                  }`}
                />
                {isRewardDay && (
                  <span className="text-[8px] mt-1 font-bold text-cyan-400 uppercase">🎁</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-3">
          {student.streak > 0
            ? `${student.streak} күн қатарынан оқыдың. Қатарлықты жалғастыр!`
            : 'Алғашқы миссияңды орындап, күндік қатарлықты баста!'}
        </p>
      </div>

      {/* 4. Quick Village Link */}
      <div className="mt-auto">
        <Link
          href="/my-world"
          onClick={() => sounds.play('click')}
          className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-game-surface border border-emerald-500/30 hover:border-emerald-400 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              🏡
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-200">Білім Аулың</div>
              <div className="text-[10px] text-slate-400">10 ғимарат жаңартуға дайын</div>
            </div>
          </div>
          <span className="text-xs text-emerald-400 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </div>
    </aside>
  );
};
