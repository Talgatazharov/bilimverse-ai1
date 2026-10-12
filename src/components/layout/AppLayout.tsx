'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { LeftSidebar } from './LeftSidebar';
import { TopHud } from './TopHud';
import { RightActivityPanel } from './RightActivityPanel';
import { LevelUpModal } from '@/components/ui/LevelUpModal';
import { TreasureChestModal } from '@/components/ui/TreasureChestModal';

interface AppLayoutProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
  missionMobileLayout?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, showRightPanel = true, missionMobileLayout = false }) => {
  const syncCalendar = useGameStore((state) => state.syncCalendar);
  useEffect(() => {
    syncCalendar();
    const interval = window.setInterval(syncCalendar, 60_000);
    return () => window.clearInterval(interval);
  }, [syncCalendar]);
  return (
    <div className="min-h-screen bg-game-deep text-slate-100 flex overflow-x-hidden font-sans">
      {/* 1. Left Game Sidebar */}
      {missionMobileLayout ? <div className="hidden sm:block"><LeftSidebar /></div> : <LeftSidebar />}

      {/* 2. Main Center Body */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {missionMobileLayout ? <div className="hidden sm:block"><TopHud /></div> : <TopHud />}
        <main className={`flex-1 overflow-y-auto ${missionMobileLayout ? 'p-3 sm:p-6' : 'p-6'}`}>
          {children}
        </main>
      </div>

      {/* 3. Right Activity Panel */}
      {showRightPanel && <RightActivityPanel />}

      {/* 4. Global Modals */}
      <LevelUpModal />
      <TreasureChestModal />
    </div>
  );
};
