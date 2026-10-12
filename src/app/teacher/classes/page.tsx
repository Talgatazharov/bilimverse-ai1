'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Users,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { sounds } from '@/lib/sound-manager';
import { useGameStore } from '@/stores/useGameStore';

export default function TeacherClassesPage() {
  const { student, teacherProfile } = useGameStore();

  const classes = [
    {
      id: '3a',
      name: '3А сыныбы',
      grade: 3,
      studentsCount: 24,
      avgMastery: 84,
      weeklyActive: '100%',
      completedMissions: 182,
      topSubject: 'Математика',
      weakTopic: 'Бөлу кестесі (3 оқушы)',
      roomTeacher: teacherProfile.name || 'Ұстаз',
      topStudents: [`${student.name || 'Оқушы'} (Lv. ${student.level})`, 'Айзере (Lv. 6)', 'Әлихан (Lv. 6)'],
    },
    {
      id: '3b',
      name: '3Ә сыныбы',
      grade: 3,
      studentsCount: 22,
      avgMastery: 79,
      weeklyActive: '95%',
      completedMissions: 154,
      topSubject: 'Қазақ тілі',
      weakTopic: 'Жалғаулар (5 оқушы)',
      roomTeacher: teacherProfile.name || 'Ұстаз',
      topStudents: ['Дидар (Lv. 6)', 'Мәдина (Lv. 5)', 'Сұлтан (Lv. 5)'],
    },
    {
      id: '4a',
      name: '4А сыныбы',
      grade: 4,
      studentsCount: 26,
      avgMastery: 88,
      weeklyActive: '96%',
      completedMissions: 210,
      topSubject: 'Цифрлық сауаттылық',
      weakTopic: 'Көптаңбалы көбейту (2 оқушы)',
      roomTeacher: teacherProfile.name || 'Ұстаз',
      topStudents: ['Рамазан (Lv. 8)', 'Амина (Lv. 7)', 'Нұрислам (Lv. 7)'],
    },
  ];

  return (
    <AppLayout showRightPanel={false}>
      <div className="space-y-8 max-w-6xl mx-auto select-none">
        {/* Navigation Breadcrumb & Header */}
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
            <span className="text-amber-300 font-bold">Сыныптар</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-game-panel">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
                <Users className="w-4 h-4" /> СЫНЫПТАР ТІЗІМІ
              </div>
              <h1 className="text-3xl font-black text-white">
                Менің Сыныптарым
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {teacherProfile.name || 'Ұстаз'} · Барлығы 3 сынып, 72 оқушы · {teacherProfile.school}
              </p>
            </div>

            <Link
              href="/teacher/create-mission"
              onClick={() => sounds.play('click')}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Сыныпқа Миссия Тағайындау
            </Link>
          </div>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {classes.map((c) => (
            <div
              key={c.id}
              className="bg-gradient-to-b from-game-surface to-game-navy rounded-3xl border-2 border-game-panel hover:border-amber-400/60 p-6 flex flex-col justify-between transition-all group shadow-xl"
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border border-blue-400/40 flex items-center justify-center text-xl font-black text-blue-300">
                      {c.grade}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                        {c.name}
                      </h2>
                      <span className="text-xs text-slate-400">
                        {c.studentsCount} оқушы · {c.weeklyActive} белсенді
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs">
                    {c.avgMastery}% үлгерім
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Орташа меңгеру</span>
                    <span className="font-bold text-white">{c.avgMastery}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                      style={{ width: `${c.avgMastery}%` }}
                    />
                  </div>
                </div>

                {/* Key indicators */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Миссиялар:
                    </span>
                    <span className="font-bold text-white">{c.completedMissions} аяқталған</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Үздік пән:
                    </span>
                    <span className="font-bold text-emerald-300">{c.topSubject}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Қиын тақырып:
                    </span>
                    <span className="font-bold text-rose-300">{c.weakTopic}</span>
                  </div>
                </div>

                {/* Top Students Badge */}
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[11px] text-amber-400/90 font-bold mb-1.5 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Алдыңғы қатарлы оқушылар:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.topStudents.map((st, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[10px] font-semibold"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <Link
                  href={`/teacher/class/${c.id}`}
                  onClick={() => sounds.play('click')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700 hover:border-blue-500"
                >
                  Сыныпты Ашу және Оқушылар Тізімі
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
