'use client';

import { ASSET_MANIFEST } from '@/lib/asset-manifest';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';
import { Sparkles, Hammer, ArrowUp, Gem, CheckCircle2, X } from 'lucide-react';
import { VillageBuilding } from '@/types';

export default function MyWorldVillagePage() {
  const { buildings, upgradeBuilding, student } = useGameStore();
  const [selectedBuilding, setSelectedBuilding] = useState<VillageBuilding | null>(null);
  const [upgradingKey, setUpgradingKey] = useState<string | null>(null);
  const upgradeInProgress = useRef(false);
  const buildingImage = (building: VillageBuilding) =>
    building.key === 'yurt' ? ASSET_MANIFEST.game.yurt
    : building.key === 'library' ? ASSET_MANIFEST.game.steppeHouse
    : building.key === 'qyran_house' ? ASSET_MANIFEST.buildings.eagleGuard
    : building.image;

  const handleUpgrade = (key: string) => {
    if (upgradeInProgress.current) return;
    upgradeInProgress.current = true;
    setUpgradingKey(key);
    const success = upgradeBuilding(key);
    setTimeout(() => {
      upgradeInProgress.current = false;
      setUpgradingKey(null);
      if (success) {
        const updated = useGameStore.getState().buildings.find((b) => b.key === key);
        if (updated) setSelectedBuilding(updated);
      }
    }, 1000);
  };

  return (
    <AppLayout showRightPanel={true}>
      <div className="space-y-6 max-w-5xl mx-auto select-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-amber-300 flex items-center gap-2">
              <span className="text-3xl">🏡</span> БІЛІМ АУЫЛЫ · МЕНІҢ ӘЛЕМІМ
            </h1>
            <p className="text-xs text-sky-200 mt-1">
              Миссиялардан тапқан Тұмар мен XP арқылы өз ауылыңды 3-деңгейге дейін дамыт!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-game-surface px-4 py-2 rounded-2xl border border-game-panel shadow-md">
            <span className="text-xs font-bold text-slate-300">Қолжетімді қор:</span>
            <div className="flex items-center gap-1.5 text-cyan-300 font-black text-sm">
              <Gem className="w-4 h-4 text-cyan-400" />
              {student.currency} Тұмар
            </div>
          </div>
        </div>

        {/* Master Illustrated Village Panoramic Strip */}
        <div className="relative w-full h-56 sm:h-72 rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-game-deep group">
          <Image
            src="/buildings/village-strip.png"
            alt="Білім Ауылы"
            fill
            className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-game-deep via-transparent to-game-navy/30" />
          <div className="absolute bottom-12 left-[5%] w-24 h-24 sm:w-40 sm:h-40 pointer-events-none">
            <Image src={ASSET_MANIFEST.game.yurt} alt="Киіз үй" fill className="object-contain drop-shadow-xl" sizes="(max-width: 640px) 96px, 160px" />
          </div>
          <div className="absolute bottom-10 left-[38%] w-28 h-28 sm:w-48 sm:h-48 pointer-events-none">
            <Image src={ASSET_MANIFEST.game.palace} alt="Білім сарайы" fill className="object-contain drop-shadow-xl" sizes="(max-width: 640px) 112px, 192px" />
          </div>
          <div className="absolute bottom-12 right-[4%] w-24 h-24 sm:w-40 sm:h-40 pointer-events-none">
            <Image src={ASSET_MANIFEST.game.steppeHouse} alt="Дала үйі" fill className="object-contain drop-shadow-xl" sizes="(max-width: 640px) 96px, 160px" />
          </div>
          <div className="absolute top-4 left-6 z-10 bg-game-deep/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400/40">
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
              Ұлы Дала Панорамасы
            </div>
            <div className="text-[11px] text-slate-300">
              10 сиқырлы нысан: Киіз үй, Кітапхана, Қыран ұясы, Бақ, Обсерватория...
            </div>
          </div>
        </div>

        {/* Village Buildings Grid (10 interactive structures) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {buildings.map((b) => {
            const isUpgrading = upgradingKey === b.key;
            const canAfford = student.currency >= b.costToUpgrade && b.level < b.maxLevel;

            return (
              <div
                key={b.key}
                onClick={() => {
                  sounds.play('click');
                  setSelectedBuilding(b);
                }}
                className={`bg-gradient-to-b from-game-surface to-game-navy rounded-3xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between group hover:scale-[1.03] ${
                  isUpgrading
                    ? 'border-amber-400 shadow-gold-glow animate-pulse'
                    : 'border-game-panel hover:border-amber-400/60'
                }`}
              >
                <div>
                  {/* Building Artwork Card */}
                  <div className="relative w-full h-24 rounded-2xl overflow-hidden mb-3 bg-game-deep/80 border border-game-panel/80 flex items-center justify-center">
                    <Image
                      src={buildingImage(b)}
                      alt={b.title}
                      width={80}
                      height={65}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Level Pill */}
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
                      {b.level}-ДЕҢГЕЙ
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {b.perk}
                  </p>
                </div>

                {/* Upgrade Button or Max Level */}
                <div className="mt-4 pt-3 border-t border-game-panel/60 flex items-center justify-between">
                  {b.level < b.maxLevel ? (
                    <button
                      disabled={!canAfford || isUpgrading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgrade(b.key);
                      }}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-gold-glow active:scale-95'
                          : 'bg-game-surface text-slate-500 cursor-not-allowed border border-game-panel'
                      }`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      {b.costToUpgrade} 💎 Жаңарту
                    </button>
                  ) : (
                    <div className="w-full text-center text-xs font-black text-emerald-400 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> ЕҢ ЖОҒАРЫ ДЕҢГЕЙ
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Building Detail Modal */}
        {selectedBuilding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-gradient-to-b from-game-surface to-game-navy border-2 border-amber-400 rounded-3xl p-6 shadow-gold-glow animate-in zoom-in-95">
              <button
                onClick={() => setSelectedBuilding(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-game-surface text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative w-36 h-28 mx-auto mb-3">
                <Image
                  src={buildingImage(selectedBuilding)}
                  alt={selectedBuilding.title}
                  width={140}
                  height={110}
                  className="object-contain mx-auto filter drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)]"
                />
              </div>

              <div className="text-center mb-4">
                <div className="inline-block px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-[11px] mb-1">
                  {selectedBuilding.level} / {selectedBuilding.maxLevel} ДЕҢГЕЙ
                </div>
                <h3 className="text-xl font-black text-white">
                  {selectedBuilding.title}
                </h3>
                <p className="text-xs text-sky-200 mt-2 leading-relaxed">
                  {selectedBuilding.description}
                </p>
              </div>

              <div className="p-3.5 bg-game-deep/80 rounded-2xl border border-game-panel text-xs text-amber-300 mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span><strong>Ерекше қасиеті:</strong> {selectedBuilding.perk}</span>
              </div>

              {selectedBuilding.level < selectedBuilding.maxLevel ? (
                <button
                  disabled={student.currency < selectedBuilding.costToUpgrade}
                  onClick={() => {
                    handleUpgrade(selectedBuilding.key);
                    setSelectedBuilding(null);
                  }}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95 border-b-4 ${
                    student.currency >= selectedBuilding.costToUpgrade
                      ? 'bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 text-slate-950 border-amber-700'
                      : 'bg-game-surface text-slate-500 border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  {selectedBuilding.costToUpgrade} Тұмарға деңгейін көтеру
                </button>
              ) : (
                <div className="text-center text-sm font-black text-emerald-400 flex items-center justify-center gap-2 py-2">
                  <CheckCircle2 className="w-5 h-5" /> Бұл ғимарат толықтай жаңартылған!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
