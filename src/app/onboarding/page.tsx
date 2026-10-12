'use client';

import { ASSET_MANIFEST } from '@/lib/asset-manifest';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ArrowLeft, Check, Compass } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';

export default function OnboardingPage() {
  const router = useRouter();
  const { student, setStudentName, setStudentAvatar, setStudentGrade } = useGameStore();

  const [step, setStep] = useState(0);
  const [name, setName] = useState(student.name && student.name !== 'Оқушы' ? student.name : '');
  const [grade, setGrade] = useState(student.grade || 3);
  const [avatar, setAvatar] = useState<'boy' | 'girl'>(student.avatar === 'girl' ? 'girl' : 'boy');

  const avatarsList = [
    {
      id: 'boy' as const,
      label: 'Ұл кейіпкер',
      desc: 'Қазақы шапан мен тақия киген жас зерттеуші',
      img: ASSET_MANIFEST.avatars.boy,
    },
    {
      id: 'girl' as const,
      label: 'Қыз кейіпкер',
      desc: 'Ұлттық көйлек пен сәукеле/тақия киген жас ғалым',
      img: ASSET_MANIFEST.avatars.girl,
    },
  ];

  const handleNext = () => {
    sounds.play('click');
    if (step === 0 && !name.trim()) {
      setName('Оқушы');
    }

    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      // Save all student profile selections to single source of truth!
      const chosenName = name.trim() || 'Оқушы';
      setStudentName(chosenName);
      setStudentAvatar(avatar);
      setStudentGrade(grade);

      sounds.play('portal');
      router.push('/world');
    }
  };

  const handleBack = () => {
    sounds.play('click');
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-game-deep text-white flex flex-col justify-center items-center p-6 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 20%, rgba(30, 58, 138, 0.4) 0%, rgba(2, 6, 23, 0.95) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-xl bg-gradient-to-b from-game-surface/95 to-game-navy/95 border-2 border-amber-400/50 rounded-3xl p-8 sm:p-10 shadow-gold-glow backdrop-blur-md">
        {/* Progress Step Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-game-panel/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
              BILIMVERSE AI · САЯХАТҚА ДАЙЫНДЫҚ
            </span>
          </div>
          <span className="text-xs font-bold text-sky-300">
            {step + 1} / 5 Қадам
          </span>
        </div>

        {/* Step 1: Student Name (Requirement 4) */}
        {step === 0 && (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="text-4xl">👋</div>
            <h2 className="text-2xl font-black text-amber-300">
              Сенің есімің кім?
            </h2>
            <p className="text-xs text-sky-200">
              Бұл сиқырлы әлемде сені қалай атаймыз?
            </p>

            <input
              type="text"
              autoFocus
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              placeholder="Есіміңді жаз (мысалы: Талғат, Айсұлу...)"
              className="w-full bg-game-navy border-2 border-amber-400/50 focus:border-amber-400 rounded-2xl py-3.5 px-5 text-center text-lg font-bold text-amber-200 focus:outline-none shadow-panel-inner placeholder-slate-500"
            />
          </div>
        )}

        {/* Step 2: Grade Selection */}
        {step === 1 && (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="text-4xl">📚</div>
            <h2 className="text-2xl font-black text-amber-300">
              Қай сыныпта оқисың?
            </h2>
            <p className="text-xs text-sky-200">
              Тапсырмалар мен деңгейлер сенің сыныбыңа бейімделеді.
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              {[1, 2, 3, 4].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    sounds.play('click');
                    setGrade(g);
                  }}
                  className={`py-4 px-6 rounded-2xl font-black text-lg transition-all border-2 ${
                    grade === g
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-gold-glow scale-105'
                      : 'bg-game-navy text-slate-200 border-game-panel hover:border-amber-400/50'
                  }`}
                >
                  {g}-сынып
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Avatar Selection from Reference Sheet (Requirement 3) */}
        {step === 2 && (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <h2 className="text-2xl font-black text-amber-300">
              Кейіпкеріңді таңда
            </h2>
            <p className="text-xs text-sky-200">
              Ұлы Даланы бірге кезетін өзіңнің сүйікті кейіпкерің:
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {avatarsList.map((av) => (
                <div
                  key={av.id}
                  onClick={() => {
                    sounds.play('click');
                    setAvatar(av.id);
                  }}
                  className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center ${
                    avatar === av.id
                      ? 'bg-amber-500/25 border-amber-400 shadow-gold-glow scale-105 ring-2 ring-amber-300'
                      : 'bg-game-navy border-game-panel hover:border-amber-400/40'
                  }`}
                >
                  <div className="relative w-24 h-32 mb-3">
                    <Image
                      src={av.img}
                      alt={av.label}
                      fill
                      className="object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                  <span className="text-sm font-black text-amber-200 text-center">
                    {av.label}
                  </span>
                  <span className="text-[10px] text-slate-400 text-center mt-1">
                    {av.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Mascot Qyran Introduction */}
        {step === 3 && (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="relative w-28 h-28 mx-auto animate-bounce">
              <Image
                src={ASSET_MANIFEST.qyran.happy}
                alt="Қыран"
                width={112}
                height={112}
                className="object-contain filter drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]"
              />
            </div>

            <h2 className="text-2xl font-black text-amber-300">
              Серігіңмен таныс — Қыран!
            </h2>
            <div className="p-4 bg-sky-950/60 rounded-2xl border border-sky-400/40 text-xs text-sky-100 max-w-sm mx-auto leading-relaxed">
              «Сәлем, {name || 'жас саяхатшы'}! Мен сенің AI серігің — Қыранмын. Қиын есептерде ақыл қосамын,
              жаңа аймақтарға бірге ұшамыз!»
            </div>
          </div>
        )}

        {/* Step 5: Ready to Enter World */}
        {step === 4 && (
          <div className="space-y-6 text-center animate-in fade-in duration-300">
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={ASSET_MANIFEST.game.yurt}
                alt="Киіз үй"
                width={128}
                height={100}
                className="object-contain mx-auto filter drop-shadow-[0_8px_20px_rgba(245,158,11,0.7)]"
              />
            </div>

            <h2 className="text-2xl font-black text-amber-300">
              Алғашқы әлемің дайын, {name || 'Оқушы'}!
            </h2>
            <p className="text-xs text-sky-200 max-w-sm mx-auto leading-relaxed">
              Бір киіз үй. Бір ағаш. Алда — 7 сиқырлы пән патшалығы!
              Саяхатты <strong>1-деңгейден</strong>, 0 XP және 0 Тұмармен бастайсың. Алғашқы сыйлықтарды миссиялардан жинайсың!
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-game-panel/80">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Артқа
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="py-3 px-6 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-gold-glow flex items-center gap-2 transition-all active:scale-95 border-b-4 border-amber-700"
          >
            {step === 4 ? 'Әлемге кіру' : 'Жалғастыру'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
