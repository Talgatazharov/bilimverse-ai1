export interface AIHintResponse {
  step: number;
  type: 'hint1' | 'hint2' | 'example' | 'step_by_step' | 'explanation';
  message: string;
  qyranMood: 'thinking' | 'explaining' | 'happy' | 'flying';
}

export interface AIAdventureNode {
  id: string;
  kind: 'decision' | 'challenge' | 'ending';
  title: string;
  storyText: string;
  question: string;
  choices: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
    nextStepId: string;
  }[];
  rewardXp: number;
  rewardCoins: number;
}

export interface AIService {
  explainTopic(topic: string, grade: number): Promise<string>;
  generateHint(questionText: string, currentStep: number): Promise<AIHintResponse>;
  generateAdventureStep(theme: string, stepIndex: number, profile?: { grade: number; level: number; weakTopics?: string[] }, path?: string[], avoidQuestions?: string[], variationId?: string): Promise<AIAdventureNode>;
  checkHomeworkOCR(imageData: string, grade?: number): Promise<{
    recognizedText: string;
    analysis: string;
    corrections: string[];
    score: number;
  }>;
  generateTeacherMission(params: {
    grade: number;
    subject: string;
    topic: string;
    difficulty: string;
    questionCount: number;
  }): Promise<{
    title: string;
    description: string;
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      hint: string;
      explanation: string;
    }>;
  }>;
}

async function callAI<T>(action: string, values: Record<string, unknown>): Promise<T> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...values }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'AI қызметіне қосылу мүмкін болмады.');
  return body as T;
}

export const aiService: AIService = {
  explainTopic: (topic, grade) => callAI<{ message: string }>('explain', { topic, grade }).then((result) => result.message),
  generateHint: (questionText, currentStep) => callAI<AIHintResponse>('hint', { questionText, currentStep }),
  generateAdventureStep: (theme, stepIndex, profile, path, avoidQuestions, variationId) => callAI<AIAdventureNode>('adventure', { theme, stepIndex, profile, path, avoidQuestions, variationId }),
  checkHomeworkOCR: (imageData, grade) => callAI<Awaited<ReturnType<AIService['checkHomeworkOCR']>>>('homework', { imageData, grade }),
  generateTeacherMission: (params) => callAI<Awaited<ReturnType<AIService['generateTeacherMission']>>>('teacherMission', params),
};
