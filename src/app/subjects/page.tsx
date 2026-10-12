'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Star, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SUBJECTS } from '@/data/seed-data';
import { sounds } from '@/lib/sound-manager';

export default function SubjectsPage() {
  return (
    <AppLayout showRightPanel={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-amber-300 flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-400" />
            ПӘНДЕР МЕН ПАТШАЛЫҚТАР
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            Кез келген патшалықты таңдап, миссиялар мен бастықтар сынағына аттан
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUBJECTS.map((sub) => (
            <Link
              key={sub.id}
              href={`/subject/${sub.id}`}
              onClick={() => sounds.play('portal')}
              className="group bg-gradient-to-b from-game-surface to-game-navy rounded-3xl p-5 border-2 border-game-panel hover:border-amber-400 shadow-xl transition-all hover:scale-[1.02] hover:shadow-gold-glow flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-4 border border-game-panel/60">
                  <Image
                    src={sub.bgImage}
                    alt={sub.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-game-deep/90 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-game-deep/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-amber-300 border border-amber-400/30">
                    {sub.name}
                  </div>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  {sub.realmName}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {sub.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-game-panel/80 flex items-center justify-between text-xs">
                <span className="font-extrabold text-amber-400 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {sub.totalMissions} миссия бар
                </span>
                <span className="font-bold text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Патшалыққа кіру <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
