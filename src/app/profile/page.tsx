'use client';

import { ASSET_MANIFEST } from '@/lib/asset-manifest';

import React, { useState } from 'react';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_RULES } from '@/lib/game-rules';
import { sounds } from '@/lib/sound-manager';
import {
  User,
  Sparkles,
  Trophy,
  Flame,
  Gem,
  Check,
  Shirt,
  Crown,
  Edit2,
  Save,
} from 'lucide-react';

export default function ProfilePage() {
  const { student, setStudentName, setStudentAvatar } = useGameStore();
  const [selectedCostume, setSelectedCostume] = useState('modern-shapan');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(student.name || 'Оқушы');

  const progress = GAME_RULES.levelProgress(student.xp);

  const avatarSrc =
    student.avatar === 'girl' ? ASSET_MANIFEST.avatars.girl : ASSET_MANIFEST.avatars.boy;

  const handleSaveName = () => {
    sounds.play('click');
    setStudentName(nameInput.trim() || 'Оқушы');
    setIsEditingName(false);
  };

  const handleToggleAvatar = (av: 'boy' | 'girl') => {
    sounds.play('click');
    setStudentAvatar(av);
  };

  const costumes = [
    { id: 'modern-shapan', name: 'Заманауи Алтын Шапан', icon: '👘', rarity: 'Аңызға айналған' },
    { id: 'takiya-feather', name: 'Үкілі Тақия', icon: '🪶', rarity: 'Сирек' },
    { id: 'ornament-hoodie', name: 'Оюлы Future Худи', icon: '👕', rarity: 'Қарапайым' },
    { id: 'alatau-boots', name: 'Алатау Саптама Етігі', icon: '👢', rarity: 'Сирек' },
    { id: 'tumar-amulet', name: 'Күміс Тұмар Бойтұмары', icon: '💎', rarity: 'Эпикалық' },
  ];

  return (
    <AppLayout showRightPanel={true}>
      <div className="space-y-6 max-w-4xl mx-auto select-none">
        <div>
          <h1 className="text-2xl font-black text-amber-300 flex items-center gap-2">
            <User className="w-6 h-6 text-amber-400" />
            ОҚУШЫ ПАСПОРТЫ · КЕЙІПКЕР БАПТАУ
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            Өз жетістіктерің мен қазақы ұлттық стильдегі кейіпкер баптаулары
          </p>
        </div>

        {/* 1. Main Student Passport Card */}
        <div className="bg-gradient-to-b from-game-surface to-game-navy rounded-3xl p-6 sm:p-8 border-2 border-amber-400/80 shadow-gold-glow flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Showcase with Golden Frame */}
          <div className="relative flex-shrink-0 flex flex-col items-center gap-3">
            <div className="w-36 h-48 rounded-3xl bg-gradient-to-b from-amber-400 to-amber-700 p-1 shadow-gold-glow-lg">
              <div className="w-full h-full bg-game-navy rounded-[22px] overflow-hidden relative flex items-center justify-center">
                <Image
                  src={avatarSrc}
                  alt={student.name}
                  width={140}
                  height={190}
                  className="object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                />
              </div>
            </div>

            {/* Level Badge */}
            <div className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-gold-glow border border-amber-200">
              {student.level}-ДЕҢГЕЙ · {student.title}
            </div>

            {/* Avatar Switcher buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleAvatar('boy')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  student.avatar !== 'girl'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-gold-glow font-black'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                👦 Ұл
              </button>
              <button
                onClick={() => handleToggleAvatar('girl')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  student.avatar === 'girl'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-gold-glow font-black'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                👧 Қыз
              </button>
            </div>
          </div>

          {/* Student Info & Stats */}
          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="bg-slate-900 border border-amber-400 rounded-xl px-3 py-1 text-lg font-bold text-white focus:outline-none"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-gold-glow"
                    >
                      <Save className="w-3.5 h-3.5" /> Сақтау
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <h2 className="text-2xl font-black text-white">{student.name}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Есіміңді өзгерту"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/40">
                  {student.grade}-сынып оқушысы
                </span>
              </div>
              <p className="text-xs text-sky-300 font-bold mt-1">
                Серігі: «{student.petName}» ({student.petStage})
              </p>
            </div>

            {/* XP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Жалпы Тәжірибе (XP)</span>
                <span className="text-amber-400">
                  {student.xp} / {student.level * GAME_RULES.xpPerLevel} XP
                </span>
              </div>
              <div className="w-full bg-game-deep rounded-full h-3 overflow-hidden border border-game-panel">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all duration-700 shadow-gold-glow"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-game-deep/80 rounded-2xl border border-game-panel text-center">
                <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <div className="text-sm font-black text-amber-300">{student.streak} күн</div>
                <div className="text-[10px] text-slate-400">Қатарлық</div>
              </div>

              <div className="p-3 bg-game-deep/80 rounded-2xl border border-game-panel text-center">
                <Gem className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <div className="text-sm font-black text-cyan-200">{student.currency}</div>
                <div className="text-[10px] text-slate-400">Тұмар</div>
              </div>

              <div className="p-3 bg-game-deep/80 rounded-2xl border border-game-panel text-center">
                <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-sm font-black text-purple-300">
                  {student.achievements.length}
                </div>
                <div className="text-[10px] text-slate-400">Жетістік</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Kazakh Wardrobe / Costumes */}
        <div className="bg-game-surface/90 rounded-3xl p-6 border border-game-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Shirt className="w-4 h-4 text-amber-400" />
              Ұлттық Киімдер Гардеробы
            </h3>
            <span className="text-[11px] text-slate-400">
              Миссиялар мен деңгейлер арқылы ашылады
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {costumes.map((c) => {
              const isSelected = selectedCostume === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    sounds.play('click');
                    setSelectedCostume(c.id);
                  }}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 shadow-gold-glow'
                      : 'bg-game-navy/60 border-game-panel/80 hover:border-amber-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{c.name}</div>
                      <div className="text-[10px] text-amber-400/90 font-semibold">{c.rarity}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
