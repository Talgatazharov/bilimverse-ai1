'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/AppLayout';
import { aiService, AIHintResponse } from '@/lib/ai-service';
import { sounds } from '@/lib/sound-manager';
import { useGameStore } from '@/stores/useGameStore';
import {
  Bot,
  Send,
  Lightbulb,
  FileQuestion,
  BookOpen,
  Camera,
  CheckCircle2,
  Sparkles,
  Upload,
} from 'lucide-react';
import { QyranMascot } from '@/components/mascot/QyranMascot';

interface ChatMessage {
  id: string;
  sender: 'user' | 'qyran';
  text: string;
  time: string;
  mood?: string;
}

export default function AiTutorPage() {
  const { student, qyranMood, setQyranMood, recordQyranChat } = useGameStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'ocr'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'qyran',
      text: `Сәлем, ${student.name}! Мен сенің AI серігің Қыранмын. Қандай да бір есеп түсініксіз болса немесе тақырыпты талқылағың келсе, маған жаз! Мен бірден жауабын айтпаймын, қадам-қадаммен бірге шешеміз! 🦅`,
      time: '12:00',
      mood: 'happy',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hintStep, setHintStep] = useState(1);

  // OCR Homework State
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<{
    recognizedText: string;
    analysis: string;
    corrections: string[];
    score: number;
  } | null>(null);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim()) return;

    sounds.play('click');
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setQyranMood('thinking');

    try {
      let replyText = '';
      if (textToSend.includes('Hint') || textToSend.includes('кеңес')) {
        const hint = await aiService.generateHint(textToSend, hintStep);
        replyText = hint.message;
        setHintStep((prev) => (prev % 5) + 1);
        setQyranMood(hint.qyranMood);
      } else {
        replyText = await aiService.explainTopic(textToSend, student.grade);
        setQyranMood('explaining');
      }

      sounds.play('correct');
      const qyranMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'qyran',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, qyranMsg]);
      recordQyranChat();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOcrAnalyze = async () => {
    sounds.play('click');
    setOcrLoading(true);
    try {
      const res = await aiService.checkHomeworkOCR('dapter.jpg');
      setOcrResult(res);
      sounds.play('levelUp');
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <AppLayout showRightPanel={true}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-amber-300 flex items-center gap-2">
              <Bot className="w-6 h-6 text-amber-400" />
              ҚЫРАН AI · СОКРАТТЫҚ ТӘЛІМГЕР
            </h1>
            <p className="text-xs text-sky-200 mt-1">
              Педагогикалық 5-сатылы ретпен ойлануға жетелейтін ақылды серік
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-game-surface p-1 rounded-2xl border border-game-panel">
            <button
              onClick={() => {
                sounds.play('click');
                setActiveTab('chat');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💬 Сұрақ-Жауап
            </button>
            <button
              onClick={() => {
                sounds.play('click');
                setActiveTab('ocr');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'ocr'
                  ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Дәптерді Тексеру (OCR)
            </button>
          </div>
        </div>

        {/* Tab 1: Socratic AI Chat */}
        {activeTab === 'chat' && (
          <div className="bg-gradient-to-b from-game-surface to-game-navy rounded-3xl border-2 border-game-panel shadow-2xl flex flex-col h-[580px] overflow-hidden">
            {/* Mascot Banner in chat header */}
            <div className="px-6 py-3 bg-game-deep/80 border-b border-game-panel flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <QyranMascot mood={qyranMood} size={40} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-amber-300">Қыран AI</div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                  Желіде · Көмектесуге дайын
                </div>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-game-panel">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'qyran' && (
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center flex-shrink-0 text-sm">
                      🦅
                    </div>
                  )}

                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-gold-glow rounded-tr-none'
                        : 'bg-game-surface border border-sky-400/30 text-sky-100 rounded-tl-none shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="block text-[9px] opacity-60 text-right mt-1.5">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-amber-400 italic">
                  <span className="animate-spin">✦</span> Қыран ойланып жатыр...
                </div>
              )}
            </div>

            {/* Quick Action Buttons (Section 18) */}
            <div className="px-4 py-2.5 bg-game-deep/90 border-t border-game-panel flex flex-wrap gap-2">
              <button
                onClick={() => handleSend('Көбейту кестесін қалай тез жаттауға болады? Түсіндірші')}
                className="px-3 py-1.5 rounded-xl bg-game-surface hover:bg-game-surfaceHover border border-game-panel text-[11px] text-amber-300 font-bold flex items-center gap-1 transition-all"
              >
                <BookOpen className="w-3 h-3 text-amber-400" /> Түсіндір
              </button>
              <button
                onClick={() => handleSend('Ондықтарды қосуға өмірден мысал келтірші')}
                className="px-3 py-1.5 rounded-xl bg-game-surface hover:bg-game-surfaceHover border border-game-panel text-[11px] text-sky-300 font-bold flex items-center gap-1 transition-all"
              >
                <Sparkles className="w-3 h-3 text-sky-400" /> Мысал келтір
              </button>
              <button
                onClick={() => handleSend('Маған қазақ тілінен қызық тапсырма берші')}
                className="px-3 py-1.5 rounded-xl bg-game-surface hover:bg-game-surfaceHover border border-game-panel text-[11px] text-emerald-300 font-bold flex items-center gap-1 transition-all"
              >
                <FileQuestion className="w-3 h-3 text-emerald-400" /> Маған тапсырма бер
              </button>
              <button
                onClick={() => handleSend('Осы есепке Hint берші')}
                className="px-3 py-1.5 rounded-xl bg-game-surface hover:bg-game-surfaceHover border border-game-panel text-[11px] text-purple-300 font-bold flex items-center gap-1 transition-all"
              >
                <Lightbulb className="w-3 h-3 text-purple-400" /> Hint бер ({hintStep}/5)
              </button>
            </div>

            {/* Text Input Footer */}
            <div className="p-4 bg-game-deep border-t border-game-panel/80 flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Қыраннан сұрағыңды жаз..."
                className="flex-1 bg-game-surface border border-game-panel rounded-2xl py-3 px-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
              <button
                disabled={isLoading || !inputText.trim()}
                onClick={() => handleSend()}
                className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 text-slate-950 font-black shadow-gold-glow disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: OCR Homework Checker (Section 17) */}
        {activeTab === 'ocr' && (
          <div className="bg-game-surface/90 rounded-3xl p-6 sm:p-8 border-2 border-game-panel shadow-2xl space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 text-2xl">
                📸
              </div>
              <h2 className="text-xl font-black text-amber-300">
                Үй Тапсырмасының Суретін Тексеру (OCR)
              </h2>
              <p className="text-xs text-sky-200 mt-1">
                Оқушының дәптеріндегі қолжазбаны сканерлеп, қателерді анықтайды және
                дұрыс шешу жолын түсіндіреді.
              </p>
            </div>

            {/* Upload Box */}
            <div
              onClick={handleOcrAnalyze}
              className="border-2 border-dashed border-amber-400/50 hover:border-amber-400 rounded-3xl p-8 text-center cursor-pointer bg-game-navy/60 hover:bg-game-navy transition-all group"
            >
              <Upload className="w-10 h-10 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-bold text-white">
                Дәптер парағын жүктеу немесе суретке түсіру
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Demo тексеру үшін шертіңіз (мысалды талдайды)
              </div>
            </div>

            {ocrLoading && (
              <div className="text-center py-6 text-amber-400 font-bold text-sm animate-pulse">
                ✦ Жасанды интеллект қолжазбаны оқып жатыр...
              </div>
            )}

            {ocrResult && !ocrLoading && (
              <div className="space-y-4 animate-in fade-in duration-300 pt-4 border-t border-game-panel">
                <div className="flex items-center justify-between bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/40">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="text-sm font-extrabold text-emerald-200">
                        Тексеру аяқталды
                      </div>
                      <div className="text-xs text-slate-300">
                        Дәлдік бағасы: <strong>{ocrResult.score}%</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-game-navy rounded-2xl border border-game-panel text-xs space-y-2">
                  <div className="font-bold text-amber-300">Танылған мәтін:</div>
                  <div className="text-slate-300 italic">{ocrResult.recognizedText}</div>
                </div>

                <div className="p-4 bg-game-navy rounded-2xl border border-game-panel text-xs space-y-2">
                  <div className="font-bold text-sky-300">Қыранның талдауы:</div>
                  <div className="text-slate-300">{ocrResult.analysis}</div>
                </div>

                <div className="p-4 bg-game-navy rounded-2xl border border-game-panel text-xs space-y-2">
                  <div className="font-bold text-amber-400">Ұсынылған түзетулер:</div>
                  <ul className="space-y-1.5 text-slate-200">
                    {ocrResult.corrections.map((cor, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400">✓</span>
                        <span>{cor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
