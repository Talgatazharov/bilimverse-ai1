'use client';

import React from 'react';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGameStore } from '@/stores/useGameStore';
import { Trophy, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AchievementsPage() {
  const { achievements, student, claimAchievementReward } = useGameStore();

  return (
    <AppLayout showRightPanel={true}>
      <div className="space-y-6 max-w-5xl mx-auto select-none">
        <div>
          <h1 className="text-2xl font-black text-amber-300 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            ЖЕТІСТІКТЕР МЕН ҰЛТТЫҚ МЕДАЛЬДАР
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            Қазақы ою-өрнекті медалдар мен арнайы жетістік белгілері
          </p>
        </div>

        {/* Medals Showcase Strip */}
        <div className="relative w-full h-32 rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-xl bg-game-deep p-4 flex items-center justify-center">
          <Image
            src="/ui/rewards-medals-kit.png"
            alt="Медалдар"
            fill
            className="object-contain"
          />
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = student.achievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-game-surface to-game-navy border-amber-400/70 shadow-gold-glow'
                    : 'bg-game-deep/70 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl border border-amber-400/30">
                      {isUnlocked ? '🎖️' : '🔒'}
                    </div>
                    {isUnlocked && (
                      <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Ашылды
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-sm text-white">
                    {ach.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-game-panel/80 flex items-center justify-between text-xs text-amber-400 font-bold">
                  <span>+{ach.xpReward} XP</span>
                  <span>+{ach.coinReward} 💎</span>
                </div>
                {isUnlocked && !student.claimedAchievements?.includes(ach.id) && (
                  <button onClick={() => claimAchievementReward(ach.id)} className="mt-3 w-full rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950">
                    Сыйлықты алу
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
