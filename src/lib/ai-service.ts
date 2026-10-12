export interface AIHintResponse {
  step: number;
  type: 'hint1' | 'hint2' | 'example' | 'step_by_step' | 'explanation';
  message: string;
  qyranMood: 'thinking' | 'explaining' | 'happy' | 'flying';
}

export interface AIAdventureNode {
  id: string;
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
  generateAdventureStep(theme: string, stepIndex: number): Promise<AIAdventureNode>;
  checkHomeworkOCR(imageName: string): Promise<{
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

class MockAIService implements AIService {
  async explainTopic(topic: string, grade: number): Promise<string> {
    return `Сәлем, жас ғалым! ${grade}-сынып бағдарламасы бойынша «${topic}» тақырыбын түсіндірейін.\n\n` +
      `Бұл тақырыптың негізгі кілті — қадам-қадаммен түсіну. Егер бөлшектеп қарасақ, ең маңызды ереже мынадай: ` +
      `әр амал өз орнымен орындалуы керек. Мысалы, өмірде үйге кірмес бұрын есік ашатынымыз сияқты! ` +
      `Қане, мысал ретінде бір тапсырма шығарып көрейік пе? Мен әрқашан жаныңдамын!`;
  }

  async generateHint(questionText: string, currentStep: number): Promise<AIHintResponse> {
    const sequence: AIHintResponse[] = [
      {
        step: 1,
        type: 'hint1',
        message: '💡 1-кеңес: Есептің сұрағына мұқият қара. Бізге не берілген және нені табу керек? Басты сандарды анықтап ал.',
        qyranMood: 'thinking',
      },
      {
        step: 2,
        type: 'hint2',
        message: '🔎 2-кеңес: Бұл жерде қандай амал (қосу, азайту немесе көбейту) көмектеседі деп ойлайсың? Ережені еске түсір.',
        qyranMood: 'explaining',
      },
      {
        step: 3,
        type: 'example',
        message: '🌟 Ұқсас мысал: Егер бізде 20 + 10 болса, алдымен ондықтарды қосамыз. Біздің есепте де дәл осы тәсіл жұмыс істейді!',
        qyranMood: 'happy',
      },
      {
        step: 4,
        type: 'step_by_step',
        message: '🪜 Қадамдық шешу: 1-қадам: Сандарды бөлшекте. 2-қадам: Оларды бөлек-бөлек қос. 3-қадам: Нәтижелерді біріктір.',
        qyranMood: 'explaining',
      },
      {
        step: 5,
        type: 'explanation',
        message: '🎯 Түсініктеме: Жауабы шықты! Бұл жерде ондықтар мен бірліктерді дұрыс біріктіру ең бастысы болды. Жарайсың!',
        qyranMood: 'flying',
      },
    ];

    const idx = Math.min(Math.max(currentStep - 1, 0), sequence.length - 1);
    return sequence[idx];
  }

  async generateAdventureStep(theme: string, stepIndex: number): Promise<AIAdventureNode> {
    const stories: Record<string, AIAdventureNode[]> = {
      'golden-city': [
        {
          id: 'step-1',
          title: 'Алтын Қаланың Қақпасы',
          storyText: 'Сен және Қыран Ұлы Даланың құмды шатқалынан көне Алтын Қаланың қақпасын таптыңдар. Қақпада құлып салынған және үстінде жұмбақ сан жазылған: «Қақпаны ашу үшін 12 × 5 санын шеш!»',
          question: '12 × 5 нешеге тең?',
          choices: [
            { id: 'c1', text: '50', isCorrect: false, feedback: 'Сәл көбірек есепте, 10 × 5 = 50, ал тағы 2 × 5 бар!', nextStepId: 'step-1' },
            { id: 'c2', text: '60', isCorrect: true, feedback: 'Керемет! 12 × 5 = 60. Алтын қақпа салтанатпен ашылды!', nextStepId: 'step-2' },
            { id: 'c3', text: '72', isCorrect: false, feedback: 'Көп болып кетті, қайта есептеп көр.', nextStepId: 'step-1' },
          ],
          rewardXp: 30,
          rewardCoins: 10,
        },
        {
          id: 'step-2',
          title: 'Сиқырлы Бұлақ',
          storyText: 'Қала ішінде мөлдір бұлақ ағып жатыр. Бұлақ басындағы су перісі: «Сөздерді дұрыс таңдасаң, саған мәңгілік білім шырағын беремін» дейді.',
          question: '«Бұлақ» сөзіне қай көптік жалғау дұрыс жалғанады?',
          choices: [
            { id: 'c1', text: 'Бұлақтар', isCorrect: true, feedback: 'Дұрыс! Қатаң «қ» дыбысынан соң «-тар» жалғанады.', nextStepId: 'step-3' },
            { id: 'c2', text: 'Бұлақдар', isCorrect: false, feedback: 'Қатаң дыбыстан соң «д» келмейді.', nextStepId: 'step-2' },
            { id: 'c3', text: 'Бұлақлер', isCorrect: false, feedback: 'Бұлақ жуан сөз, сондықтан жіңішке «-лер» келмейді.', nextStepId: 'step-2' },
          ],
          rewardXp: 40,
          rewardCoins: 15,
        },
        {
          id: 'step-3',
          title: 'Алтын Тақ пен Жеңіс',
          storyText: 'Сен Алтын Қаланың орталық мұнарасына жеттің. Мұнда Ұлы Даланың алтын кітабы сақтаулы екен. Миссия аяқталды!',
          question: 'Қазақстанның мемлекеттік туында неше сәулелі күн бейнеленген?',
          choices: [
            { id: 'c1', text: '32 сәулелі', isCorrect: true, feedback: 'Абсолютті дұрыс! 32 күн сәулесі мен қалықтаған қыран!', nextStepId: 'victory' },
            { id: 'c2', text: '24 сәулелі', isCorrect: false, feedback: 'Көбірек, туды мұқият еске түсір.', nextStepId: 'step-3' },
            { id: 'c3', text: '16 сәулелі', isCorrect: false, feedback: 'Қайта ойланып көр.', nextStepId: 'step-3' },
          ],
          rewardXp: 100,
          rewardCoins: 50,
        },
      ],
    };

    const list = stories[theme] || stories['golden-city'];
    const idx = Math.min(stepIndex, list.length - 1);
    return list[idx];
  }

  async checkHomeworkOCR(imageName: string): Promise<{
    recognizedText: string;
    analysis: string;
    corrections: string[];
    score: number;
  }> {
    return {
      recognizedText: `Оқушы дәптері: 3-сынып. Есеп: 45 + 38 = 83. 7 × 6 = 42. 64 ÷ 8 = 7 (қате).`,
      analysis: 'Оқушы қосу және көбейту амалдарын өте жақсы меңгерген. Алайда 64-ті 8-ге бөлу кезінде арифметикалық қателік жіберілген.',
      corrections: [
        '45 + 38 = 83 (Дұрыс ✓)',
        '7 × 6 = 42 (Дұрыс ✓)',
        '64 ÷ 8 = 7 ➔ Дұрысы: 8 × 8 = 64, сондықтан 64 ÷ 8 = 8 болуы керек.',
      ],
      score: 85,
    };
  }

  async generateTeacherMission(params: {
    grade: number;
    subject: string;
    topic: string;
    difficulty: string;
    questionCount: number;
  }) {
    return {
      title: `${params.topic} бойынша интерактивті миссия`,
      description: `${params.grade}-сыныпқа арналған ${params.subject} пәнінің сараланған тапсырмалар топтамасы.`,
      questions: [
        {
          question: `${params.topic} тақырыбының 1-сұрағы: Негізгі ұғымды анықтаңыз.`,
          options: ['Дұрыс нұсқа A', 'Қате нұсқа B', 'Қате нұсқа C', 'Қате нұсқа D'],
          correctAnswer: 'Дұрыс нұсқа A',
          hint: 'Ереженің бірінші тармағына көңіл бөліңіз.',
          explanation: 'Бұл дұрыс шешім себебі ереже толық сақталған.',
        },
        {
          question: `${params.topic} тақырыбының 2-сұрағы: Төмендегі амалды есептеңіз.`,
          options: ['24', '36', '48', '12'],
          correctAnswer: '24',
          hint: 'Көбейту немесе қосу кестесін пайдаланыңыз.',
          explanation: 'Дұрыс жауап 24 болады.',
        },
        {
          question: `${params.topic} бойынша логикалық сұрақ.`,
          options: ['Ақиқат', 'Жалған'],
          correctAnswer: 'Ақиқат',
          hint: 'Тақырып мазмұнын еске түсіріңіз.',
          explanation: 'Тұжырым толықтай ақиқат.',
        },
      ],
    };
  }
}

export const aiService: AIService = new MockAIService();
