'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { getTopicScores, loadLearningAttempts, type LearningAttempt } from '@/lib/local-learning-profile';
import { useGameStore } from '@/stores/useGameStore';
import { SUBJECTS } from '@/data/seed-data';

export default function LearningProfilePage() {
  const student = useGameStore((state) => state.student);
  const [attempts, setAttempts] = React.useState<LearningAttempt[]>([]);
  React.useEffect(() => { setAttempts(loadLearningAttempts()); }, []);
  const scores = getTopicScores(attempts);
  const weakest = scores.find((score) => score.attempts >= 2 && score.correct / score.attempts < .7);

  return <AppLayout showRightPanel={false}>
    <div className="mx-auto max-w-3xl space-y-6 text-slate-100">
      <h1 className="text-3xl font-black text-amber-300">{student.name} · Оқу профилі</h1>
      <p className="text-sm text-slate-300">Тапсырмалардағы жауаптарың бойынша жинақталған нәтиже. Бұл дерек осы браузерде сақталады.</p>
      {weakest && <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
        <strong>Қайталауға ұсыныс:</strong> {weakest.topic} · {Math.round(weakest.correct * 100 / weakest.attempts)}%
        <Link href="/subjects" className="ml-3 text-amber-300 underline">Миссияларға өту</Link>
      </div>}
      {scores.length === 0 && <div className="rounded-2xl border border-game-panel bg-game-surface p-6">Әзірге жауаптар жоқ. Алдымен бір миссияны орындаңыз.</div>}
      {scores.map((score) => {
        const percent = Math.round(score.correct * 100 / score.attempts);
        return <div key={`${score.subjectId}:${score.topic}`} className="rounded-2xl border border-game-panel bg-game-surface p-5">
          <div className="flex justify-between gap-3 text-sm font-bold"><span>{SUBJECTS.find((s) => s.id === score.subjectId)?.name || score.subjectId} · {score.topic}</span><span>{percent}%</span></div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400" style={{ width: `${percent}%` }} /></div>
          <p className="mt-2 text-xs text-slate-400">{score.correct} дұрыс / {score.attempts} жауап</p>
        </div>;
      })}
    </div>
  </AppLayout>;
}
