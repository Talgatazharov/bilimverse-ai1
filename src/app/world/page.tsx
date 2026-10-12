'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WorldMap } from '@/components/world/WorldMap';

export default function WorldPage() {
  return (
    <AppLayout showRightPanel={true}>
      <WorldMap />
    </AppLayout>
  );
}
