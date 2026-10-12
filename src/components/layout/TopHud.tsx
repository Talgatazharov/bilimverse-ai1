'use client';

import { ASSET_MANIFEST } from '@/lib/asset-manifest';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Bell, Flame, Gem, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_RULES } from '@/lib/game-rules';
import { sounds } from '@/lib/sound-manager';

export const TopHud: React.FC = () => {
  const { student, soundEnabled, toggleSound } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const progress = GAME_RULES.levelProgress(student.xp);
  const avatarPath =
    student.avatar === 'girl' ? ASSET_MANIFEST.avatars.girl : ASSET_MANIFEST.avatars.boy;

  return (
    <header className="h-20 bg-game-deep/85 border-b border-game-panel/80 px-6 flex items-center justify-between sticky top-0 backdrop-blur-md z-30 select-none">
      {/* Search Bar */}
      <div className="relative w-72 lg:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Нені үйренгіміз келеді? (есеп, ертегі...)"
          className="w-full bg-game-surface/80 border border-game-panel focus:border-amber-400/80 rounded-2xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all shadow-panel-inner"
        />
      </div>

      {/* Right HUD Stats: Crystals, Streak, Sound, Notifications, Player Card */}
      <div className="flex items-center gap-4 lg:gap-5">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Дыбысты өшіру' : 'Дыбысты қосу'}
          className="p-2.5 rounded-xl bg-game-surface/60 hover:bg-game-surface text-slate-300 hover:text-amber-300 border border-game-panel/60 transition-all"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              sounds.play('click');
              setShowNotifications(!showNotifications);
            }}
            className="relative p-2.5 rounded-xl bg-game-surface/60 hover:bg-game-surface text-slate-300 hover:text-amber-300 border border-game-panel/60 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-gold-glow animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-game-navy border border-amber-500/40 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-game-panel mb-3">
                <span className="text-xs font-bold text-amber-300">Хабарламалар</span>
                <span className="text-[10px] text-slate-400">Бүгін</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 bg-game-surface/60 rounded-xl border border-sky-400/20">
                  <div className="font-semibold text-sky-200">✨ Білім әлеміне қош келдің!</div>
                  <div className="text-[11px] text-slate-400">
                    Миссияларды орындап, өз прогресіңді жина.
                  </div>
                </div>
                <div className="p-2.5 bg-game-surface/60 rounded-xl border border-amber-400/20">
                  <div className="font-semibold text-amber-300">
                    🔥 {student.streak} күндік қатарлық!
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Күнделікті сабақтарыңды жалғастырып, алтын сыйлықтарды аш!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Currency (Тұмар) */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-sky-950/70 to-game-navy px-3 py-1.5 rounded-2xl border border-sky-500/40 shadow-turquoise-glow">
          <div className="relative w-5 h-5 flex-shrink-0 animate-pulse">
            <Gem className="w-5 h-5 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
          <span className="font-black text-sm text-cyan-200 tracking-wide">
            {student.currency}
          </span>
          <span className="text-[10px] text-sky-400/80 font-bold hidden sm:inline">Тұмар</span>
        </div>

        {/* Streak (Қатарлық) */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/70 to-game-navy px-3 py-1.5 rounded-2xl border border-amber-500/40 shadow-gold-glow">
          <Flame className="w-5 h-5 text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-bounce" />
          <span className="font-black text-sm text-amber-200 tracking-wide">{student.streak}</span>
          <span className="text-[10px] text-amber-400/80 font-bold hidden sm:inline">күн</span>
        </div>

        {/* Student Profile Card with Animated XP Progress */}
        <Link
          href="/profile"
          onClick={() => sounds.play('click')}
          className="flex items-center gap-3 bg-game-surface/80 hover:bg-game-surface px-3 py-1.5 rounded-2xl border border-game-panel hover:border-amber-400/60 transition-all group"
        >
          {/* Avatar with Level Badge */}
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-game-navy rounded-[10px] overflow-hidden flex items-center justify-center">
                <Image
                  src={avatarPath}
                  alt={student.name || 'Оқушы'}
                  width={38}
                  height={38}
                  className="object-contain scale-110"
                />
              </div>
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full shadow-gold-glow border border-amber-200">
              {student.level}
            </div>
          </div>

          {/* Name & Animated XP bar */}
          <div className="hidden lg:block text-left w-32">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="truncate">{student.name || 'Оқушы'}</span>
              <span className="text-[10px] text-amber-400">{student.grade}-сынып</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 mt-1 overflow-hidden border border-game-panel">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-700 shadow-gold-glow"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-400 text-right mt-0.5">
              {student.xp} / {student.level * GAME_RULES.xpPerLevel} XP
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};
