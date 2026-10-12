'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  ShieldAlert,
  Server,
  Database,
  Cpu,
  Layers,
  Users,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Terminal,
  Activity,
  Award,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';
import { SUBJECTS } from '@/data/seed-data';
import { Role } from '@/types';

export default function AdminDashboardPage() {
  const { role, setRole, resetProgress } = useGameStore();
  const [resetAlert, setResetAlert] = useState<string | null>(null);

  const stats = {
    totalQuestions: 135,
    subjectsCount: 7,
    activeBuildings: 10,
    activeAchievements: 8,
    dbType: 'SQLite (prisma/dev.db)',
    soundEngine: 'Web Audio API (Procedural Synthesizer)',
    aiEngine: 'Mock Socratic Engine (OpenAI API Ready)',
    serverUptime: '99.98%',
    latency: '18ms',
  };

  const handleRoleChange = (newRole: Role) => {
    sounds.play('click');
    setRole(newRole);
    setResetAlert(`Рөл «${newRole}» режиміне ауыстырылды.`);
    setTimeout(() => setResetAlert(null), 3000);
  };

  const handleResetData = () => {
    if (confirm('Барлық прогресті бастапқы қалпына келтіруді растайсыз ба?')) {
      resetProgress();
      sounds.play('click');
      setResetAlert('Барлық оқушы деректері мен Білім ауылы қалпына келтірілді!');
      setTimeout(() => setResetAlert(null), 4000);
    }
  };

  return (
    <AppLayout showRightPanel={false}>
      <div className="space-y-8 max-w-6xl mx-auto select-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-game-panel">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold mb-2">
              <ShieldAlert className="w-4 h-4 text-red-400" /> СҮЗГІ & ЖҮЙЕЛІК БАСҚАРУ · ADMIN CONSOLE
            </div>
            <h1 className="text-3xl font-black text-white">
              BILIMVERSE AI Жүйелік Әкімші Панелі
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Платформа инфрақұрылымы, дерекқор мониторингі, AI квоталары және рөлдерді басқару
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Демо Деректерді Қалпына Келтіру
          </button>
        </div>

        {/* Alert Feedback */}
        {resetAlert && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{resetAlert}</span>
          </div>
        )}

        {/* System Health Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Сұрақтар қоры</span>
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">135 тапсырма</div>
            <div className="text-[11px] text-emerald-400 font-bold">7 пән толық қамтылған ✓</div>
          </div>

          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Дерекқор (Database)</span>
              <Database className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white">SQLite / Prisma</div>
            <div className="text-[11px] text-sky-400 font-bold">dev.db синхрондалған ✓</div>
          </div>

          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>AI Репетитор Моделі</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300">Socratic AIService</div>
            <div className="text-[11px] text-purple-400 font-bold">Клиенттік кілт қорғалған ✓</div>
          </div>

          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Сервер Тұрақтылығы</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">{stats.serverUptime}</div>
            <div className="text-[11px] text-slate-400 font-bold">Кідіріс: {stats.latency}</div>
          </div>
        </div>

        {/* Role Switcher Sandbox */}
        <div className="p-6 rounded-3xl bg-game-surface border border-game-panel space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" /> Жылдам Рөлді Ауыстыру Тесті (Active Role Sandbox)
            </h3>
            <span className="text-xs text-slate-400">
              Қазіргі рөл: <strong className="text-amber-300">{role}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  role === r
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-gold-glow font-black'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 font-bold'
                }`}
              >
                <div className="text-xl mb-1">
                  {r === 'STUDENT' ? '🎒' : r === 'TEACHER' ? '👩‍🏫' : r === 'PARENT' ? '👨‍👩‍👧' : '⚙️'}
                </div>
                <div className="text-xs uppercase tracking-wider">{r}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Curriculum Question Breakdown */}
        <div className="p-6 rounded-3xl bg-game-surface border border-game-panel space-y-5 shadow-xl">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" /> Пәндер және сұрақтар конфигурациясы (135 Questions Loaded)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUBJECTS.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-white text-xs">{sub.name}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 text-[10px] font-bold">
                    {sub.realmName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {sub.description}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Миссиялар саны:</span>
                  <span className="text-emerald-400 font-bold">{sub.totalMissions} кезең</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
