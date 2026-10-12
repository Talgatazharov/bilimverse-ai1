'use client';

import React from 'react';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_RULES } from '@/lib/game-rules';
import { sounds } from '@/lib/sound-manager';
import { Sparkles, Heart, Utensils, Play, Moon, Flame } from 'lucide-react';
import { QyranMascot } from '@/components/mascot/QyranMascot';

export default function PetPage() {
  const { student, qyranMood, setQyranMood, feedPet, playWithPet } = useGameStore();

  const stages = [
    { key: 'egg', title: 'Алтын Жұмыртқа', minLevel: 1, icon: '🥚' },
    { key: 'baby', title: 'Балапан Қыран', minLevel: 2, icon: '🐣' },
    { key: 'explorer', title: 'Зерттеуші Қыран', minLevel: 5, icon: '🦅' },
    { key: 'guardian', title: 'Сақшы Қыран', minLevel: 20, icon: '🛡️' },
    { key: 'legendary', title: 'Аңызға Айналған Қыран', minLevel: 50, icon: '👑' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === student.petStage);

  return (
    <AppLayout showRightPanel={true}>
      <div className="space-y-6 max-w-4xl mx-auto select-none">
        <div>
          <h1 className="text-2xl font-black text-amber-300 flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            ҚЫРАН · СЕРІГІҢНІҢ ОРДАСЫ
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            Қыранның деңгейін көтер, күтім жаса және оның түрлену эволюциясын бақыла!
          </p>
        </div>

        {/* Center Pet Stage Arena */}
        <div className="bg-gradient-to-b from-game-surface to-game-navy rounded-3xl p-8 border-2 border-amber-400/80 shadow-gold-glow text-center relative overflow-hidden">
          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />

          {/* Qyran Mascot Animated Figure (Clean vector, zero artifact) */}
          <div className="relative w-40 h-40 mx-auto my-4 cursor-pointer flex items-center justify-center filter drop-shadow-[0_4px_25px_rgba(245,158,11,0.9)] hover:scale-110 transition-transform" onClick={playWithPet}>
            <QyranMascot mood={qyranMood} size={150} animate={true} />
          </div>

          <h2 className="text-2xl font-black text-white">
            {student.petName} · {GAME_RULES.petTitle(student.petStage)}
          </h2>
          <p className="text-xs text-amber-300 font-bold mt-1">
            Көңіл-күйі: {qyranMood === 'happy' ? 'Қуанышты ✦' : qyranMood === 'flying' ? 'Қалықтап ұшуда ✦' : qyranMood === 'sleeping' ? 'Ұйқыда ✦' : 'Дайын ✦'}
          </p>

          {/* Evolution Progression Bar */}
          <div className="max-w-md mx-auto my-6">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-bold">
              <span>Эволюция тәжірибесі</span>
              <span className="text-amber-400">{student.petExp} / 1000 EXP</span>
            </div>
            <div className="w-full bg-game-deep rounded-full h-3 overflow-hidden border border-game-panel">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all duration-700 shadow-gold-glow"
                style={{ width: `${Math.min((student.petExp / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Action Buttons: Feed, Play, Sleep */}
          <div className="flex flex-wrap gap-3 justify-center max-w-sm mx-auto">
            <button
              onClick={feedPet}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Utensils className="w-4 h-4" />
              Тамақ беру (10 💎)
            </button>
            <button
              onClick={playWithPet}
              className="flex-1 py-3 px-4 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400 text-sky-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-4 h-4" />
              Ұшыру & Ойнау
            </button>
            <button
              onClick={() => {
                sounds.play('click');
                setQyranMood('sleeping');
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Moon className="w-4 h-4" />
              Демалдыру
            </button>
          </div>
        </div>

        {/* 5 Evolutionary Stages Road */}
        <div className="bg-game-surface/80 rounded-3xl p-6 border border-game-panel space-y-4">
          <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Эволюция баспалдақтары
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            {stages.map((st, idx) => {
              const isReached = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={st.key}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-400 shadow-gold-glow scale-105'
                      : isReached
                      ? 'bg-game-navy/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-game-deep/50 border-slate-800 opacity-60 text-slate-500'
                  }`}
                >
                  <div className="text-3xl mb-2">{st.icon}</div>
                  <div className="text-xs font-black">{st.title}</div>
                  <div className="text-[10px] mt-1 opacity-80">
                    {st.minLevel}-деңгейден бастап
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
