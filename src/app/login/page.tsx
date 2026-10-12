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
  ShieldAlert,
  Lock,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';
import { Role } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useGameStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleQuickLogin = (role: Role, path: string) => {
    sounds.play('portal');
    setLoadingRole(role);
    setRole(role);
    setTimeout(() => {
      router.push(path);
    }, 600);
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.play('click');
    setRole('STUDENT');
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-game-dark flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting & fantasy glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-amber-500/10 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-8">
        {/* Logo & Portal Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black shadow-gold-glow">
            <Sparkles className="w-4 h-4 text-amber-400" /> BILIMVERSE AI · БІЛІМ ПОРТАЛЫ
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-wide">
            Қош келдіңіз, Жас Саяхатшы!
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            1–4 сынып оқушыларына арналған қазақ тіліндегі MMORPG білім әлемі
          </p>
        </div>

        {/* 1. Quick Role Login Cards */}
        <div className="space-y-3">
          <div className="text-center text-xs text-amber-300 font-bold uppercase tracking-wider">
            ⚡ ОҚУШЫ РЕЖИМІНЕ КІРУ
          </div>

          <div className="grid grid-cols-1 max-w-sm mx-auto gap-4">
            {/* Student Card */}
            <button
              onClick={() => handleQuickLogin('STUDENT', '/onboarding')}
              disabled={!!loadingRole}
              className="p-5 rounded-3xl bg-gradient-to-b from-game-surface to-game-navy border-2 border-amber-500/50 hover:border-amber-400 transition-all text-left group hover:scale-[1.02] shadow-xl relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                👦
              </div>
              <div className="text-sm font-black text-white group-hover:text-amber-300">
                Оқушы (Student)
              </div>
              <div className="text-xs text-amber-400 font-bold mt-0.5">
                Өз сыныбың мен кейіпкеріңді таңда
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                World Map, миссиялар, мини-ойындар және Қыран AI серігі.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-300">
                <span>Әлемге кіру</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

          </div>
        </div>

        {/* 2. Standard Form Login Box */}
        <div className="max-w-md mx-auto bg-game-surface rounded-3xl border border-game-panel p-6 shadow-2xl space-y-5">
          <div className="text-center">
            <h3 className="text-base font-black text-white">Немесе электронды поштамен кіру</h3>
            <p className="text-xs text-slate-400 mt-0.5">Жеке аккаунтыңыздың деректерін енгізіңіз</p>
          </div>

          <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Email немесе Логин</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@bilimverse.kz"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Құпия сөз</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              Кіру
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Аккаунтыңыз жоқ па?{' '}
            <Link
              href="/register"
              onClick={() => sounds.play('click')}
              className="text-amber-400 font-bold hover:underline"
            >
              Тіркелу
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
