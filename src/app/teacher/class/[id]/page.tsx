'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Users,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Flame,
  Star,
  Send,
} from 'lucide-react';
import { sounds } from '@/lib/sound-manager';
import { useGameStore } from '@/stores/useGameStore';

export default function TeacherClassDetailPage() {
  const params = useParams();
  const classId = (params?.id as string) || '3a';
  const [filter, setFilter] = useState<'all' | 'needsHelp' | 'high'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null);

  const className = classId === '3b' ? '3Ә сыныбы' : classId === '4a' ? '4А сыныбы' : '3А сыныбы';

  const { student } = useGameStore();

  const students = [
    {
      id: 'st_1',
      name: `${student.name || 'Оқушы'} Сейілхан`,
      avatar: student.avatar === 'girl' ? '👧' : '👦',
      grade: student.grade || 3,
      level: student.level || 7,
      xp: student.xp || 1250,
      streak: student.streak || 1,
      accuracy: 92,
      completedMissions: 22,
      lastActive: 'Бүгін, 18:24',
      status: 'high',
      needsHelpTopic: null,
      notes: 'Математика мен Қазақ тілін өте жоғары деңгейде меңгерген. Белсенділігі жоғары.',
    },
    {
      id: 'st_2',
      name: 'Айзере Нұрланқызы',
      avatar: '👧',
      grade: 3,
      level: 6,
      xp: 1120,
      streak: 5,
      accuracy: 74,
      completedMissions: 19,
      lastActive: 'Бүгін, 16:10',
      status: 'needsHelp',
      needsHelpTopic: 'Бөлу кестесі (64 ÷ 8)',
      notes: 'Көбейтуді жақсы біледі, бірақ кері амал — бөлуде жиі қателеседі.',
    },
    {
      id: 'st_3',
      name: 'Әлихан Берікұлы',
      avatar: '👦',
      grade: 3,
      level: 6,
      xp: 1080,
      streak: 4,
      accuracy: 72,
      completedMissions: 17,
      lastActive: 'Кеше, 20:00',
      status: 'needsHelp',
      needsHelpTopic: 'Сандарды ондықтан аттап қосу',
      notes: 'Есептерді тез шығарады, бірақ мұқият тексеруді ұмытады.',
    },
    {
      id: 'st_4',
      name: 'Данияр Бақытбек',
      avatar: '👦',
      grade: 3,
      level: 5,
      xp: 940,
      streak: 5,
      accuracy: 86,
      completedMissions: 16,
      lastActive: 'Бүгін, 15:30',
      status: 'normal',
      needsHelpTopic: null,
      notes: 'Тұрақты жұмыс істейді. Ертегілер елінде барлық миссияларды сәтті өтті.',
    },
    {
      id: 'st_5',
      name: 'Інжу Қайратқызы',
      avatar: '👧',
      grade: 3,
      level: 6,
      xp: 1150,
      streak: 7,
      accuracy: 94,
      completedMissions: 21,
      lastActive: 'Бүгін, 17:45',
      status: 'high',
      needsHelpTopic: null,
      notes: 'Сыныптағы ең ұзақ қатарлық (7 күн!). Барлық сұрақтарға бірінші жауап береді.',
    },
    {
      id: 'st_6',
      name: 'Мансұр Ералы',
      avatar: '👦',
      grade: 3,
      level: 4,
      xp: 720,
      streak: 2,
      accuracy: 68,
      completedMissions: 12,
      lastActive: '3 күн бұрын',
      status: 'needsHelp',
      needsHelpTopic: 'Жалғаулар мен жұрнақтар',
      notes: 'Қазақ тілінен қосымша көмек пен ойындық мотивация қажет.',
    },
    {
      id: 'st_7',
      name: 'Томирис Асқарқызы',
      avatar: '👧',
      grade: 3,
      level: 5,
      xp: 890,
      streak: 4,
      accuracy: 88,
      completedMissions: 15,
      lastActive: 'Бүгін, 14:15',
      status: 'normal',
      needsHelpTopic: null,
      notes: 'Жаратылыстану пәніне қызығушылығы зор.',
    },
    {
      id: 'st_8',
      name: 'Санжар Мұрат',
      avatar: '👦',
      grade: 3,
      level: 5,
      xp: 860,
      streak: 3,
      accuracy: 85,
      completedMissions: 14,
      lastActive: 'Кеше, 19:20',
      status: 'normal',
      needsHelpTopic: null,
      notes: 'Жақсы қарқынмен дамып келеді.',
    },
  ];

  const filteredStudents = students.filter((s) => {
    if (filter === 'needsHelp' && s.status !== 'needsHelp') return false;
    if (filter === 'high' && s.status !== 'high') return false;
    if (searchQuery.trim() !== '') {
      return s.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleAssignIndividualHelp = (studentName: string, topic: string) => {
    sounds.play('xp');
    setAssignedSuccess(`${studentName} оқушыға «${topic}» бойынша сараланған AI миссиясы жіберілді!`);
    setTimeout(() => setAssignedSuccess(null), 4000);
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
            <Link
              href="/teacher/classes"
              onClick={() => sounds.play('click')}
              className="hover:text-amber-400 transition-colors"
            >
              Сыныптар
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-300 font-bold">{className}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-game-panel">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-2">
                <Users className="w-4 h-4" /> СЫНЫП ПАСПОРТЫ
              </div>
              <h1 className="text-3xl font-black text-white">
                {className} · Оқушылар журналы
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                24 оқушы тіркелген · Орташа сапалық көрсеткіш: 84%
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/teacher/create-mission"
                onClick={() => sounds.play('click')}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Бүкіл Сыныпқа AI Тапсырма
              </Link>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {assignedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{assignedSuccess}</span>
          </div>
        )}

        {/* Needs Help Banner */}
        <div className="p-6 rounded-3xl bg-rose-950/30 border-2 border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 text-2xl flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-rose-200">
                Жеке көмекті қажет ететін 3 оқушы анықталды
              </h3>
              <p className="text-xs text-rose-300/80 mt-1 max-w-2xl leading-relaxed">
                AI мониторингі: Айзере, Әлихан және Мансұр соңғы миссияларда қате жіберді. Олар үшін Bilimverse бейімделген жеке тапсырмалар дайындап қойды.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAssignIndividualHelp('Айзере, Әлихан, Мансұр', 'Бейімделген қайталау')}
            className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-2 transition-all shadow-md flex-shrink-0"
          >
            <Send className="w-4 h-4" /> Барлығына Көмек Тағайындау
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-game-surface border border-game-panel">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Оқушының атын іздеу..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setFilter('all');
                sounds.play('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Барлығы ({students.length})
            </button>
            <button
              onClick={() => {
                setFilter('needsHelp');
                sounds.play('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'needsHelp'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Қиналғандар (3)
            </button>
            <button
              onClick={() => {
                setFilter('high');
                sounds.play('click');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'high'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Үздіктер (2)
            </button>
          </div>
        </div>

        {/* Student List Table */}
        <div className="bg-game-surface rounded-3xl border border-game-panel overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-game-panel text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Оқушы</th>
                  <th className="py-4 px-4 text-center">Деңгей / XP</th>
                  <th className="py-4 px-4 text-center">Қатарлық (Streak)</th>
                  <th className="py-4 px-4 text-center">Дәлдік %</th>
                  <th className="py-4 px-4 text-center">Миссиялар</th>
                  <th className="py-4 px-4">Жағдайы & Ұсыныс</th>
                  <th className="py-4 px-6 text-right">Әрекет</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-inner">
                          {st.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{st.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" /> {st.lastActive}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 font-black text-xs border border-amber-500/20">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Lv. {st.level}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1 font-semibold">{st.xp} XP</div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-orange-400 font-black">
                        <Flame className="w-3.5 h-3.5 fill-orange-400" /> {st.streak} күн
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="font-black text-sm text-white">{st.accuracy}%</div>
                      <div className="w-16 mx-auto h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            st.accuracy >= 90
                              ? 'bg-emerald-400'
                              : st.accuracy >= 75
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                          style={{ width: `${st.accuracy}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-slate-300">
                      {st.completedMissions} / 25
                    </td>

                    <td className="py-4 px-4">
                      {st.needsHelpTopic ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-[11px] border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3 text-rose-400" /> {st.needsHelpTopic}
                        </div>
                      ) : st.status === 'high' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30">
                          <Award className="w-3 h-3 text-emerald-400" /> Үздік меңгерген
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Тұрақты қарқын</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {st.needsHelpTopic ? (
                        <button
                          onClick={() => handleAssignIndividualHelp(st.name, st.needsHelpTopic || 'Қайталау')}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Sparkles className="w-3 h-3" /> AI көмек жіберу
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            sounds.play('click');
                            alert(`${st.name} оқушысының жеке портфолиосы мен марапаттары қаралуда.`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
                        >
                          Толығырақ
                        </button>
                      )}
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
