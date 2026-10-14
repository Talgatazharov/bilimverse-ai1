'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { loadTeacherMissions, type LocalTeacherMission } from '@/lib/local-teacher-missions';
import { useGameStore } from '@/stores/useGameStore';

export default function HomeworkPage() {
  const student = useGameStore((state) => state.student);
  const [assignments, setAssignments] = React.useState<LocalTeacherMission[]>([]);
  React.useEffect(() => { setAssignments(loadTeacherMissions()); }, []);
  const visible = assignments.filter(({ mission }) => mission.grade === student.grade);

  return (
    <AppLayout showRightPanel={false}>
      <div className="mx-auto max-w-3xl space-y-5 text-slate-100">
        <h1 className="text-3xl font-black text-amber-300">Үй тапсырмалары</h1>
        <p className="text-sm text-slate-300">Осы браузерде мұғалім құрастырған {student.grade}-сынып миссиялары.</p>
        {visible.length === 0 && <div className="rounded-2xl border border-game-panel bg-game-surface p-6">Әзірге тапсырма тағайындалмаған.</div>}
        {visible.map(({ mission, assignedClass }) => {
          const done = student.completedMissions[mission.id];
          return <div key={mission.id} className="rounded-2xl border border-game-panel bg-game-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-amber-300">{assignedClass} · {mission.questions.length} сұрақ</div>
                <h2 className="text-lg font-bold">{mission.title}</h2>
                <p className="mt-1 text-sm text-slate-300">{done ? `Орындалды · ${done.stars} жұлдыз` : mission.description}</p>
              </div>
              <Link href={`/mission/${mission.id}`} className="rounded-xl bg-amber-400 px-4 py-2 font-bold text-slate-950">{done ? 'Қайта ашу' : 'Орындау'}</Link>
            </div>
          </div>;
        })}
      </div>
    </AppLayout>
  );
}
