'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MiniGameContainer } from '@/components/game/MiniGameContainer';
import { ALL_MISSIONS } from '@/data/missions-data';
import { sounds } from '@/lib/sound-manager';
import { loadTeacherMissions } from '@/lib/local-teacher-missions';
import type { Mission } from '@/types';
import { startMissionSession } from '@/lib/question-selection';
import { extraQuestionsFor } from '@/data/question-variants';

export default function MissionPlayPage() {
  const params = useParams();
  const missionId = params?.id as string;
  const builtIn = ALL_MISSIONS.find((m) => m.id === missionId);
  const [localMission, setLocalMission] = React.useState<Mission | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [sessionMission, setSessionMission] = React.useState<Mission | null>(null);
  const sessionCache = React.useRef<{ id: string; mission: Mission } | null>(null);
  React.useEffect(() => {
    setLocalMission(loadTeacherMissions().find((entry) => entry.mission.id === missionId)?.mission || null);
    setLoaded(true);
  }, [missionId]);
  const mission = builtIn || localMission;
  React.useEffect(() => {
    if (!mission) return;
    if (sessionCache.current?.id === mission.id) {
      setSessionMission(sessionCache.current.mission);
      return;
    }
    const selected = startMissionSession(mission, extraQuestionsFor(mission));
    sessionCache.current = { id: mission.id, mission: selected };
    setSessionMission(selected);
  }, [mission]);

  if (!mission) return (
    <AppLayout showRightPanel={false} missionMobileLayout>
      <div className="p-8 text-slate-200">{loaded ? 'Миссия табылмады. Мұғалім тапсырмасын осы браузерде жасаңыз.' : 'Миссия жүктелуде...'}</div>
    </AppLayout>
  );
  if (!sessionMission || sessionMission.id !== mission.id) return (
    <AppLayout showRightPanel={false} missionMobileLayout><div className="p-8 text-slate-200">Сұрақтар таңдалуда...</div></AppLayout>
  );

  return (
    <AppLayout showRightPanel={false} missionMobileLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/subject/${mission.subjectId}`}
            onClick={() => sounds.play('click')}
            className="p-2.5 rounded-xl bg-game-surface hover:bg-game-surfaceHover border border-game-panel text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-amber-300">
              {mission.title}
            </h1>
            <p className="text-xs text-sky-200">
              Миссияны орындап, 3 жұлдыз бен тәжірибе жина
            </p>
          </div>
        </div>

        <MiniGameContainer mission={sessionMission} />
      </div>
    </AppLayout>
  );
}
