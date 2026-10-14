'use client';

import { ASSET_MANIFEST } from '@/lib/asset-manifest';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Heart,
  Star,
  ArrowRight,
  RotateCcw,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { Mission, Question } from '@/types';
import { useGameStore } from '@/stores/useGameStore';
import { sounds } from '@/lib/sound-manager';
import { MatchingQuestion } from '@/components/game/MatchingQuestion';
import { recordLearningAttempt } from '@/lib/local-learning-profile';

interface MiniGameContainerProps {
  mission: Mission;
}

export const MiniGameContainer: React.FC<MiniGameContainerProps> = ({ mission }) => {
  const router = useRouter();
  const { completeMission, setQyranMood, recordKazakhWord, student } = useGameStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Boss challenge state
  const isBossMission = mission.hasBoss;
  const [bossHp, setBossHp] = useState(5);

  // Word Builder State
  const [builtWord, setBuiltWord] = useState<string[]>([]);

  // Ordering State
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);

  // Mission Finished State
  const [missionComplete, setMissionComplete] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const completionSubmitted = React.useRef(false);

  const currentQuestion = mission.questions[currentIndex];

  // Initialize interactive question modes on step change
  React.useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);

    if (currentQuestion?.type === 'wordBuilder' && currentQuestion.wordLetters) {
      // Shuffle letters
      setBuiltWord([]);
    } else if (currentQuestion?.type === 'ordering' && currentQuestion.orderItems) {
      // Shuffle order
      setCurrentOrder([...currentQuestion.orderItems].sort(() => Math.random() - 0.5));
    }
  }, [currentIndex, currentQuestion]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    sounds.play('click');
    setSelectedOption(option);

    const correct = option === currentQuestion.correctAnswer;
    try { recordLearningAttempt(currentQuestion, mission.title, correct); } catch { /* storage may be disabled */ }
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      if (currentQuestion.subjectId === 'kazakh' && currentQuestion.type === 'wordBuilder') {
        recordKazakhWord(currentQuestion.id);
      }
      sounds.play('correct');
      setQyranMood('happy');
      if (isBossMission) {
        setBossHp((prev) => Math.max(prev - 1, 0));
      }
    } else {
      sounds.play('incorrect');
      setMistakes((prev) => prev + 1);
      setQyranMood('thinking');
    }
  };

  const handleNextQuestion = () => {
    sounds.play('click');
    if (currentIndex < mission.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (completionSubmitted.current) return;
      completionSubmitted.current = true;
      // Complete Mission
      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
      setEarnedStars(stars);
      setMissionComplete(true);
      completeMission(mission.id, stars, mission.xpReward, mission.coinReward, mission.unlocks);

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24'],
      });
    }
  };

  if (missionComplete) {
    return (
      <div className="max-w-2xl mx-auto my-8 bg-gradient-to-b from-game-surface to-game-navy border-2 border-amber-400 rounded-3xl p-8 text-center shadow-gold-glow-lg animate-in zoom-in-95 duration-500">
        <div className="relative w-28 h-28 mx-auto mb-4 animate-bounce">
          <Image
            src={ASSET_MANIFEST.qyran.celebrating}
            alt="Қыран қуанышты"
            width={112}
            height={112}
            className="object-contain filter drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]"
          />
        </div>

        <h2 className="text-3xl font-black text-amber-300 tracking-wide uppercase">
          МИССИЯ ОРЫНДАЛДЫ!
        </h2>
        <p className="text-xs text-sky-200 mt-1 mb-6">
          «{mission.title}» тапсырмалары сәтті аяқталды!
        </p>

        {/* 3 Stars display */}
        <div className="flex items-center justify-center gap-3 my-6">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`w-12 h-12 transition-all duration-500 ${
                star <= earnedStars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-110'
                  : 'text-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Rewards pill */}
        <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-game-navy/90 border border-amber-400/40 shadow-inner mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-base font-black text-amber-300">+{mission.xpReward} XP</span>
          </div>
          <div className="w-px h-6 bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="text-lg">💎</span>
            <span className="text-base font-black text-cyan-300">+{mission.coinReward} Тұмар</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              sounds.play('portal');
              router.push('/world');
            }}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-gold-glow transition-all active:scale-95 border-b-4 border-amber-700"
          >
            Әлемге оралу
          </button>
          <button
            onClick={() => {
              sounds.play('click');
              router.push('/subjects');
            }}
            className="py-3.5 px-6 rounded-2xl bg-game-surface hover:bg-game-surfaceHover text-white font-bold text-xs tracking-wider uppercase border border-game-panel transition-all active:scale-95"
          >
            Келесі миссиялар →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. Top HUD of Mission */}
      <div className="bg-game-surface/80 rounded-2xl p-4 border border-game-panel flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">
            {mission.title}
          </span>
          <div className="text-sm font-bold text-slate-200">
            {currentIndex + 1} / {mission.questions.length} Сұрақ
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {mission.questions.map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                i < currentIndex
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : i === currentIndex
                  ? 'bg-amber-400 scale-125 shadow-gold-glow animate-pulse'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Boss HP bar if Boss challenge */}
        {isBossMission && (
          <div className="flex items-center gap-2 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-500/40">
            <Shield className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-rose-200 hidden sm:inline">Сақшы:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((hp) => (
                <Heart
                  key={hp}
                  className={`w-4 h-4 ${
                    hp <= bossHp ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Question Card */}
      <div className="bg-gradient-to-b from-game-surface to-game-navy rounded-3xl p-6 sm:p-8 border-2 border-game-panel relative shadow-2xl overflow-hidden">
        {/* Environment character bridge progress indicator */}
        <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden mb-6 border border-game-panel">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / mission.questions.length) * 100}%` }}
          />
        </div>

        {/* Boss Guardian Avatar if Boss Mission */}
        {isBossMission && (
          <div className="flex flex-col items-center mb-6 text-center animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 p-2 shadow-gold-glow mb-2 flex items-center justify-center text-4xl">
              🗿
            </div>
            <h3 className="text-base font-extrabold text-amber-300">
              {mission.bossName || 'Тас Сақшысы'}
            </h3>
            <p className="text-xs text-sky-200">
              «Барлық біліміңді көрсет! Әр дұрыс жауап қамалымның бір қақпасын ашады.»
            </p>
          </div>
        )}

        {/* Question Text */}
        <div className="text-center my-4">
          <h2 className="text-xl sm:text-2xl font-black text-white leading-relaxed">
            {currentQuestion?.question}
          </h2>
        </div>

        {/* Question Interactive Body based on type */}
        <div className="mt-8 space-y-3">
          {/* A. Multiple Choice & True/False */}
          {(currentQuestion?.type === 'multipleChoice' || currentQuestion?.type === 'trueFalse') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isRightAnswer = option === currentQuestion.correctAnswer;

                let btnStyle = 'bg-game-surface hover:bg-game-surfaceHover border-game-panel text-slate-200';
                if (isAnswered) {
                  if (isRightAnswer) {
                    btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-900/60 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'opacity-40 border-slate-700 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option)}
                    className={`py-4 px-5 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all transform active:scale-95 text-left flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isRightAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />}
                    {isAnswered && isSelected && !isRightAnswer && <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Matching also handles the original dragDrop pair question. */}
          {(currentQuestion?.type === 'matching' || currentQuestion?.type === 'dragDrop') && (
            <MatchingQuestion
              key={currentQuestion.id}
              question={currentQuestion}
              missionId={mission.id}
              answered={isAnswered}
              onCheck={(correct) => handleSelectOption(correct ? currentQuestion.correctAnswer : '__matching_incorrect__')}
            />
          )}

          {/* C. Word Builder Mode */}
          {currentQuestion?.type === 'wordBuilder' && currentQuestion.wordLetters && (
            <div className="space-y-4 text-center">
              <div className="min-h-[50px] p-3 bg-game-navy rounded-2xl border-2 border-dashed border-amber-400/50 flex items-center justify-center gap-2 text-xl font-black text-amber-300 tracking-widest">
                {builtWord.length > 0 ? builtWord.join('') : 'Әріптерді басып сөз құрастыр...'}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {currentQuestion.wordLetters.map((letter, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.play('click');
                      const next = [...builtWord, letter];
                      setBuiltWord(next);
                      if (next.join('') === currentQuestion.correctAnswer) {
                        handleSelectOption(next.join(''));
                      }
                    }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-lg shadow-gold-glow hover:scale-110 active:scale-95 transition-all"
                  >
                    {letter}
                  </button>
                ))}
                <button
                  onClick={() => {
                    sounds.play('click');
                    setBuiltWord([]);
                  }}
                  className="px-3 h-12 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Тазарту
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Feedback Dialog from Mascot Qyran */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-6 p-4 rounded-2xl border flex items-start gap-3.5 ${
                isCorrect
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/50 border-amber-500/50 text-amber-200'
              }`}
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={isCorrect ? ASSET_MANIFEST.qyran.happy : ASSET_MANIFEST.qyran.explaining}
                  alt="Қыран"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              <div className="flex-1">
                <div className="font-extrabold text-sm mb-0.5">
                  {isCorrect ? '«Жарайсың! Дұрыс жауап! ✦ +20 XP»' : '«Тағы ойланып көрейік!»'}
                </div>
                <div className="text-xs opacity-90 leading-relaxed">
                  {currentQuestion?.explanation}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Bottom Controls: Hint & Next Step */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-game-panel/60">
          <button
            onClick={() => {
              sounds.play('click');
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Қыраннан көмек (Hint)
          </button>

          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="py-3 px-6 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-gold-glow flex items-center gap-2 transition-all active:scale-95 border-b-4 border-amber-700"
            >
              {currentIndex < mission.questions.length - 1 ? 'Келесі сұрақ' : 'Сыйлықты алу'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hint text if toggled */}
        {showHint && (
          <div className="mt-3 p-3 bg-sky-950/60 rounded-xl border border-sky-400/40 text-xs text-sky-200 animate-in fade-in">
            <strong>Қыранның кеңесі:</strong> {currentQuestion?.hint}
          </div>
        )}
      </div>
    </div>
  );
};
