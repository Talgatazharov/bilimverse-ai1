'use client';

import { ASSET_MANIFEST } from '@/lib/asset-manifest';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';
import { Sparkles, Trophy } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, closeLevelUpModal, student } = useGameStore();

  useEffect(() => {
    if (levelUpModal?.show) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#06b6d4', '#10b981', '#ffffff'],
      });
    }
  }, [levelUpModal?.show]);

  if (!levelUpModal?.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-game-surface to-game-navy border-2 border-amber-400 rounded-3xl p-8 text-center shadow-gold-glow-lg overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Shanyrak Background Ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 animate-spin-slow">
          <div className="w-80 h-80 rounded-full border-4 border-dashed border-amber-300" />
        </div>

        {/* Mascot */}
        <div className="relative w-28 h-28 mx-auto mb-4 animate-bounce">
          <Image
            src={ASSET_MANIFEST.qyran.celebrating}
            alt="Қыран"
            width={112}
            height={112}
            className="object-contain filter drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]"
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-amber-400 font-extrabold text-sm tracking-widest uppercase mb-1">
          <Sparkles className="w-4 h-4" />
          ЖАҢА ДЕҢГЕЙ АШЫЛДЫ!
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="text-5xl font-black text-amber-300 drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] my-2">
          {levelUpModal.newLevel}-ДЕҢГЕЙ
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold text-sm mb-4">
          <Trophy className="w-4 h-4 text-amber-400" />
          Атақ: «{levelUpModal.newTitle}»
        </div>

        <p className="text-xs text-sky-100 max-w-xs mx-auto mb-6 leading-relaxed">
          Құттықтаймыз, {student.name}! Сенің білімің мен тәжірибең артып, BILIMVERSE әлемінде жаңа деңгейге көтерілдің.
        </p>

        <button
          onClick={() => {
            sounds.play('click');
            closeLevelUpModal();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-gold-glow transition-all active:scale-95 border-b-4 border-amber-700"
        >
          Саяхатты жалғастыру
        </button>
      </div>
    </div>
  );
};
