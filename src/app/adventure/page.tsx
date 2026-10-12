'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/AppLayout';
import { aiService, AIAdventureNode } from '@/lib/ai-service';
import { sounds } from '@/lib/sound-manager';
import { useGameStore } from '@/stores/useGameStore';
import {
  Sparkles,
  MapPin,
  Trophy,
  ArrowRight,
  RotateCcw,
  Compass,
} from 'lucide-react';

const ADVENTURE_THEMES = [
  { id: 'golden-city', title: 'Алтын қаланың құпиясы', icon: '🏰', desc: 'Құм шатқалындағы көне қалаға саяхат' },
  { id: 'lost-tulpar', title: 'Жоғалған тұлпар', icon: '🐎', desc: 'Қанатты тұлпарды іздеу дастаны' },
  { id: 'space-village', title: 'Ғарыштағы қазақ ауылы', icon: '🚀', desc: 'Марстағы алтын киіз үйлер мен роботтар' },
  { id: 'qyran-journey', title: 'Қыранның саяхаты', icon: '🦅', desc: 'Алатау шыңдарындағы биік асулар' },
  { id: 'steppe-expedition', title: 'Ұлы дала экспедициясы', icon: '🗺️', desc: 'Қазақстанның тарихи қалалары' },
];

export default function AiAdventurePage() {
  const { addXp, addCurrency, student } = useGameStore();

  const [selectedTheme, setSelectedTheme] = useState('golden-city');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentNode, setCurrentNode] = useState<AIAdventureNode | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'victory'>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  const startAdventure = async (themeId: string) => {
    sounds.play('portal');
    setSelectedTheme(themeId);
    setCurrentStepIndex(0);
    setFeedback(null);
    const node = await aiService.generateAdventureStep(themeId, 0);
    setCurrentNode(node);
    setGameStatus('playing');
  };

  const handleChoice = (choice: AIAdventureNode['choices'][0]) => {
    sounds.play('click');
    setFeedback(choice.feedback);

    if (choice.isCorrect) {
      sounds.play('correct');
      addXp(currentNode?.rewardXp || 30);
      addCurrency(currentNode?.rewardCoins || 10);

      setTimeout(async () => {
        if (choice.nextStepId === 'victory' || currentStepIndex >= 2) {
          sounds.play('levelUp');
          setGameStatus('victory');
        } else {
          const nextIndex = currentStepIndex + 1;
          setCurrentStepIndex(nextIndex);
          setFeedback(null);
          const nextNode = await aiService.generateAdventureStep(selectedTheme, nextIndex);
          setCurrentNode(nextNode);
        }
      }, 1500);
    } else {
      sounds.play('incorrect');
    }
  };

  return (
    <AppLayout showRightPanel={true}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-black text-amber-300 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            AI ADVENTURE · ТАРМАҚТЫ ЕРТЕГІЛІК КВЕСТ
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            Әр таңдауың оқиға желісін өзгертетін интерактивті қазақы AI саяхат
          </p>
        </div>

        {/* 1. Theme Selector */}
        {gameStatus === 'idle' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ADVENTURE_THEMES.map((th) => (
                <div
                  key={th.id}
                  onClick={() => startAdventure(th.id)}
                  className="bg-gradient-to-b from-game-surface to-game-navy p-5 rounded-3xl border-2 border-game-panel hover:border-amber-400 hover:shadow-gold-glow transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-3xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {th.icon}
                    </div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors">
                      {th.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {th.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-game-panel flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>Бастау</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Interactive Quest Gameplay Node */}
        {gameStatus === 'playing' && currentNode && (
          <div className="bg-gradient-to-b from-game-surface to-game-navy rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-gold-glow space-y-6 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-game-panel">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> {currentNode.title}
              </span>
              <span className="text-xs font-bold text-sky-300">
                {currentStepIndex + 1}-Қадам
              </span>
            </div>

            {/* Story text */}
            <div className="p-5 bg-game-deep/80 rounded-2xl border border-sky-400/30 text-sky-100 text-sm leading-relaxed whitespace-pre-line shadow-inner">
              {currentNode.storyText}
            </div>

            {/* Question prompt */}
            <div className="text-center my-4">
              <h3 className="text-lg font-black text-amber-300">
                {currentNode.question}
              </h3>
            </div>

            {/* Choices */}
            <div className="space-y-3">
              {currentNode.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className="w-full p-4 rounded-2xl bg-game-surface hover:bg-game-surfaceHover border-2 border-game-panel hover:border-amber-400 text-left font-bold text-sm text-white transition-all transform active:scale-95 flex items-center justify-between group"
                >
                  <span>{choice.text}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>

            {/* Feedback message */}
            {feedback && (
              <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-400/60 text-xs text-amber-200 font-bold animate-in fade-in">
                {feedback}
              </div>
            )}
          </div>
        )}

        {/* 3. Victory Screen */}
        {gameStatus === 'victory' && (
          <div className="bg-gradient-to-b from-game-surface to-game-navy rounded-3xl p-8 text-center border-2 border-amber-400 shadow-gold-glow space-y-6 animate-in zoom-in-95">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-500/20 text-5xl flex items-center justify-center animate-bounce">
              🏆
            </div>
            <h2 className="text-3xl font-black text-amber-300 uppercase">
              КВЕСТ ТРИУМФЫ!
            </h2>
            <p className="text-xs text-sky-200 max-w-md mx-auto leading-relaxed">
              Жарайсың, {student.name}! Сен AI Adventure саяхатынан абыроймен өтіп,
              Ұлы Даланың сиқырын сақтап қалдың.
            </p>

            <button
              onClick={() => setGameStatus('idle')}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-gold-glow transition-all active:scale-95 border-b-4 border-amber-700"
            >
              Басқа саяхатты таңдау
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
