'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Sparkles,
  ChevronRight,
  BookOpen,
  Send,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Plus,
  Trash2,
  Wand2,
} from 'lucide-react';
import { aiService } from '@/lib/ai-service';
import { sounds } from '@/lib/sound-manager';
import { SUBJECTS } from '@/data/seed-data';

export default function TeacherCreateMissionPage() {
  const router = useRouter();

  // Form states
  const [grade, setGrade] = useState<number>(3);
  const [subject, setSubject] = useState<string>('Математика');
  const [topic, setTopic] = useState<string>('Көбейту кестесі және бөлу');
  const [difficulty, setDifficulty] = useState<string>('Орташа');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [targetClass, setTargetClass] = useState<string>('3А сыныбы');

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedMission, setGeneratedMission] = useState<{
    title: string;
    description: string;
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      hint: string;
      explanation: string;
    }>;
  } | null>(null);

  const [published, setPublished] = useState<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    sounds.play('click');

    try {
      const res = await aiService.generateTeacherMission({
        grade,
        subject,
        topic,
        difficulty,
        questionCount,
      });
      setGeneratedMission(res);
      sounds.play('xp');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    sounds.play('levelUp');
    setPublished(true);
    setTimeout(() => {
      router.push('/teacher/missions');
    }, 2000);
  };

  return (
    <AppLayout showRightPanel={false}>
      <div className="space-y-8 max-w-5xl mx-auto select-none">
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
            <Link
              href="/teacher/missions"
              onClick={() => sounds.play('click')}
              className="hover:text-amber-400 transition-colors"
            >
              Миссиялар
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-300 font-bold">AI Тапсырма Құрастырушы</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-game-panel">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
                <Wand2 className="w-4 h-4" /> AI ЖАСАНДЫ ИНТЕЛЛЕКТ АРҚЫЛЫ ГЕНЕРАЦИЯ
              </div>
              <h1 className="text-3xl font-black text-white">
                Интерактивті Миссия Құрастыру
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Қазақстан бастауыш сынып стандартына сай оқушыларға арналған ойындық сұрақтар мен кеңестер
              </p>
            </div>
          </div>
        </div>

        {/* Success Modal Toast */}
        {published && (
          <div className="p-6 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500 text-white flex items-center gap-4 animate-scale-up">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-base font-black">Миссия сәтті жарияланды!</div>
              <div className="text-xs text-emerald-200">
                Тапсырма {targetClass} оқушыларының интерактивті картасына жіберілді. Бағытталуда...
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Parameters */}
          <div className="lg:col-span-5 bg-game-surface rounded-3xl border border-game-panel p-6 shadow-xl space-y-6">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Тапсырма параметрлері
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              {/* Grade */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Сынып</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setGrade(g);
                        sounds.play('click');
                      }}
                      className={`py-2 rounded-xl font-black transition-all ${
                        grade === g
                          ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                          : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {g}-сынып
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Пән</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.realmName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Class */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Тағайындалатын сынып</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                >
                  <option value="3А сыныбы">3А сыныбы (24 оқушы)</option>
                  <option value="3Ә сыныбы">3Ә сыныбы (22 оқушы)</option>
                  <option value="4А сыныбы">4А сыныбы (26 оқушы)</option>
                  <option value="Бүкіл сыныптар">Барлық сыныптарға бірге</option>
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Сабақ тақырыбы немесе мақсаты</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Мысалы: Көбейту және бөлу, Сөз құрамы..."
                  className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Күрделілік деңгейі</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Жеңіл', 'Орташа', 'Күрделі'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDifficulty(d);
                        sounds.play('click');
                      }}
                      className={`py-2 rounded-xl font-bold transition-all ${
                        difficulty === d
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Сұрақ саны</label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 8].map((qc) => (
                    <button
                      key={qc}
                      type="button"
                      onClick={() => {
                        setQuestionCount(qc);
                        sounds.play('click');
                      }}
                      className={`py-2 rounded-xl font-bold transition-all ${
                        questionCount === qc
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {qc} тапсырма
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Generate Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 mt-4"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> AI миссияны құрастыруда...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" /> AI Арқылы Құрастыру
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Preview & Customization */}
          <div className="lg:col-span-7 space-y-6">
            {!generatedMission && !isGenerating && (
              <div className="h-full min-h-[420px] rounded-3xl border-2 border-dashed border-slate-800 bg-game-surface/50 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl">
                  ✨
                </div>
                <div className="max-w-md">
                  <h3 className="text-base font-black text-white">
                    Тапсырма параметрлерін таңдап, AI генерациясын іске қосыңыз
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    BILIMVERSE жасанды интеллектісі Қазақстан мектеп бағдарламасына сәйкес интерактивті сұрақтарды, кеңестерді және дұрыс жауап түсіндірмелерін бір сәтте әзірлейді.
                  </p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="h-full min-h-[420px] rounded-3xl border border-game-panel bg-game-surface p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-2" />
                <h3 className="text-lg font-black text-white">
                  Қыран мен AI оқу материалдарын талдауда...
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  «{topic}» тақырыбы бойынша дидактикалық сұрақтар мен көмекші кеңестер құрастырылуда.
                </p>
              </div>
            )}

            {generatedMission && !isGenerating && (
              <div className="space-y-6">
                {/* Header card of generated mission */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 border-2 border-amber-500/40 shadow-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs">
                      {grade}-сынып · {subject}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {targetClass} үшін
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {generatedMission.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {generatedMission.description}
                  </p>
                </div>

                {/* Questions Preview List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Құрастырылған Сұрақтар ({generatedMission.questions.length})</span>
                    <span>Өңдеуге болады</span>
                  </div>

                  {generatedMission.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-game-surface border border-game-panel space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-bold text-white flex-1 leading-relaxed">
                          {q.question}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border text-xs font-semibold ${
                              opt === q.correctAnswer
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            {opt} {opt === q.correctAnswer && '✓ (Дұрыс)'}
                          </div>
                        ))}
                      </div>

                      {/* Hint & Explanation */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                        <div className="text-amber-400/90 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold">Қыранның кеңесі:</span> {q.hint}
                        </div>
                        <div className="text-slate-400 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                          <span className="font-bold">Түсіндірме:</span> {q.explanation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Publish Button */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    onClick={() => setGeneratedMission(null)}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Қайта бастау
                  </button>
                  <button
                    onClick={handlePublish}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <Send className="w-4 h-4" /> Сыныпқа Тағайындау және Жариялау
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
