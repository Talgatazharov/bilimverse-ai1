'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Swords,
  Sparkles,
  Trophy,
  Calendar,
  CheckCircle2,
  Gift,
  ArrowRight,
  Shield,
  Star,
  Users,
  Flame,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';

export default function ChallengesPage() {
  const { challenges, claimChallengeReward } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'weekly' | 'class' | 'special'>('all');
  const [claimToast, setClaimToast] = useState<string | null>(null);

  const filteredChallenges = challenges.filter((c) => {
    if (filter === 'all') return true;
    return c.category === filter;
  });

  const handleClaim = (id: string, title: string) => {
    const success = claimChallengeReward(id);
    if (success) {
      setClaimToast(`«${title}» сыйлығы сәтті алынды! Балансқа XP және Тұмар қосылды!`);
      setTimeout(() => setClaimToast(null), 4000);
    }
  };

  return (
    <AppLayout showRightPanel={true}>
      <div className="space-y-8 max-w-4xl mx-auto select-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-game-panel">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold mb-2 border border-amber-500/20">
              <Swords className="w-4 h-4 text-amber-400" /> ДАЛА ЖАРЫСТАРЫ · АПТАЛЫҚ ЭВЕНТТЕР
            </div>
            <h1 className="text-3xl font-black text-white">
              Ұлы Дала Жарыстары
            </h1>
            <p className="text-xs text-sky-200 mt-1">
              Жеке миссияларды орындап, апталық және арнайы сыйлықтарды аш!
            </p>
          </div>

          <Link
            href="/leaderboard"
            onClick={() => sounds.play('click')}
            className="px-4 py-2.5 rounded-2xl bg-game-surface hover:bg-slate-800 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Лига Рейтингіне өту
          </Link>
        </div>

        {/* Claim Toast Feedback */}
        {claimToast && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-3 animate-scale-up">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{claimToast}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 p-1 rounded-2xl bg-game-surface border border-game-panel w-fit">
          <button
            onClick={() => {
              setFilter('all');
              sounds.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Барлық сынақтар ({challenges.length})
          </button>
          <button
            onClick={() => {
              setFilter('weekly');
              sounds.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'weekly'
                ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Апталық жарыс
          </button>
          <button
            onClick={() => {
              setFilter('class');
              sounds.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'class'
                ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Сыныптық жарыс
          </button>
          <button
            onClick={() => { setFilter('special'); sounds.play('click'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'special' ? 'bg-amber-500 text-slate-950 shadow-gold-glow' : 'text-slate-400 hover:text-white'}`}
          >
            Арнайы
          </button>
        </div>

        {/* Fantasy Event Posters List */}
        <div className="space-y-5">
          {filteredChallenges.map((ch) => {
            const isCompleted = ch.current >= ch.target;
            const isClaimed = ch.claimed;
            const isClass = ch.category === 'class';
            const percent = isClass ? 0 : Math.min(Math.round((ch.current / ch.target) * 100), 100);
            const remainingDays = ch.periodEnd ? Math.max(0, Math.ceil((new Date(`${ch.periodEnd}T23:59:59`).getTime() - Date.now()) / 86_400_000)) : 0;

            return (
              <div
                key={ch.id}
                className={`relative rounded-3xl p-6 border-2 transition-all overflow-hidden ${
                  isClaimed
                    ? 'bg-game-surface/60 border-slate-700/60'
                    : isCompleted
                    ? 'bg-gradient-to-r from-amber-950/50 via-game-surface to-amber-950/40 border-amber-400 shadow-gold-glow'
                    : 'bg-gradient-to-b from-game-surface to-game-navy border-game-panel hover:border-amber-400/50 shadow-xl'
                }`}
              >
                {/* Background Kazakh Ornament watermark */}
                <div className="absolute right-0 top-0 bottom-0 w-36 bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        {ch.category === 'weekly'
                          ? 'Апталық эвент'
                          : ch.category === 'class'
                          ? 'Сынып командасы'
                          : 'Арнайы эвент'}
                      </span>
                      {ch.badge && !isClass && (
                        <span className="text-[11px] text-amber-200 font-bold bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
                          {ch.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-white">{isClass ? 'Сыныптық жарыс' : ch.title}</h3>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      {isClass ? 'Нақты сынып деректері қосылғанда жарыс қолжетімді болады.' : ch.description}
                    </p>
                  </div>

                  {/* Days left / Status Badge */}
                  <div className="flex-shrink-0">
                    {isClass ? (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">Backend қажет · Жақында</span>
                    ) : isClaimed ? (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700">
                        Аяқталды ✓
                      </span>
                    ) : isCompleted ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400 animate-pulse">
                        Орындалды! Сыйлықты ал ✨
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-400/30 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {ch.category === 'weekly' ? `${remainingDays} күн қалды` : 'Арнайы тапсырма'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Сынақ прогресі:</span>
                    <span className="text-amber-300">
                      {isClass ? 'Дерек жоқ' : `${ch.current} / ${ch.target} (${percent}%)`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                          : 'bg-gradient-to-r from-amber-500 to-amber-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Rewards & Claim Action */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-400 font-bold">Марапат:</span>
                    <span className="text-amber-300 font-black flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> +{ch.rewardXp} XP
                    </span>
                    <span className="text-cyan-300 font-black flex items-center gap-1">
                      💎 +{ch.rewardCoins} Тұмар
                    </span>
                  </div>

                  <div>
                    {isClass ? (
                      <button disabled className="py-2.5 px-5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs">Жақында</button>
                    ) : isClaimed ? (
                      <button
                        disabled
                        className="py-2.5 px-5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed border border-slate-700"
                      >
                        Сыйлық алынды ✓
                      </button>
                    ) : isCompleted ? (
                      <button
                        onClick={() => handleClaim(ch.id, ch.title)}
                        className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                      >
                        <Gift className="w-4 h-4" /> Сыйлықты ашу
                      </button>
                    ) : (
                      <Link
                        href="/subjects"
                        onClick={() => sounds.play('click')}
                        className="py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                      >
                        Миссияларға өту <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
