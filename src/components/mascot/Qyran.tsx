'use client';

import React from 'react';
import { QyranMascot } from './QyranMascot';

export type QyranState = 'idle' | 'happy' | 'thinking' | 'explaining' | 'celebrating' | 'sleeping';

export interface QyranProps {
  state?: QyranState;
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Future-ready Qyran mascot component architecture (Section 15).
 * Standardized interface: <Qyran state="idle" />
 * Seamlessly integrates clean vector rendering, and is pre-configured
 * to support external transparent PNG/WebP assets when supplied.
 */
export const Qyran: React.FC<QyranProps> = ({
  state = 'idle',
  size = 54,
  className = '',
  animate = true,
}) => {
  return (
    <QyranMascot
      mood={state}
      size={size}
      className={className}
      animate={animate}
    />
  );
};
