'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { SUBJECTS } from '@/data/seed-data';
import { ALL_MISSIONS } from '@/data/missions-data';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';
import {
  ArrowLeft,
  Star,
  Lock,
  Sparkles,
  Shield,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { Mission, SubjectId } from '@/types';

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = (params?.id as SubjectId) || 'math';
  const { student } = useGameStore();

  const currentSubject = SUBJECTS.find((s) => s.id === subjectId) || SUBJECTS[0];
  const subjectMissions = ALL_MISSIONS.filter((m) => m.subjectId === subjectId);

  const [selectedMission, setSelectedMission] = useState<Mission | null>(
    subjectMissions[0] || null
  );

  return (
    <AppLayout showRightPanel={true}>
      <div className="space-y-6">
        {/* Back Link & Realm Banner */}
        <div className="flex items-center gap-3">
          <Link
            href="/subjects"
            onClick={() => sounds.play('click')}
            className="p-2 rounded-xl bg-game-surface hover:bg-game-surfaceHover border border-game-panel text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-amber-300">
              {currentSubject.realmName}
            </h1>
            <p className="text-xs text-sky-200">
              {currentSubject.name} · {currentSubject.description}
            </p>
          </div>
        </div>

        {/* Hero Banner with Castle Artwork */}
        <div className="relative w-full h-56 rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl">
          <Image
            src={currentSubject.bgImage}
            alt={currentSubject.realmName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-game-deep via-game-deep/40 to-transparent" />
          <div className="absolute bottom-5 left-6 z-10">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
              3-СЫНЫП БАҒДАРЛАМАСЫ
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {currentSubject.monumentDesc}
            </div>
          </div>
        </div>

        {/* Mission Path Map (Interactive Nodes Road) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Road of Mission Nodes */}
          <div className="lg:col-span-2 bg-game-surface/80 rounded-3xl p-6 border border-game-panel shadow-lg space-y-4">
            <h2 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Саяхат жолы (Миссиялар)
            </h2>

            <div className="space-y-3">
              {subjectMissions.map((mission, idx) => {
                const isSelected = selectedMission?.id === mission.id;
                const progressInfo = student.completedMissions[mission.id];
                const isDone = !!progressInfo;
                const starsCount = progressInfo?.stars || 0;
                // Allow unlocking sequentially
                const isLocked = idx > 0 && !student.completedMissions[subjectMissions[idx - 1].id];

                return (
                  <div
                    key={mission.id}
                    onClick={() => {
                      if (!isLocked) {
                        sounds.play('click');
                        setSelectedMission(mission);
                      } else {
                        sounds.play('incorrect');
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/20 to-game-navy border-amber-400 shadow-gold-glow scale-[1.01]'
                        : isLocked
                        ? 'bg-game-deep/50 border-slate-800 opacity-60 cursor-not-allowed'
                        : 'bg-game-navy/70 border-game-panel hover:border-amber-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Node Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                          mission.hasBoss
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500'
                            : isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400'
                            : isLocked
                            ? 'bg-slate-800 text-slate-500'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-400'
                        }`}
                      >
                        {mission.hasBoss ? (
                          <Shield className="w-6 h-6" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5" />
                        ) : (
                          `0${idx + 1}`
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-sm text-white">
                            {mission.title}
                          </h3>
                          {mission.hasBoss && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 text-[10px] font-black border border-rose-500/40">
                              BOSS
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {mission.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Stars or Lock */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isDone ? (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= starsCount
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      ) : isLocked ? (
                        <span className="text-xs text-slate-500 font-bold">Құлыптаулы</span>
                      ) : (
                        <span className="text-xs text-amber-400 font-bold">Ашық</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Mission Detail Card */}
          {selectedMission && (
            <div className="bg-gradient-to-b from-game-surface to-game-navy rounded-3xl p-6 border-2 border-amber-400/80 shadow-gold-glow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-game-panel/80 mb-4">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    МИССИЯ КАРТОЧКАСЫ
                  </span>
                  <span className="text-xs font-bold text-sky-300">
                    5 Тапсырма
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">
                  {selectedMission.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedMission.description}
                </p>

                {/* Rewards Showcase */}
                <div className="my-6 p-4 rounded-2xl bg-game-deep/80 border border-game-panel space-y-2">
                  <div className="text-xs font-bold text-amber-300 uppercase">Сыйлықтар:</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Тәжірибе:
                    </span>
                    <span className="font-extrabold text-amber-400">+{selectedMission.xpReward} XP</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-cyan-400">💎</span> Тұмар кристалы:
                    </span>
                    <span className="font-extrabold text-cyan-300">+{selectedMission.coinReward} Тұмар</span>
                  </div>
                </div>
              </div>

              {/* Start Mission Button */}
              <button
                onClick={() => {
                  sounds.play('portal');
                  router.push(`/mission/${selectedMission.id}`);
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-sm tracking-wider uppercase shadow-gold-glow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-amber-700"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                Миссияны бастау
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
