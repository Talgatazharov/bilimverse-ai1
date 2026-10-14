'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BookOpen, Sparkles, BookMarked, Search, X } from 'lucide-react';
import { sounds } from '@/lib/sound-manager';
import { LIBRARY_STORIES, type LibraryStory } from '@/data/library-stories';

export default function LibraryPage() {
  const [selectedBook, setSelectedBook] = useState<LibraryStory | null>(null);

  const books = LIBRARY_STORIES;

  return (
    <AppLayout showRightPanel={false} missionMobileLayout>
      <div className="space-y-6 max-w-5xl mx-auto select-none">
        <div>
          <h1 className="text-2xl font-black text-amber-300 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            СИҚЫРЛЫ КІТАПХАНА · ДАЛА ҚАЗЫНАСЫ
          </h1>
          <p className="text-xs text-sky-200 mt-1">
            Қазақ ертегілері, батырлар дастаны және ғылыми қызықты әңгімелер сөресі
          </p>
        </div>

        {/* Bookshelf Visual Grid */}
        <div className="bg-gradient-to-b from-amber-950/20 via-game-surface to-game-navy rounded-3xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {books.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  sounds.play('click');
                  setSelectedBook(b);
                }}
                className="group cursor-pointer flex flex-col items-center"
              >
                {/* Book 3D Spine & Cover */}
                <div
                  className={`w-36 h-52 rounded-2xl p-4 bg-gradient-to-br ${b.coverColor} border-2 border-amber-300/60 shadow-xl group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-gold-glow transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
                >
                  {/* Gold Corner Ornaments */}
                  <div className="absolute top-1 left-1 text-[10px] text-amber-300 opacity-60">⚜</div>
                  <div className="absolute top-1 right-1 text-[10px] text-amber-300 opacity-60">⚜</div>

                  <div>
                    <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                      {b.category === 'fairy' ? 'Ертегі' : 'Ғылым'}
                    </span>
                    <h3 className="font-black text-sm text-white mt-1 leading-snug">
                      {b.title}
                    </h3>
                  </div>

                  <div className="text-[10px] text-sky-200 font-bold border-t border-white/20 pt-2">
                    {b.author}
                  </div>
                </div>

                {/* Wooden Shelf Baseline */}
                <div className="w-full h-3 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-full mt-2 shadow-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Reading Book Modal */}
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-gradient-to-b from-game-surface to-game-navy border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-gold-glow max-h-[85vh] flex flex-col">
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-game-surface text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 pb-4 border-b border-game-panel mb-4">
                <BookMarked className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-xl font-black text-white">{selectedBook.title}</h3>
                  <div className="text-xs text-amber-400 font-bold">{selectedBook.author}</div>
                </div>
              </div>

              {/* Book Text Content */}
              <div className="flex-1 overflow-y-auto pr-2 text-sm text-sky-100 leading-relaxed space-y-4 scrollbar-thin scrollbar-thumb-game-panel">
                {selectedBook.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                <div className="rounded-2xl bg-game-deep/70 p-4">
                  <strong className="text-amber-300">Ойлан:</strong>
                  <ol className="mt-2 list-decimal pl-5 space-y-1">
                    {selectedBook.reflection.map((question) => <li key={question}>{question}</li>)}
                  </ol>
                </div>
                <p className="text-xs text-amber-300 italic pt-4">
                  «Оқыған — озар, оқымаған — тозар. Білім әлемі саған әрқашан ашық!»
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-game-panel flex justify-end">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Оқуды аяқтау
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
