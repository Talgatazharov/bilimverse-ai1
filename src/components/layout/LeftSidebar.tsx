'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  MapPin,
  Trophy,
  Swords,
  Bot,
  Sparkles,
  BookOpen,
  Settings,
  Flame,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';
import Image from 'next/image';
import { QyranMascot } from '@/components/mascot/QyranMascot';

const NAV_ITEMS = [
  { href: '/world', label: 'Басты бет', icon: Home },
  { href: '/subjects', label: 'Миссиялар', icon: Compass },
  { href: '/my-world', label: 'Менің әлемім', icon: MapPin },
  { href: '/pet', label: 'Қыран серігім', icon: Flame },
  { href: '/ai-tutor', label: 'AI көмекші', icon: Bot },
  { href: '/adventure', label: 'AI Adventure', icon: Sparkles },
  { href: '/achievements', label: 'Жетістіктер', icon: Trophy },
  { href: '/challenges', label: 'Жарыстар', icon: Swords },
  { href: '/library', label: 'Кітапхана', icon: BookOpen },
  { href: '/settings', label: 'Баптаулар', icon: Settings },
];

export const LeftSidebar: React.FC = () => {
  const pathname = usePathname();
  const { student, qyranMood, setQyranMood } = useGameStore();

  const handleMascotClick = () => {
    sounds.play('click');
    const moods: typeof qyranMood[] = ['happy', 'flying', 'thinking', 'celebrating', 'idle'];
    const next = moods[(moods.indexOf(qyranMood) + 1) % moods.length];
    setQyranMood(next);
  };

  return (
    <aside className="w-64 bg-game-deep/95 border-r border-game-panel/80 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-md z-40 select-none">
      {/* Top Header & Logo */}
      <div className="p-4 border-b border-game-panel/60">
        <Link
          href="/world"
          className="flex items-center gap-3 group"
          onClick={() => sounds.play('click')}
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-gold-glow group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-game-navy rounded-[10px] flex items-center justify-center overflow-hidden">
              <Image
                src="/ui/logo-shanyrak.png"
                alt="Шаңырақ"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-wider text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]">
              BILIMVERSE
            </div>
            <div className="text-[11px] text-game-sky/80 font-medium tracking-tight">
              Білім әлеміне саяхат
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-game-panel">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/world' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => sounds.play(isActive ? 'click' : 'hover')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/25 to-amber-500/5 text-amber-300 border-l-4 border-amber-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'text-slate-300 hover:text-white hover:bg-game-surface/60'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'text-slate-400 group-hover:text-amber-300'
                }`}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-gold-glow animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mascot Qyran Interactive Widget (Requirement 2) */}
      <div className="p-3 border-t border-game-panel/60 bg-game-surface/30">
        <div
          onClick={handleMascotClick}
          className="relative bg-gradient-to-b from-game-surface/90 to-game-navy/90 p-3 rounded-2xl border border-amber-500/30 cursor-pointer hover:border-amber-400 transition-all hover:shadow-gold-glow group"
        >
          {/* Speech Bubble with dynamic name */}
          <div className="relative bg-game-surface/95 border border-sky-400/40 rounded-xl p-2.5 mb-2.5 text-xs text-sky-100 shadow-lg after:content-[''] after:absolute after:bottom-[-6px] after:left-8 after:border-solid after:border-t-game-surface after:border-t-[6px] after:border-x-transparent after:border-x-[6px] after:border-b-0">
            «Сәлем, {student.name || 'Оқушы'}! Бүгін қандай миссияны орындаймыз?»
          </div>

          {/* Qyran Mascot Character without rectangular backgrounds */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 flex-shrink-0 group-hover:scale-110 transition-transform flex items-center justify-center">
              <QyranMascot mood={qyranMood} size={54} />
            </div>
            <div>
              <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                Қыран AI
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {qyranMood === 'idle'
                  ? 'Дайын тұрмын'
                  : qyranMood === 'happy'
                  ? 'Көңілді'
                  : qyranMood === 'thinking'
                  ? 'Ойланып тұр...'
                  : qyranMood === 'celebrating'
                  ? 'Мерекелейміз! 🎉'
                  : 'Серігің'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
