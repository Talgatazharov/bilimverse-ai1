'use client';

import { ASSET_MANIFEST } from '@/lib/asset-manifest';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Mood = 'idle' | 'happy' | 'thinking' | 'explaining' | 'celebrating' | 'sleeping' | 'flying';

interface QyranMascotProps {
  mood?: Mood;
  size?: number;
  className?: string;
  animate?: boolean;
}

const moodImages: Record<Mood, string> = {
  idle: ASSET_MANIFEST.qyran.idle,
  happy: ASSET_MANIFEST.qyran.happy,
  thinking: ASSET_MANIFEST.qyran.thinking,
  explaining: ASSET_MANIFEST.qyran.explaining,
  celebrating: ASSET_MANIFEST.qyran.celebrating,
  sleeping: ASSET_MANIFEST.qyran.sleeping,
  flying: ASSET_MANIFEST.qyran.happy,
};

export const QyranMascot: React.FC<QyranMascotProps> = ({
  mood = 'idle',
  size = 48,
  className = '',
  animate = true,
}) => (
  <motion.div
    className={`relative inline-flex items-center justify-center select-none ${className}`}
    style={{ width: size, height: size }}
    animate={animate ? mood === 'flying'
      ? { y: [-2, 2, -2], rotate: [-2, 2, -2] }
      : mood === 'celebrating'
      ? { scale: [1, 1.08, 1], y: [0, -3, 0] }
      : mood === 'sleeping'
      ? { scale: [1, 0.97, 1] }
      : { y: [-1.5, 1.5, -1.5] }
      : undefined}
    transition={{ duration: mood === 'sleeping' ? 3.5 : mood === 'celebrating' ? 1.2 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Image
      src={moodImages[mood]}
      alt={`Қыран — ${mood}`}
      fill
      unoptimized
      sizes={`${size}px`}
      className="object-contain drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]"
    />
  </motion.div>
);
