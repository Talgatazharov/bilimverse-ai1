'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Trophy } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { ASSET_MANIFEST } from '@/lib/asset-manifest';

export default function LeaderboardPage() {
  const student = useGameStore((state) => state.student);
  const avatar = student.avatar === 'girl' ? ASSET_MANIFEST.avatars.girl : ASSET_MANIFEST.avatars.boy;

  return (
    <AppLayout showRightPanel={true}>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-black text-amber-300 flex items-center gap-2">
          <Trophy className="w-6 h-6" /> Оқушылар рейтингі
        </h1>
        <div className="rounded-3xl border border-game-panel bg-game-surface p-6 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-game-navy">
            <Image src={avatar} alt={student.name} fill className="object-contain" />
          </div>
          <div>
            <div className="font-black text-white">{student.name}</div>
            <div className="text-xs text-slate-400">{student.grade}-сынып · {student.level}-деңгей</div>
            <div className="text-sm font-bold text-amber-300">{student.xp} XP</div>
          </div>
        </div>
        <div className="rounded-3xl border border-amber-400/30 bg-game-surface p-8 text-center space-y-3">
          <div className="text-4xl">🏅</div>
          <h2 className="text-lg font-black text-white">Сынып рейтингі жақында қолжетімді болады</h2>
          <p className="text-sm text-slate-300">Нақты оқушылар деректері қосылғанда орындар XP бойынша есептеледі. Әзірге өз прогресіңді жинай бер!</p>
          <Link href="/challenges" className="inline-block rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950">Жарыстарға оралу</Link>
        </div>
      </div>
    </AppLayout>
  );
}