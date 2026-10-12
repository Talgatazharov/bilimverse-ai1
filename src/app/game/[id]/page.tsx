'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MiniGameContainer } from '@/components/game/MiniGameContainer';
import { ALL_MISSIONS } from '@/data/missions-data';
import { sounds } from '@/lib/sound-manager';

export default function GamePlayPage() {
  const params = useParams();
  const gameId = params?.id as string;
  const mission = ALL_MISSIONS.find((m) => m.id === gameId) || ALL_MISSIONS[0];

  return (
    <AppLayout showRightPanel={false}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/subjects"
            onClick={() => sounds.play('click')}
            className="p-2.5 rounded-xl bg-game-surface hover:bg-game-surfaceHover border border-game-panel text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-amber-300">
              {mission.title} · Mini-Game
            </h1>
            <p className="text-xs text-sky-200">
              Ойын форматындағы интерактивті білім сынағы
            </p>
          </div>
        </div>

        <MiniGameContainer mission={mission} />
      </div>
    </AppLayout>
  );
}
