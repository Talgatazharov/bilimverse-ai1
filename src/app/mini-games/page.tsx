'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGameStore } from '@/stores/useGameStore';

type Game = 'train' | 'robot' | 'speak';
type SpeechResult = { results: { [index: number]: { [index: number]: { transcript: string } } } };
type SpeechEngine = { lang: string; onresult: ((event: SpeechResult) => void) | null; onerror: (() => void) | null; start: () => void };
type SpeechWindow = Window & { SpeechRecognition?: new () => SpeechEngine; webkitSpeechRecognition?: new () => SpeechEngine };

const directions = [
  { label: '↑', dx: 0, dy: -1 }, { label: '↓', dx: 0, dy: 1 },
  { label: '←', dx: -1, dy: 0 }, { label: '→', dx: 1, dy: 0 },
];
const trains = [
  { a: 72, b: 18, choices: [80, 90, 100] },
  { a: 48, b: 27, choices: [65, 75, 85] },
  { a: 63, b: 19, choices: [72, 82, 92] },
  { a: 56, b: 38, choices: [84, 94, 104] },
  { a: 34, b: 29, choices: [53, 63, 73] },
  { a: 67, b: 15, choices: [72, 82, 92] },
  { a: 39, b: 46, choices: [75, 85, 95] },
];
const speechWords = ['apple', 'book', 'green', 'school', 'family', 'water', 'friend'];

