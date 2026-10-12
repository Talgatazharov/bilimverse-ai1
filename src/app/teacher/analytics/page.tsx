'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  BarChart3,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Download,
  Calendar,
  CheckCircle2,
  Users,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import { sounds } from '@/lib/sound-manager';
import { SUBJECTS } from '@/data/seed-data';
import { useGameStore } from '@/stores/useGameStore';

export default function TeacherAnalyticsPage() {
  const { teacherProfile } = useGameStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'term'>('week');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const subjectStats = [
    { id: 'math', name: 'Математика', accuracy: 84, growth: '+6%', status: 'good', icon: '📐' },
    { id: 'kazakh', name: 'Қазақ тілі', accuracy: 91, growth: '+4%', status: 'excellent', icon: '🇰🇿' },
    { id: 'literature', name: 'Әдебиеттік оқу', accuracy: 88, growth: '+5%', status: 'excellent', icon: '📖' },
    { id: 'science', name: 'Жаратылыстану', accuracy: 79, growth: '+2%', status: 'warning', icon: '🌿' },
    { id: 'world', name: 'Дүниетану', accuracy: 82, growth: '+3%', status: 'good', icon: '🌍' },
    { id: 'english', name: 'Ағылшын тілі', accuracy: 76, growth: '+1%', status: 'warning', icon: '🇬🇧' },
    { id: 'digital', name: 'Цифрлық сауаттылық', accuracy: 94, growth: '+8%', status: 'excellent', icon: '💻' },
  ];

  const topicsBreakdown = [
    { topic: 'Қосу және азайту', subject: 'Математика', accuracy: 96, level: 'Меңгерілді' },
    { topic: 'Көбейту кестесі', subject: 'Математика', accuracy: 86, level: 'Жақсы' },
    { topic: 'Бөлу кестесі', subject: 'Математика', accuracy: 68, level: 'Қайталау қажет' },
    { topic: 'Түбір мен жалғау', subject: 'Қазақ тілі', accuracy: 92, level: 'Меңгерілді' },
    { topic: 'Дауысты және дауыссыз', subject: 'Қазақ тілі', accuracy: 95, level: 'Меңгерілді' },
    { topic: 'Ертегі кейіпкерлері', subject: 'Әдебиет', accuracy: 90, level: 'Меңгерілді' },
    { topic: 'Су айналымы', subject: 'Жаратылыстану', accuracy: 74, level: 'Қайталау қажет' },
    { topic: 'Компьютер құрылғылары', subject: 'Цифрлық', accuracy: 96, level: 'Меңгерілді' },
  ];

  const handleExport = () => {
    sounds.play('xp');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

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
            <span className="text-amber-300 font-bold">Оқу Аналитикасы</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-game-panel">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                <BarChart3 className="w-4 h-4" /> ДЕРЕКТЕР КҮМБЕЗІ
              </div>
              <h1 className="text-3xl font-black text-white">
                3А Сыныбының Оқу Аналитикасы
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {teacherProfile.name || 'Ұстаз'} · Сыныптың білім меңгеру сапасы мен AI диагностикасы
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex p-1 rounded-2xl bg-game-surface border border-game-panel">
                <button
                  onClick={() => {
                    setTimeRange('week');
                    sounds.play('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timeRange === 'week' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Осы апта
                </button>
                <button
                  onClick={() => {
                    setTimeRange('month');
                    sounds.play('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timeRange === 'month' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Осы ай
                </button>
                <button
                  onClick={() => {
                    setTimeRange('term');
                    sounds.play('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    timeRange === 'term' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Тоқсан
                </button>
              </div>

              <button
                onClick={handleExport}
                className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" /> Есепті Жүктеу
              </button>
            </div>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>3А сыныбының оқу нәтижелері есебі PDF форматында сәтті экспортталды!</span>
          </div>
        )}

        {/* AI Recommendations Highlight Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-blue-600/20 border-2 border-amber-400/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
            <Sparkles className="w-5 h-5" /> BILIMVERSE AI ПЕДАГОГИКАЛЫҚ ҰСЫНЫСТАРЫ
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-400/20 space-y-1.5">
              <div className="font-bold text-amber-200 flex items-center gap-2">
                <span>🎯 Бөлу кестесін бекіту</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                  Шұғыл
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                3 оқушы (Айзере, Әлихан, Мансұр) «Бөлу» амалында қиналды. Оларға арналған 5 минуттық жылдам ойындық mini-game миссиясын тағайындауды ұсынамыз.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-amber-400/20 space-y-1.5">
              <div className="font-bold text-emerald-200 flex items-center gap-2">
                <span>🌟 Қазақ тілі мен Цифрлық сауаттылық</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Жоғары қарқын
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Сынып бойынша ең жоғары меңгеру көрсеткіші — 94%. Оқушылар келесі күрделірек модульдерге («Мәтін құрастыру», «Бағдарламалау логикасы») дайын.
              </p>
            </div>
          </div>
        </div>

        {/* Subject Mastery Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-400" /> Пәндер бойынша меңгеру сапасы
            </h2>
            <span className="text-xs text-slate-400">Орташа балл: 84.5%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjectStats.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-3xl bg-game-surface border border-game-panel shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> {s.growth}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-slate-400">{s.name}</div>
                  <div className="text-2xl font-black text-white mt-0.5">{s.accuracy}%</div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full rounded-full ${
                      s.accuracy >= 90
                        ? 'bg-emerald-400'
                        : s.accuracy >= 80
                        ? 'bg-cyan-400'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specific Topics Breakdown Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" /> Тақырыптар бойынша нақты дәлдік
          </h2>

          <div className="bg-game-surface rounded-3xl border border-game-panel overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-game-panel text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Сабақ тақырыбы</th>
                  <th className="py-4 px-4">Пән</th>
                  <th className="py-4 px-4 text-center">Дәлдік көрсеткіші</th>
                  <th className="py-4 px-6 text-right">Статусы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {topicsBreakdown.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">{t.topic}</td>
                    <td className="py-4 px-4 text-slate-400">{t.subject}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-bold text-white">{t.accuracy}%</div>
                      <div className="w-20 mx-auto h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            t.accuracy >= 90
                              ? 'bg-emerald-400'
                              : t.accuracy >= 80
                              ? 'bg-cyan-400'
                              : 'bg-rose-400'
                          }`}
                          style={{ width: `${t.accuracy}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                          t.accuracy >= 90
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : t.accuracy >= 80
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {t.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
