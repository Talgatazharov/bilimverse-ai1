'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Heart,
  Clock,
  Award,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Flame,
  CheckCircle2,
  Bell,
  Star,
  ChevronRight,
  BookOpen,
  Send,
  Edit2,
  Save,
} from 'lucide-react';
import { getTodayDate, useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';

export default function ParentDashboardPage() {
  const { student, parentProfile, setParentProfile, claimParentPraise } = useGameStore();
  const [screenLimit, setScreenLimit] = useState<number>(45);
  const [praiseSent, setPraiseSent] = useState<boolean>(false);
  const [today, setToday] = useState(getTodayDate);
  const [praiseMessage, setPraiseMessage] = useState<string>(
    `Керемет, ${student.name || 'балам'}! Сені мақтан тұтамын!`
  );
  const [isEditingParent, setIsEditingParent] = useState(false);
  const [parentName, setParentName] = useState(parentProfile.name || 'Ата-ана');

  const childName = student.name || 'Оқушы';
  const praiseClaimedToday = student.lastParentPraiseDate === today;

  useEffect(() => {
    const timer = window.setInterval(() => setToday(getTodayDate()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSaveParent = () => {
    sounds.play('click');
    setParentProfile({ name: parentName.trim() || 'Ата-ана' });
    setIsEditingParent(false);
  };

  const handleSendPraise = () => {
    if (!claimParentPraise()) return;
    sounds.play('chest');
    setToday(getTodayDate());
    setPraiseSent(true);
    setTimeout(() => setPraiseSent(false), 5000);
  };

  const subjectProgress = [
    { name: 'Математика', accuracy: 92, missions: 6, color: 'from-amber-500 to-amber-600' },
    { name: 'Қазақ тілі', accuracy: 95, missions: 5, color: 'from-emerald-500 to-emerald-600' },
    { name: 'Әдебиеттік оқу', accuracy: 88, missions: 4, color: 'from-rose-500 to-rose-600' },
    { name: 'Жаратылыстану', accuracy: 84, missions: 3, color: 'from-cyan-500 to-cyan-600' },
    { name: 'Цифрлық сауаттылық', accuracy: 96, missions: 4, color: 'from-blue-500 to-blue-600' },
  ];

  return (
    <AppLayout showRightPanel={false}>
      <div className="space-y-8 max-w-6xl mx-auto select-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-game-panel">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2">
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400" /> АТА-АНА ПАНЕЛІ · FAMILY DASHBOARD
            </div>

            <div className="flex items-center gap-3">
              {isEditingParent ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="bg-slate-900 border border-rose-400 rounded-xl px-3 py-1.5 text-xl font-bold text-white focus:outline-none"
                    placeholder="Ата-ананың аты..."
                  />
                  <button
                    onClick={handleSaveParent}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Сақтау
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black text-white">
                    {parentProfile.name || 'Ата-ана'} кабинеті
                  </h1>
                  <button
                    onClick={() => {
                      sounds.play('click');
                      setIsEditingParent(true);
                    }}
                    title="Атыңызды өзгерту"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Балаңыз: <span className="text-amber-300 font-bold">{childName}</span> · {student.grade}-сынып оқушысы · Қауіпсіз және сапалы цифрлық білім
            </p>
          </div>

          <button
            onClick={handleSendPraise}
            disabled={praiseClaimedToday}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" /> {praiseClaimedToday ? 'Бүгін мақтау жіберілді ✓' : `${childName}ға Мадақтау мен Тұмар Жіберу (+50 XP)`}
          </button>
        </div>

        {/* Praise Sent Feedback Toast */}
        {praiseSent && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/30 to-amber-500/30 border-2 border-rose-400 text-white text-xs font-bold flex items-center gap-3 animate-scale-up">
            <Heart className="w-6 h-6 fill-rose-400 text-rose-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-black">Мадақтау хаты балаңызға жетті! 🎉</div>
              <div className="text-slate-200">
                «{praiseMessage}» — {childName}ның экранында жүректермен ұшып, балансына +50 XP және +20 Тұмар қосылды!
              </div>
            </div>
          </div>
        )}

        {/* Top 4 Quick Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Бүгінгі оқу уақыты</span>
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white">25 минут</div>
            <div className="text-[11px] text-emerald-400 font-bold">Лимит: {screenLimit} мин (Қауіпсіз ✓)</div>
          </div>

          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Орындалған миссиялар</span>
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">4 тапсырма</div>
            <div className="text-[11px] text-slate-400 font-bold">+180 XP жиналды</div>
          </div>

          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Күндік қатарлық (Streak)</span>
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            </div>
            <div className="text-2xl font-black text-orange-400">{student.streak} күн қатарынан</div>
            <div className="text-[11px] text-orange-300 font-bold">Тұрақты әдет 🔥</div>
          </div>

          <div className="p-5 bg-game-surface rounded-3xl border border-game-panel shadow-md space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Қазіргі деңгейі</span>
              <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300">
              Lv. {student.level} · {student.title}
            </div>
            <div className="text-[11px] text-purple-400 font-bold">{student.currency} 💎 Тұмар балансы</div>
          </div>
        </div>

        {/* AI Progress Summary & Tutor Advice (Requirement 4 & 5) */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/50 border-2 border-blue-500/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl">
              🦅
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Қыран мен AI репетитордың Ата-анаға күнделікті есебі
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                  Бүгінгі сараптама
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Баланың оқу динамикасы мен психо-эмоционалдық жағдайы
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-2">
            <p>
              «Құрметті {parentProfile.name || 'ата-ана'}! {childName} бүгін ерекше құлшыныспен кірісті. Математиканың <strong>«Сандар патшалығы»</strong> аймағында күрделі есептерді және Қазақ тілінен <strong>«Сөз құрау»</strong> ойынын мүлтіксіз шешті. Қиындық туындаған кезде ол кеңестерге сүйеніп, қатесін өз бетінше түзеді.»
            </p>
            <p className="text-amber-300 font-semibold">
              💡 Ұсыныс: Кешкі аста {childName}дан «Бүгін Білім ауылындағы киіз үйіңді қалай жаңарттың?» деп сұрап, жетістігін ауызша мақтап қойсаңыз, оның білімге құштарлығы одан әрі арта түседі.
            </p>
          </div>
        </div>

        {/* Main Grid: Subject Mastery + Screen Time Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Subject Mastery List */}
          <div className="lg:col-span-7 bg-game-surface rounded-3xl border border-game-panel p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Пәндер бойынша дәлдік көрсеткіші
              </h3>
              <span className="text-xs text-emerald-300 font-bold">Орташа: 91%</span>
            </div>

            <div className="space-y-4">
              {subjectProgress.map((sub, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{sub.name}</span>
                    <span className="text-slate-400">
                      {sub.missions} миссия · <strong className="text-white">{sub.accuracy}%</strong>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/80">
                    <div
                      className={`h-full bg-gradient-to-r ${sub.color} rounded-full`}
                      style={{ width: `${sub.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parental Control & Screen Time Settings */}
          <div className="lg:col-span-5 bg-game-surface rounded-3xl border border-game-panel p-6 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sky-400 font-black text-sm">
                <ShieldCheck className="w-5 h-5" /> АТА-АНА БАҚЫЛАУЫ ЖӘНЕ ҚАУІПСІЗДІК
              </div>

              {/* Slider for screen time */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold">Күндік уақыт лимиті:</span>
                  <span className="text-amber-400 font-black">{screenLimit} минут</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={screenLimit}
                  onChange={(e) => setScreenLimit(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>20 мин (Ұсынылатын)</span>
                  <span>45 мин</span>
                  <span>90 мин</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Көз демалысы үзілісі (20 минут сайын):</span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                    Қосулы ✓
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Қауіпсіз интернет & чат сүзгісі:</span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                    Қосулы ✓
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Кешкі 21:00-ден кейін ойнауды шектеу:</span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                    Белсенді ✓
                  </span>
                </div>
              </div>
            </div>

            {/* Praise customizer input */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <label className="text-[11px] text-slate-400 font-bold block">
                Балаға жіберілетін жылы лебіз:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={praiseMessage}
                  onChange={(e) => setPraiseMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                />
                <button
                  onClick={handleSendPraise}
                  disabled={praiseClaimedToday}
                  className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" /> {praiseClaimedToday ? 'Бүгін жіберілді ✓' : 'Жіберу'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
