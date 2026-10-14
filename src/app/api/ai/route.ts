import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const requests = new Map<string, { count: number; resetAt: number }>();

function text(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function integer(value: unknown, min: number, max: number, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.floor(value))) : fallback;
}

type Input = Record<string, any>;

function makePrompt(input: Input) {
  const grade = integer(input.grade, 1, 4, 3);
  const base = 'Сен BILIMVERSE платформасындағы Қыран AI атты оқу көмекшісісің. Аудитория — 1–4 сынып оқушылары. Қазақша қысқа, мейірімді, түсінікті жауап бер. Математика, қазақ тілі, әдебиеттік оқу, жаратылыстану, дүниетану, ағылшын тілі және цифрлық сауаттылық бойынша көмектес. Дайын жауапты бірден беруге асықпа: алдымен ойлануға жетеле, қажет болса мысал мен қателіктің себебін түсіндір. Білмесең ойдан шығарма. Жеке деректерді сұрама, қауіпті не жасына сәйкес емес мазмұн ұсынба. Тек дұрыс JSON қайтар.';
  switch (input.action) {
    case 'explain':
      if (!text(input.topic)) return null;
      return { instructions: base, prompt: `${grade}-сынып оқушысының сұрағы: ${text(input.topic)}. Қысқа түсіндірме және жетелеуші сұрақ бер; дайын жауапты бірден ашпа. JSON: {"message":"..."}` };
    case 'hint': {
      if (!text(input.questionText)) return null;
      const step = integer(input.currentStep, 1, 5, 1);
      const type = ['hint1', 'hint1', 'hint2', 'example', 'step_by_step', 'explanation'][step];
      return { instructions: base, prompt: `Сұрақ: ${text(input.questionText)}. ${step}-кезеңдік кеңес бер. Алғашқы екі кезеңде жауапты ашпа; соңғысында түсіндір. JSON: {"step":${step},"type":"${type}","message":"...","qyranMood":"thinking"}. qyranMood thinking/explaining/happy/flying ішінен болсын.` };
    }
    case 'adventure': {
      const profile = input.profile && typeof input.profile === 'object' ? input.profile : {};
      const step = integer(input.stepIndex, 0, 6, 0);
      const path = Array.isArray(input.path) ? input.path.slice(-6).map((choice: unknown) => text(choice, 100)).join(' → ') : '';
      const avoid = Array.isArray(input.avoidQuestions) ? input.avoidQuestions.slice(-30).map((question: unknown) => text(question, 180)).join(' | ') : '';
      const weak = Array.isArray(profile.weakTopics) ? profile.weakTopics.slice(0, 3).map((topic: unknown) => text(topic, 80)).join(', ') : '';
      const kind = step === 6 ? 'ending' : step % 2 === 0 ? 'decision' : 'challenge';
      const themeNames: Record<string, string> = {
        'golden-city': 'Алтын қаланың құпиясы', 'lost-tulpar': 'Жоғалған тұлпар',
        'space-village': 'Ғарыштағы қазақ ауылы', 'qyran-journey': 'Қыранның саяхаты',
        'steppe-expedition': 'Ұлы дала экспедициясы',
      };
      const setting = themeNames[text(input.theme, 80)] || 'Ұлы даладағы саяхат';
      const task = kind === 'decision'
        ? 'Оқиғадағы нақты шешім нүктесін жаса. 2 не 3 әрекет ұсын. Әр әрекеттің салдары мен келесі көрінісі әртүрлі болсын. Олардың isCorrect бәрі true, бірақ XP берілмейді.'
        : kind === 'challenge'
        ? 'Оқиғаға байланысты, 3-сыныпқа лайық бір жаңа оқу сұрағын жаса. Дәл 3 жауаптың біреуі ғана дұрыс. Әр жауаптан кейін әртүрлі оқиға салдары болсын. Бұрынғы сұрақтарды да, сандарын ғана ауыстырған ұқсас сұрақтарды да қайталама.'
        : 'Таңдалған жолға сәйкес оқиғаны мағыналы аяқта. choices бос массив болсын.';
      return {
        instructions: base,
        prompt: `Оқиға: ${setting}. Оқушы ${integer(profile.grade, 1, 4, 3)}-сынып, ${integer(profile.level, 1, 99, 1)}-деңгей. Әлсіз тақырыптар: ${weak || 'жоқ'}. Бұл ойынның ${step + 1}/7 көрінісі, түрі ${kind}. Ойын нұсқасы: ${text(input.variationId, 50)}. Бұрынғы таңдау жолы: ${path || 'басталуы'}. Бұл таңдау келесі көріністің орнына, кейіпкеріне немесе мақсатына нақты әсер етсін. Қайталамау керек сұрақтар: ${avoid || 'жоқ'}. ${task} 60–100 сөздік storyText, анық question және choice мәтіндерін қазақша жаз. Тек JSON: {"id":"scene-${step + 1}","kind":"${kind}","title":"...","storyText":"...","question":"...","choices":[{"id":"a","text":"...","isCorrect":true,"feedback":"...","nextStepId":"scene-${step + 2}"}],"rewardXp":20,"rewardCoins":5}.`,
      };
    }    case 'homework': {
      const image = text(input.imageData, 5_000_000);
      if (!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image) || image.length > 5_000_000) return null;
      return { instructions: base, prompt: `${grade}-сынып дәптерін оқы. Көрінбейтін тұсты болжама, сенімсіз болса айт. Қатені түсіндір, баланы шешуге жетеле. JSON: {"recognizedText":"...","analysis":"...","corrections":["..."],"score":0}. score 0–100.`, image };
    }
    case 'teacherMission': {
      const count = integer(input.questionCount, 1, 10, 5);
      if (!text(input.topic) || !text(input.subject)) return null;
      return { instructions: base + ' Мұғалім қолданар алдында міндетті түрде тексереді.', prompt: `${grade}-сынып; ${text(input.subject, 80)}; тақырып ${text(input.topic, 120)}; деңгей ${text(input.difficulty, 40)}. Дәл ${count} әртүрлі сұрақ және әрқайсында 4 нұсқа жаса. Бір жауап дұрыс. JSON: {"title":"...","description":"...","questions":[{"question":"...","options":["...","...","...","..."],"correctAnswer":"...","hint":"...","explanation":"..."}]}` };
    }
    default: return null;
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin) {
    let sameOrigin = false;
    try {
      const originUrl = new URL(origin);
      const host = request.headers.get('host') || request.nextUrl.host;
      const protocol = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.slice(0, -1);
      sameOrigin = originUrl.host === host && originUrl.protocol === `${protocol}:`;
    } catch { /* malformed Origin is rejected */ }
    if (!sameOrigin) return NextResponse.json({ error: 'Рұқсат етілмеген сұрау.' }, { status: 403 });
  }
  const address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  const usage = requests.get(address);
  const nextUsage = !usage || usage.resetAt < now ? { count: 1, resetAt: now + 10 * 60_000 } : { count: usage.count + 1, resetAt: usage.resetAt };
  requests.set(address, nextUsage);
  if (nextUsage.count > 30) return NextResponse.json({ error: 'Сұрау саны тым көп. Кейінірек қайталап көріңіз.' }, { status: 429 });
  if (requests.size > 500) requests.forEach((value, ip) => { if (value.resetAt < now) requests.delete(ip); });
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error('AI provider is not configured: OPENAI_API_KEY is missing');
    return NextResponse.json({ error: 'AI көмекші әзірге қосылмаған.' }, { status: 503 });
  }
  try {
    const raw = await request.text();
    if (raw.length > 5_100_000) return NextResponse.json({ error: 'Сурет тым үлкен.' }, { status: 413 });
    const input = JSON.parse(raw) as Input;
    const task = makePrompt(input);
    if (!task) return NextResponse.json({ error: 'Сұрау деректері жарамсыз.' }, { status: 400 });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45_000);
    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          instructions: task.instructions,
          input: [{ role: 'user', content: 'image' in task
            ? [{ type: 'input_text', text: task.prompt }, { type: 'input_image', image_url: task.image }]
            : [{ type: 'input_text', text: task.prompt }] }],
          text: { format: { type: 'json_object' } },
          max_output_tokens: input.action === 'teacherMission' ? 3600 : 1600,
        }),
        signal: controller.signal,
      });
    } finally { clearTimeout(timer); }
    if (!response.ok) return NextResponse.json({ error: `AI қызметі қате қайтарды (${response.status}). Кілт пен модельді тексеріңіз.` }, { status: 502 });
    const data = await response.json() as { output?: { content?: { type?: string; text?: string }[] }[] };
    const output = data.output?.flatMap((item) => item.content || []).find((part) => part.type === 'output_text')?.text;
    if (!output) return NextResponse.json({ error: 'AI бос жауап қайтарды.' }, { status: 502 });
    const result = JSON.parse(output) as Input;
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('Invalid AI JSON');
    if (input.action === 'teacherMission') {
      const qs = result.questions;
      if (!Array.isArray(qs) || qs.length !== integer(input.questionCount, 1, 10, 5) || qs.some((q: Input) => !Array.isArray(q.options) || q.options.length !== 4 || !q.options.includes(q.correctAnswer))) {
        return NextResponse.json({ error: 'AI тапсырмаларды дұрыс құрастырмады. Қайта көріңіз.' }, { status: 502 });
      }
    }
    if (input.action === 'homework' && (typeof result.recognizedText !== 'string' || typeof result.analysis !== 'string' || !Array.isArray(result.corrections) || typeof result.score !== 'number')) {
      return NextResponse.json({ error: 'Сурет талдауы толық емес. Қайта көріңіз.' }, { status: 502 });
    }
    if (input.action === 'explain' && typeof result.message !== 'string') return NextResponse.json({ error: 'AI түсіндірмесі бос.' }, { status: 502 });
    if (input.action === 'hint' && typeof result.message !== 'string') return NextResponse.json({ error: 'AI кеңесі бос.' }, { status: 502 });
    if (input.action === 'adventure') {
      const step = integer(input.stepIndex, 0, 6, 0);
      const expectedKind = step === 6 ? 'ending' : step % 2 === 0 ? 'decision' : 'challenge';
      const choices = result.choices;
      if (result.kind !== expectedKind || typeof result.storyText !== 'string' || !Array.isArray(choices) ||
        (expectedKind === 'ending' && choices.length !== 0) ||
        (expectedKind === 'decision' && (choices.length < 2 || choices.length > 3)) ||
        (expectedKind === 'challenge' && (choices.length !== 3 || choices.filter((choice: Input) => choice.isCorrect === true).length !== 1)) ||
        choices.some((choice: Input) => typeof choice.text !== 'string' || typeof choice.feedback !== 'string')) {
        return NextResponse.json({ error: 'Оқиға жауабы жарамсыз. Қайта көріңіз.' }, { status: 502 });
      }
      result.rewardXp = expectedKind === 'challenge' ? 20 : 0;
      result.rewardCoins = expectedKind === 'challenge' ? 5 : 0;
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI request failed:', error);
    return NextResponse.json({ error: error instanceof Error && error.name === 'AbortError' ? 'AI жауабы кешікті.' : 'AI сұрауын өңдеу мүмкін болмады.' }, { status: 502 });
  }
}
