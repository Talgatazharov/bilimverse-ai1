'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Check, Link2, X } from 'lucide-react';
import type { MatchingItem, Question } from '@/types';
import { normalizeMatchingPairs, shuffledMatchingPairs } from '@/lib/matching';

interface MatchingQuestionProps {
  question: Question;
  missionId: string;
  answered: boolean;
  onCheck: (correct: boolean) => void;
}

function MatchingItemView({ item }: { item: MatchingItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (typeof item === 'string') return <span className="break-words">{item}</span>;
  return (
    <span className="flex min-w-0 items-center gap-2">
      {item.image && !imageFailed && (
        <Image
          src={item.image}
          alt={item.alt || item.text || 'Сәйкестендіру суреті'}
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-lg object-contain"
          onError={() => setImageFailed(true)}
        />
      )}
      <span className="break-words">{item.text || (imageFailed ? item.alt || 'Сурет жүктелмеді' : '')}</span>
    </span>
  );
}

export function MatchingQuestion({ question, missionId, answered, onCheck }: MatchingQuestionProps) {
  const validation = useMemo(() => normalizeMatchingPairs(question), [question]);
  const [rightOrder] = useState(() => shuffledMatchingPairs(validation.pairs, question.id));
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const submitted = useRef(false);
  const pairs = validation.pairs;
  const complete = pairs.length > 0 && Object.keys(connections).length === pairs.length;

  useEffect(() => {
    if (validation.error) {
      console.error(`Matching data error: mission=${missionId}, question=${question.id}: ${validation.error}`);
    }
  }, [missionId, question.id, validation.error]);

  if (validation.error) {
    return (
      <div role="alert" className="rounded-2xl border border-amber-500/50 bg-amber-950/30 p-5 text-center text-sm text-amber-200">
        Matching тапсырмасының деректері табылмады.
      </div>
    );
  }

  const connect = (rightId: string) => {
    if (answered || submitted.current || !selectedLeft) return;
    setConnections((previous) => {
      const next = { ...previous };
      for (const [leftId, assignedRight] of Object.entries(next)) {
        if (assignedRight === rightId) delete next[leftId];
      }
      next[selectedLeft] = rightId;
      return next;
    });
    setSelectedLeft(null);
  };

  const check = () => {
    if (!complete || answered || submitted.current) return;
    submitted.current = true;
    onCheck(pairs.every((pair) => connections[pair.id] === pair.id));
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-xs font-semibold text-sky-200">
        Сол жақтан бір карточканы, содан кейін оның оң жақтағы жұбын бас.
      </p>
      <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-5">
        <div className="min-w-0 space-y-3">
          <div className="text-center text-xs font-black uppercase tracking-wide text-amber-300">Сол жақ</div>
          {pairs.map((pair, index) => {
            const rightId = connections[pair.id];
            const linked = Boolean(rightId);
            const correct = rightId === pair.id;
            const status = answered && linked
              ? correct ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100' : 'border-rose-400 bg-rose-950/50 text-rose-100'
              : selectedLeft === pair.id
              ? 'border-amber-400 bg-amber-500/20 text-amber-100 shadow-gold-glow scale-[1.02]'
              : linked ? 'border-cyan-400/70 bg-cyan-950/30 text-cyan-100' : 'border-game-panel bg-game-surface text-slate-100 hover:border-amber-400/70';
            return (
              <button
                key={pair.id}
                type="button"
                disabled={answered}
                aria-pressed={selectedLeft === pair.id}
                onClick={() => setSelectedLeft(pair.id)}
                className={`flex min-h-14 w-full min-w-0 items-center justify-between gap-2 rounded-2xl border-2 p-3 text-left text-sm font-bold transition-all ${status}`}
              >
                <MatchingItemView item={pair.left} />
                {linked && <span className="flex shrink-0 items-center gap-1 text-xs font-black">{index + 1} ↔ {answered && (correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />)}</span>}
              </button>
            );
          })}
        </div>
        <div className="min-w-0 space-y-3">
          <div className="text-center text-xs font-black uppercase tracking-wide text-cyan-300">Оң жақ</div>
          {rightOrder.map((pair) => {
            const leftId = Object.keys(connections).find((id) => connections[id] === pair.id);
            const linked = Boolean(leftId);
            const correct = leftId === pair.id;
            const number = pairs.findIndex((item) => item.id === leftId) + 1;
            const status = answered && linked
              ? correct ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100' : 'border-rose-400 bg-rose-950/50 text-rose-100'
              : linked ? 'border-cyan-400/70 bg-cyan-950/30 text-cyan-100' : 'border-game-panel bg-game-surface text-slate-100 hover:border-cyan-400/70';
            return (
              <button
                key={pair.id}
                type="button"
                disabled={answered || !selectedLeft}
                onClick={() => connect(pair.id)}
                className={`flex min-h-14 w-full min-w-0 items-center justify-between gap-2 rounded-2xl border-2 p-3 text-left text-sm font-bold transition-all disabled:cursor-default ${status}`}
              >
                <MatchingItemView item={pair.right} />
                {linked && <span className="flex shrink-0 items-center gap-1 text-xs font-black">{number} ↔ {answered && (correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />)}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        disabled={!complete || answered}
        onClick={check}
        className="mx-auto flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 px-6 py-2.5 text-sm font-black text-slate-950 transition-all enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Link2 className="h-4 w-4" /> Тексеру {Object.keys(connections).length}/{pairs.length}
      </button>
    </div>
  );
}
