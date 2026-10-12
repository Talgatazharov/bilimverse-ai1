'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  User,
  GraduationCap,
  Heart,
  Lock,
  Mail,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';

export default function RegisterPage() {
  const router = useRouter();
  const { setRole, setStudentName, setStudentGrade } = useGameStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState<number>(3);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.play('portal');
    setRole('STUDENT');
    setStudentName(name);
    setStudentGrade(grade);
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-game-dark flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-purple-500/10 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black shadow-gold-glow">
            <Sparkles className="w-4 h-4 text-amber-400" /> ЖАҢА ОҚУШЫ / ҚАТЫСУШЫ ТІРКЕУ
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            BILIMVERSE Әлеміне Қосылыңыз
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Оқушы профилін толтырып, білім саяхатыңызды бастаңыз
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-game-surface rounded-3xl border border-game-panel p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Name */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Оқушының есімі
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Мысалы: Аян, Гүлнұр..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Электронды пошта</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@bilimverse.kz"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Grade Selection for Students */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Сыныбыңыз</label>
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

            {/* Password */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Құпия сөз</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Кемінде 6 таңба"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center justify-center gap-2 transition-transform active:scale-95 mt-4"
            >
              <span>Тіркелу және Бастау</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Бұрыннан аккаунтыңыз бар ма?{' '}
            <Link
              href="/login"
              onClick={() => sounds.play('click')}
              className="text-amber-400 font-bold hover:underline"
            >
              Кіру
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
