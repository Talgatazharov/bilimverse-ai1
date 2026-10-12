'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  CheckCircle2,
  Star,
  Play,
} from 'lucide-react';
import { SUBJECTS } from '@/data/seed-data';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';
import { SubjectId } from '@/types';
import { ASSET_MANIFEST } from '@/lib/asset-manifest';

interface WorldHotspot {
  id: SubjectId;
  name: string;        // Subject title: 'Математика', 'Қазақ тілі', etc.
  realmName: string;   // Kingdom realm title: 'Сандар патшалығы', 'Сөздер орманы', etc.
  xPercent: number;    // Responsive percentage coordinates on Image 2
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  route: string;
  ariaLabel: string;
}

export const WorldMap: React.FC = () => {
  const router = useRouter();
  const { student } = useGameStore();
  const [hoveredRegion, setHoveredRegion] = useState<SubjectId | null>(null);
  const [transitioningRegion, setTransitioningRegion] = useState<SubjectId | null>(null);

  // 6 canonical regions mapped with precision percentage coordinates over Image 2 (16:9 canvas)
  const hotspots: WorldHotspot[] = [
    {
      id: 'math',
      name: 'Математика',
      realmName: 'Сандар патшалығы',
      xPercent: 6.5,
      yPercent: 10,
      widthPercent: 26,
      heightPercent: 30,
      route: '/subject/math',
      ariaLabel: 'Сандар патшалығы (Математика) аймағына өту',
    },
    {
      id: 'kazakh',
      name: 'Қазақ тілі',
      realmName: 'Сөздер орманы',
      xPercent: 37,
      yPercent: 23,
      widthPercent: 26,
      heightPercent: 34,
      route: '/subject/kazakh',
      ariaLabel: 'Сөздер орманы (Қазақ тілі) аймағына өту',
    },
    {
      id: 'literature',
      name: 'Әдебиеттік оқу',
      realmName: 'Ертегілер елі',
      xPercent: 67,
      yPercent: 14,
      widthPercent: 27,
      heightPercent: 32,
      route: '/subject/literature',
      ariaLabel: 'Ертегілер елі (Әдебиеттік оқу) аймағына өту',
    },
    {
      id: 'world',
      name: 'Дүниетану',
      realmName: 'Зерттеушілер аралы',
      xPercent: 5,
      yPercent: 43,
      widthPercent: 25,
      heightPercent: 35,
      route: '/subject/world',
      ariaLabel: 'Зерттеушілер аралы (Жаратылыстану, Дүниетану) аймағына өту',
    },
    {
      id: 'english',
      name: 'Ағылшын тілі',
      realmName: 'English Town',
      xPercent: 35.5,
      yPercent: 58,
      widthPercent: 26,
      heightPercent: 32,
      route: '/subject/english',
      ariaLabel: 'English Town (Ағылшын тілі) аймағына өту',
    },
    {
      id: 'digital',
      name: 'Цифрлық сауаттылық',
      realmName: 'Digital City',
      xPercent: 67,
      yPercent: 50,
      widthPercent: 28,
      heightPercent: 38,
      route: '/subject/digital',
      ariaLabel: 'Digital City (Цифрлық сауаттылық) аймағына өту',
    },
  ];

  const handleRegionClick = (regionId: SubjectId, route: string) => {
    sounds.play('portal');
    setTransitioningRegion(regionId);
    setTimeout(() => {
      router.push(route);
    }, 280);
  };

  return (
    <div className="space-y-10 select-none">
      {/* 1. Main Interactive World Map Canvas (Complete Image 2 Integration) */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl bg-game-deep select-none">
        {/* Aspect Ratio Container (16:9 matching Image 2 perfectly) */}
        <div className="relative w-full aspect-[16/9] min-h-[440px] max-h-[720px] overflow-hidden group">
          {/* Layer 0: Pristine High-Resolution World Map Image (Image 2 - No crops, No distortions) */}
          <Image
            src={ASSET_MANIFEST.world.mainMap}
            alt="BILIMVERSE — Ұлы Дала және Білім Әлемі"
            fill
            priority
            quality={95}
            className="object-cover pointer-events-none transition-transform duration-700 ease-out scale-[1.002]"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />

          {/* Layer 1: Subtle Vignette Frame Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-game-deep/40 via-transparent to-game-navy/20 pointer-events-none" />

          {/* Layer 2: 6 Transparent Accessible React Hotspots over Kingdoms */}
          {hotspots.map((spot) => {
            const isHovered = hoveredRegion === spot.id;
            const isTransitioning = transitioningRegion === spot.id;

            return (
              <Link
                key={spot.id}
                href={spot.route}
                aria-label={spot.ariaLabel}
                style={{
                  left: `${spot.xPercent}%`,
                  top: `${spot.yPercent}%`,
                  width: `${spot.widthPercent}%`,
                  height: `${spot.heightPercent}%`,
                }}
                className="absolute z-20 cursor-pointer rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-amber-400/80 transition-all duration-300 block"
                onMouseEnter={() => {
                  sounds.play('hover');
                  setHoveredRegion(spot.id);
                }}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={(e) => {
                  e.preventDefault();
                  handleRegionClick(spot.id, spot.route);
                }}
              >
                {/* Subtle, elegant hover glow & radial highlight */}
                <div
                  className={`w-full h-full rounded-2xl transition-all duration-300 pointer-events-none flex items-center justify-center ${
                    isHovered
                      ? 'opacity-100 ring-2 ring-amber-300/80 shadow-[0_0_30px_rgba(245,158,11,0.55)] bg-gradient-to-br from-amber-400/15 via-amber-300/5 to-transparent'
                      : 'opacity-0'
                  } ${isTransitioning ? 'animate-ping bg-amber-400/30 ring-4 ring-amber-400' : ''}`}
                >
                  {/* Subtle golden sparkle indicator on hover */}
                  {isHovered && (
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-300 shadow-gold-glow animate-pulse"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. SUBJECTS EXPLORATION SECTION (Section 30 - Preserved clean cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-amber-300 tracking-wide flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              ПӘНДЕРДІ ЗЕРТТЕЙІК
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Әр карточка — жеке сиқырлы әлем мен білім қамалы
            </p>
          </div>
          <Link
            href="/subjects"
            onClick={() => sounds.play('click')}
            className="text-xs text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            Барлық пәндерді көру <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 7 Subject Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SUBJECTS.map((subject) => {
            const isCompleted =
              Object.keys(student.completedMissions).filter((m) => m.startsWith(subject.id))
                .length > 0;

            return (
              <div
                key={subject.id}
                onClick={() => {
                  sounds.play('portal');
                  router.push(`/subject/${subject.id}`);
                }}
                className="group relative bg-gradient-to-b from-game-surface/90 to-game-navy/95 border-2 border-game-panel hover:border-amber-400/80 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-gold-glow flex flex-col justify-between overflow-hidden"
              >
                {/* Background Glow */}
                <div
                  className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br ${subject.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}
                />

                <div>
                  {/* Poster Header */}
                  <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-4 border border-game-panel/80">
                    <Image
                      src={subject.bgImage}
                      alt={subject.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-game-deep/90 via-transparent to-transparent" />
                    
                    {/* Top Subject Tag */}
                    <div className="absolute top-2.5 left-2.5 bg-game-deep/85 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-black text-amber-300 border border-amber-400/30">
                      {subject.name}
                    </div>
                  </div>

                  {/* Header Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">
                      {subject.id === 'math'
                        ? '📐'
                        : subject.id === 'kazakh'
                        ? '🌿'
                        : subject.id === 'literature'
                        ? '📖'
                        : subject.id === 'science'
                        ? '🔬'
                        : subject.id === 'world'
                        ? '🔭'
                        : subject.id === 'english'
                        ? '🏰'
                        : '⚡'}
                    </span>
                    <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors">
                      {subject.realmName}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                </div>

                {/* Footer Progress & Action */}
                <div className="mt-5 pt-3 border-t border-game-panel/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{subject.totalMissions} миссия</span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