export default function MiniGamesPage() {
  const student = useGameStore((state) => state.student);
  const addXp = useGameStore((state) => state.addXp);
  const [game, setGame] = React.useState<Game>('train');
  const [feedback, setFeedback] = React.useState('');
  const [commands, setCommands] = React.useState<string[]>([]);
  const [spoken, setSpoken] = React.useState('');
  const [claimed, setClaimed] = React.useState<Record<Game, boolean>>({ train: false, robot: false, speak: false });
  const day = new Date().toLocaleDateString('sv-SE');
  const dayIndex = Math.floor(new Date(`${day}T12:00:00`).getTime() / 86_400_000) % trains.length;
  const train = trains[dayIndex];
  const speechWord = speechWords[dayIndex];
  React.useEffect(() => {
    setClaimed({
      train: localStorage.getItem(`bilimverse-minigame-train-${day}`) === '1',
      robot: localStorage.getItem(`bilimverse-minigame-robot-${day}`) === '1',
      speak: localStorage.getItem(`bilimverse-minigame-speak-${day}`) === '1',
    });
  }, [day]);

  const reward = (kind: Game) => {
    if (localStorage.getItem(`bilimverse-minigame-${kind}-${day}`) === '1') {
      setFeedback('Дұрыс! Бүгінгі XP сыйлығы бұрын берілген.');
      return;
    }
    localStorage.setItem(`bilimverse-minigame-${kind}-${day}`, '1');
    addXp(15);
    setClaimed((previous) => ({ ...previous, [kind]: true }));
    setFeedback('Керемет! +15 XP алдың.');
  };

  const runRobot = () => {
    let x = 0; let y = 0;
    for (const symbol of commands) {
      const move = directions.find((item) => item.label === symbol);
      if (!move) continue;
      x += move.dx; y += move.dy;
      if (x < 0 || y < 0 || x > 2 || y > 2 || (x === 1 && y === 1)) {
        setFeedback('Робот қабырғаға не тасқа соғылды. Басқа жолды таңда.');
        return;
      }
    }
    if (x === 2 && y === 2) reward('robot');
    else setFeedback('Робот мақсатқа жетпеді. Командаларды толықтыр.');
  };

  const listen = () => {
    const browser = window as SpeechWindow;
    const Engine = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Engine) { setFeedback('Бұл браузерде дауысты тану жоқ. Chrome арқылы көріңіз.'); return; }
    const recognizer = new Engine();
    recognizer.lang = 'en-US';
    recognizer.onresult = (event) => {
      const heard = event.results[0][0].transcript.trim().toLowerCase();
      setSpoken(heard);
      if (heard.split(/\W+/).includes(speechWord)) reward('speak');
      else setFeedback(`«${speechWord}» сөзін тағы бір рет анық айтып көр.`);
    };
    recognizer.onerror = () => setFeedback('Микрофон қолжетімсіз немесе дауыс танылмады.');
    try { recognizer.start(); setFeedback('Тыңдап тұрмын...'); } catch { setFeedback('Микрофонды іске қосу мүмкін болмады.'); }
  };

  return <AppLayout showRightPanel={false}>
    <div className="mx-auto max-w-3xl space-y-6 text-slate-100">
      <h1 className="text-3xl font-black text-amber-300">Пәндік mini-game</h1>
      <p className="text-sm text-slate-300">{student.name}, әр ойынды күніне бір рет орындап, 15 XP ала аласың.</p>
      <div className="flex flex-wrap gap-2">{([['train','🚂 Number Train'],['robot','🤖 Robot Path'],['speak','🎤 Speak Battle']] as const).map(([id, label]) =>
        <button key={id} onClick={() => { setGame(id); setFeedback(''); }} className={`rounded-xl px-4 py-2 font-bold ${game === id ? 'bg-amber-400 text-slate-950' : 'bg-game-surface'}`}>{label}</button>)}</div>
      <section className="rounded-3xl border border-game-panel bg-game-surface p-6 space-y-5">
        {game === 'train' && <>
          <h2 className="text-xl font-bold">{train.a} + {train.b} = ? Дұрыс вагонды таңда</h2>
          <div className="flex flex-wrap gap-3 text-4xl">🚂{train.choices.map((answer) => <button key={answer} onClick={() => answer === train.a + train.b ? reward('train') : setFeedback(`Тағы ойлан: ${train.a} + ${Math.floor(train.b / 10) * 10} + ${train.b % 10}.`)} className="rounded-2xl border border-amber-400/40 bg-slate-800 p-4 text-xl font-black">{answer} 🚃</button>)}</div>
        </>}
        {game === 'robot' && <>
          <h2 className="text-xl font-bold">Роботты ⭐ белгісіне жеткіз. 🪨 тасты айналып өт.</h2>
          <div className="grid w-48 grid-cols-3 gap-2 text-center text-3xl">{['🤖','·','·','·','🪨','·','·','·','⭐'].map((cell, index) => <div key={index} className="rounded-lg bg-slate-800 p-2">{cell}</div>)}</div>
          <div className="flex flex-wrap gap-2">{directions.map((move) => <button key={move.label} onClick={() => setCommands((prev) => [...prev, move.label])} className="rounded-lg bg-slate-700 px-4 py-2 text-xl">{move.label}</button>)}</div>
          <p>Бағдарлама: {commands.join(' ') || 'Командаларды таңда'}</p>
          <div className="flex gap-2"><button onClick={runRobot} className="rounded-lg bg-amber-400 px-4 py-2 font-bold text-slate-950">Жүргізу</button><button onClick={() => { setCommands([]); setFeedback(''); }} className="rounded-lg bg-slate-700 px-4 py-2">Тазалау</button></div>
        </>}
        {game === 'speak' && <>
          <h2 className="text-xl font-bold">«{speechWord}» сөзін ағылшынша айт</h2>
          <p className="text-sm text-slate-300">Микрофон рұқсатын беріңіз. Дауыс тану браузер мүмкіндігіне тәуелді.</p>
          <button onClick={listen} className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950">🎤 Айту</button>
          {spoken && <p>Танылған сөз: {spoken}</p>}
        </>}
        {feedback && <p role="status" className="rounded-xl bg-slate-800 p-3 text-amber-200">{feedback}</p>}
        {claimed[game] && <p className="text-xs text-emerald-300">Бүгінгі сыйлық алынды ✓</p>}
      </section>
    </div>
  </AppLayout>;
}
