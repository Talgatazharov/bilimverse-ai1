'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  BookOpen,
  ChevronRight,
  PlusCircle,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Filter,
} from 'lucide-react';
import { sounds } from '@/lib/sound-manager';
import { SUBJECTS } from '@/data/seed-data';
import { useGameStore } from '@/stores/useGameStore';
import { loadTeacherMissions, type LocalTeacherMission } from '@/lib/local-teacher-missions';

export default function TeacherMissionsPage() {
  const { teacherProfile, student } = useGameStore();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  const [savedMissions, setSavedMissions] = useState<LocalTeacherMission[]>([]);
  React.useEffect(() => { setSavedMissions(loadTeacherMissions()); }, []);
  const teacherMissions = savedMissions.map(({ mission, assignedClass, createdAt }) => {
    const completion = student.completedMissions[mission.id];
    return {
      id: mission.id,
      title: mission.title,
      subjectId: mission.subjectId,
      subjectName: SUBJECTS.find((subject) => subject.id === mission.subjectId)?.name || mission.subjectId,
      grade: mission.grade,
      assignedClass,
      questionCount: mission.questions.length,
      studentsCompleted: completion ? 1 : 0,
      totalStudents: 1,
      avgScore: completion ? Math.round(completion.stars * 100 / 3) : 0,
      status: completion ? 'completed' : 'active',
      isAiGenerated: true,
      createdAt: new Date(createdAt).toLocaleDateString('kk-KZ'),
    };
  });
  const filteredMissions = teacherMissions.filter((m) => {
    if (selectedSubject !== 'all' && m.subjectId !== selectedSubject) return false;
    return true;
  });

  return (
    <AppLayout showRightPanel={false}>
      <div className="space-y-8 max-w-6xl mx-auto select-none">
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link
              href="/teacher"
              onClick={() => sounds.play('click')}
              className="hover:text-amber-400 transition-colors"
            >
              Ұстаз панелі
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-300 font-bold">Тағайындалған Миссиялар</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-game-panel">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
                <BookOpen className="w-4 h-4" /> ТАПСЫРМАЛАР БАНКІ
              </div>
              <h1 className="text-3xl font-black text-white">
                Сынып Миссиялары мен Тесттер
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {teacherProfile.name || 'Ұстаз'} · Осы браузерде сақталған тест миссиялары
              </p>
            </div>

            <Link
              href="/teacher/create-mission"
              onClick={() => sounds.play('click')}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Жаңа Миссия Жасау (AI)
            </Link>
          </div>
        </div>

        {/* Notification Alert */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Subject Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              setSelectedSubject('all');
              sounds.play('click');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSubject === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                : 'bg-game-surface text-slate-300 border border-game-panel hover:bg-slate-800'
            }`}
          >
            Барлық пәндер
          </button>
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSubject(s.id);
                sounds.play('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedSubject === s.id
                  ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                  : 'bg-game-surface text-slate-300 border border-game-panel hover:bg-slate-800'
              }`}
            >
              <span>{s.name}</span>
            </button>
          ))}
        </div>

        {/* Missions Grid */}
        <div className="space-y-4">
          {filteredMissions.length === 0 && <div className="rounded-2xl border border-game-panel p-6 text-sm text-slate-300">Әзірге осы браузерде жасалған миссия жоқ. «Жаңа Миссия Жасау» батырмасын басыңыз.</div>}
          {filteredMissions.map((m) => {
            const completionPercent = Math.round((m.studentsCompleted / m.totalStudents) * 100);
            return (
              <div
                key={m.id}
                className="p-6 bg-game-surface rounded-3xl border border-game-panel hover:border-amber-400/40 transition-all shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold text-[11px]">
                      {m.subjectName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-semibold">
                      {m.assignedClass}
                    </span>
                    {m.isAiGenerated && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI көмегімен жасалған
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                        m.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {m.status === 'completed' ? 'Аяқталды ✓' : 'Орындалуда'}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white hover:text-amber-300 transition-colors">
                    {m.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span>{m.questionCount} сұрақ</span>
                    <span>•</span>
                    <span>Құрылған уақыты: {m.createdAt}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">Орташа балл: {m.avgScore}%</span>
                  </div>
                </div>

                {/* Progress & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:min-w-[320px] justify-between">
                  <div className="space-y-1.5 w-full sm:w-40">
                    <div className="flex justify-between text-xs text-slate-300 font-semibold">
                      <span>Орындалуы:</span>
                      <span className="text-white font-bold">
                        {m.studentsCompleted}/{m.totalStudents} ({completionPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/mission/${m.id}`}
                      onClick={() => sounds.play('click')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5" /> Қарау
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
