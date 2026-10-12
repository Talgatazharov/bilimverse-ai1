'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  GraduationCap,
  Users,
  BookOpen,
  Sparkles,
  BarChart3,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Save,
} from 'lucide-react';
import { sounds } from '@/lib/sound-manager';
import { useGameStore } from '@/stores/useGameStore';

export default function TeacherOverviewPage() {
  const { teacherProfile, setTeacherProfile } = useGameStore();
  const [isEditing, setIsEditing] = useState(false);
  const [teacherName, setTeacherName] = useState(teacherProfile.name || 'Ұстаз');

  const handleSaveProfile = () => {
    sounds.play('click');
    setTeacherProfile({ name: teacherName.trim() || 'Ұстаз' });
    setIsEditing(false);
  };

  return (
    <AppLayout showRightPanel={false}>
      <div className="space-y-8 max-w-6xl mx-auto select-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-game-panel">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
              <GraduationCap className="w-4 h-4" /> ҰСТАЗ ПАНЕЛІ · EDTECH
            </div>

            <div className="flex items-center gap-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="bg-slate-900 border border-blue-400 rounded-xl px-3 py-1.5 text-xl font-bold text-white focus:outline-none"
                    placeholder="Ұстаздың аты-жөні..."
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Сақтау
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black text-white">
                    {teacherProfile.name || 'Ұстаз'} кабинеті
                  </h1>
                  <button
                    onClick={() => {
                      sounds.play('click');
                      setIsEditing(true);
                    }}
                    title="Мұғалім атын өзгерту"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {teacherProfile.className || '3А сыныбы'} · 24 оқушы · {teacherProfile.school || 'BILIMVERSE мектебі'}
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

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Сынып оқушылары</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white">24 оқушы</div>
            <div className="text-[11px] text-emerald-400 font-bold mt-1">100% белсенді</div>
          </div>

          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Орташа меңгеру</span>
              <BarChart3 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">84%</div>
            <div className="text-[11px] text-slate-400 mt-1">Өткен аптадан +6%</div>
          </div>

          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Орындалған миссиялар</span>
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">182 тапсырма</div>
            <div className="text-[11px] text-slate-400 mt-1">Осы аптада</div>
          </div>

          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Көмек қажет ететіндер</span>
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-300">3 оқушы</div>
            <div className="text-[11px] text-rose-400 mt-1">«Бөлу» тақырыбы бойынша</div>
          </div>
        </div>

        {/* Quick Nav Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/teacher/classes"
            onClick={() => sounds.play('click')}
            className="p-6 bg-gradient-to-b from-game-surface to-game-navy rounded-3xl border-2 border-game-panel hover:border-blue-400 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              👥
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-blue-300">
              Сыныптар мен Оқушылар
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              3А сыныбының оқушылар тізімі, жеке үлгерімі, рейтингі және орындалған миссиялары.
            </p>
          </Link>

          <Link
            href="/teacher/missions"
            onClick={() => sounds.play('click')}
            className="p-6 bg-gradient-to-b from-game-surface to-game-navy rounded-3xl border-2 border-game-panel hover:border-amber-400 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📋
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-amber-300">
              Тағайындалған Миссиялар
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Мұғалім құрастырған тесттер мен бекітілген оқу тапсырмаларының орындалу барысы.
            </p>
          </Link>

          <Link
            href="/teacher/analytics"
            onClick={() => sounds.play('click')}
            className="p-6 bg-gradient-to-b from-game-surface to-game-navy rounded-3xl border-2 border-game-panel hover:border-emerald-400 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-emerald-300">
              Сынып Аналитикасы
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Пәндер мен тақырыптар бойынша тереңдетілген меңгеру сапасы және AI ұсыныстары.
            </p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
