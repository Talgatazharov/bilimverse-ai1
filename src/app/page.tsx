'use client';

import { ASSET_MANIFEST } from '@/lib/asset-manifest';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { sounds } from '@/lib/sound-manager';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-game-deep text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background World Glow */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none scale-105"
        style={{ backgroundImage: 'url(/world/main-map.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-game-deep via-game-deep/80 to-transparent pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-gold-glow">
            <div className="w-full h-full bg-game-navy rounded-[14px] flex items-center justify-center">
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
            <h1 className="font-black text-xl text-amber-300 tracking-wider">
              BILIMVERSE AI
            </h1>
            <p className="text-[11px] text-sky-200">
              Қазақы Future Fantasy білім әлемі
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            onClick={() => sounds.play('click')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-game-surface/80 border border-game-panel transition-all"
          >
            Кіру
          </Link>
          <Link
            href="/world"
            onClick={() => sounds.play('portal')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs tracking-wider uppercase shadow-gold-glow transition-all"
          >
            Білім әлемін ашу
          </Link>
        </div>
      </header>

      {/* Center Cinematic Hero */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center flex flex-col items-center">
        {/* Shanyrak Portal Ring */}
        <div className="relative w-44 h-44 my-4 group cursor-pointer" onClick={() => sounds.play('portal')}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-cyan-400 to-emerald-400 opacity-60 blur-xl animate-pulse" />
          <div className="relative w-full h-full rounded-full border-4 border-amber-400/80 p-3 shadow-gold-glow-lg flex items-center justify-center bg-game-navy/90 backdrop-blur-md">
            <Image
              src={ASSET_MANIFEST.qyran.idle}
              alt="Қыран"
              width={140}
              height={140}
              unoptimized
              className="object-contain animate-float-slow filter drop-shadow-[0_4px_16px_rgba(245,158,11,0.9)]"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4" />
          1–4 СЫНЫП ОҚУШЫЛАРЫНА АРНАЛҒАН ЖАҢА ДӘУІР
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-400 leading-tight">
          Білім әлеміне <br /> саяхат басталсын!
        </h2>

        <p className="text-base sm:text-lg text-sky-100/90 max-w-xl mx-auto mt-4 mb-8 leading-relaxed">
          Қазақ даласының ертегілік аймақтары. Қыран AI серігіңмен бірге миссиялар орында,
          бастықтарды жең, ауылыңды дамыт!
        </p>

        {/* Big Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link
            href="/onboarding"
            onClick={() => sounds.play('portal')}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wider uppercase shadow-gold-glow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-amber-700"
          >
            Өз әлеміңді құр
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/world"
            onClick={() => sounds.play('click')}
            className="flex-1 py-4 px-6 rounded-2xl bg-game-surface/90 hover:bg-game-surface border-2 border-amber-400/40 hover:border-amber-400 text-white font-extrabold text-sm tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            Әлемге кіру
          </Link>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-slate-300 font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">✦</span> 7 Сиқырлы Пән Әлемі
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">✦</span> Қыран AI Сократтық Көмекші
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">✦</span> Білім Ауылы & Сақшы Сынағы
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-slate-500 border-t border-game-panel/40">
        BILIMVERSE AI © 2026 · Қазақстанның заманауи білім беру ойын платформасы
      </footer>
    </div>
  );
}
