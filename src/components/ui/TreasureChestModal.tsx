'use client';

import { ASSET_MANIFEST } from '@/lib/asset-manifest';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';
import { Sparkles, Gem, Award, Check } from 'lucide-react';

export const TreasureChestModal: React.FC = () => {
  const { chestModal, closeChestModal } = useGameStore();

  useEffect(() => {
    if (chestModal?.show) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#10b981', '#f43f5e'],
      });
    }
  }, [chestModal?.show]);

  if (!chestModal?.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-game-surface to-game-navy border-2 border-amber-400 rounded-3xl p-8 text-center shadow-gold-glow-lg overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Glow rays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/25 via-transparent to-transparent pointer-events-none" />

        {/* Chest Image */}
        <div className="relative w-32 h-32 mx-auto mb-4 animate-bounce">
          <Image
            src={chestModal.tier === 'wood' || chestModal.tier === 'silver'
              ? ASSET_MANIFEST.chests.locked
              : ASSET_MANIFEST.chests.opened}
            alt="Сандық"
            width={128}
            height={128}
            className="object-contain filter drop-shadow-[0_0_25px_rgba(245,158,11,0.9)]"
          />
        </div>

        <h3 className="text-2xl font-black text-amber-300 tracking-wide mb-1">
          СЫЙЛЫҚТАР АШЫЛДЫ!
        </h3>
        <p className="text-xs text-sky-200 mb-6">
          Күнделікті еңбегің үшін берілген қазына:
        </p>

        {/* Reward cards flying out */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 bg-game-navy/80 rounded-2xl border border-amber-500/40 flex items-center justify-center gap-2 shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Тәжірибе</div>
              <div className="text-base font-black text-amber-300">+{chestModal.reward.xp} XP</div>
            </div>
          </div>

          <div className="p-3.5 bg-game-navy/80 rounded-2xl border border-cyan-500/40 flex items-center justify-center gap-2 shadow-inner">
            <Gem className="w-5 h-5 text-cyan-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Кристалл</div>
              <div className="text-base font-black text-cyan-300">+{chestModal.reward.tumar} Тұмар</div>
            </div>
          </div>
        </div>

        {chestModal.reward.item && (
          <div className="p-3 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 rounded-2xl border border-amber-400/50 mb-6 flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-300 text-lg flex-shrink-0">
              🎁
            </div>
            <div>
              <div className="text-[10px] text-amber-400 font-extrabold uppercase">Сирек Жәдігер</div>
              <div className="text-xs font-bold text-white">{chestModal.reward.item}</div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            sounds.play('click');
            closeChestModal();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-gold-glow transition-all active:scale-95 border-b-4 border-amber-700 flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Қабылдау
        </button>
      </div>
    </div>
  );
};
