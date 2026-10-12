'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';
import { Settings, Volume2, Music, Eye, RotateCcw, Check, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const {
    soundEnabled,
    toggleSound,
    musicEnabled,
    toggleMusic,
    reducedMotion,
    toggleReducedMotion,
    resetProgress,
  } = useGameStore();

  return (
    <AppLayout showRightPanel={true}>
      <div className="space-y-6 max-w-2xl mx-auto select-none">
        <div>
          <h1 className="text-2xl font-black text-amber-300 flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" />
            БАПТАУЛАР МЕН ЫҢҒАЙЛЫЛЫҚ
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            Дыбыс, музыка және қозғалыс параметрлерін өзіңе ыңғайлап ретте
          </p>
        </div>

        <div className="bg-game-surface/90 rounded-3xl p-6 sm:p-8 border border-game-panel shadow-xl space-y-5">
          {/* 1. SFX Toggle */}
          <div className="flex items-center justify-between p-4 bg-game-navy rounded-2xl border border-game-panel">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Ойын дыбыстары (SFX)</div>
                <div className="text-xs text-slate-400">Шерту, дұрыс жауап және сыйлық үндері</div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.play('click');
                toggleSound();
              }}
              className={`w-14 h-8 rounded-full p-1 transition-all ${
                soundEnabled ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
              } flex items-center`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          {/* 2. Music Toggle */}
          <div className="flex items-center justify-between p-4 bg-game-navy rounded-2xl border border-game-panel">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Фондық әуен</div>
                <div className="text-xs text-slate-400">Ұлы Даланың сиқырлы тыныш музыкасы</div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.play('click');
                toggleMusic();
              }}
              className={`w-14 h-8 rounded-full p-1 transition-all ${
                musicEnabled ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
              } flex items-center`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          {/* 3. Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-4 bg-game-navy rounded-2xl border border-game-panel">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Қозғалысты азайту (Reduce Motion)</div>
                <div className="text-xs text-slate-400">Анимацияларды тыныштандыру режимі</div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.play('click');
                toggleReducedMotion();
              }}
              className={`w-14 h-8 rounded-full p-1 transition-all ${
                reducedMotion ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
              } flex items-center`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-950 shadow-md" />
            </button>
          </div>

          {/* Kazakh typography check */}
          <div className="p-4 bg-game-deep rounded-2xl border border-game-panel text-xs text-slate-300 space-y-1">
            <div className="font-bold text-amber-300">Қазақ әліпбиінің төл әріптері:</div>
            <div className="text-base font-black text-white tracking-widest">
              Ә ғ Қ ң Ө ұ Ү һ І / ә ғ қ ң ө ұ ү һ і
            </div>
            <div className="text-[10px] text-slate-500">
              Барлық компоненттер қазақ тілінің ережелеріне толық сәйкес.
            </div>
          </div>

          {/* Reset Demo Progress Button */}
          <div className="pt-4 border-t border-game-panel flex justify-end">
            <button
              onClick={() => {
                sounds.play('click');
                if (window.confirm('Барлық оқу прогресін өшіріп, ойынды қайта бастау керек пе?')) {
                  resetProgress();
                  alert('Оқушының прогресі сәтті қайта орнатылды!');
                }
              }}
              className="py-2.5 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Прогресті қайта орнату
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
