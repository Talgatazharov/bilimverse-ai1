import '../config/game_rules.dart';
import '../models/question.dart';
import '../repositories/content_repository.dart';
import 'demo_math_repository.dart';

/// Reviewed local starter content. No network or generated answers are involved.
class LocalCurriculumRepository implements ContentRepository {
  const LocalCurriculumRepository({this.rules = const GameRules()});
  final GameRules rules;

  static const names = <Subject, String>{
    Subject.math: 'Сандар патшалығы',
    Subject.kazakh: 'Сөздер орманы',
    Subject.literature: 'Ертегілер елі',
    Subject.worldKnowledge: 'Зерттеушілер аралы',
    Subject.science: 'Ғылым зертханасы',
    Subject.english: 'English Town',
    Subject.digital: 'Digital City',
    Subject.creativity: 'Шығармашылық шеберхана',
    Subject.adventure: 'Оқиғалы саяхат',
  };

  static const _items = <Subject, List<(String, List<String>, String, String)>>{
    Subject.kazakh: [
      (
        '«Бала кітап оқыды» сөйлемінің бастауышын тап.',
        ['Бала', 'кітап', 'оқыды'],
        'Бала',
        'Кім оқыды?',
      ),
      (
        'Сөйлемді дұрыс ретпен құрастыр.',
        ['Мен кітап оқимын', 'Кітап мен оқимын', 'Оқимын кітап мен'],
        'Мен кітап оқимын',
        'Алдымен кім туралы айтылғанын тап.',
      ),
      (
        '«Алма» сөзінде неше буын бар?',
        ['1', '2', '3'],
        '2',
        'Сөзді дауыстап бөліп айт: ал-ма.',
      ),
      (
        'Қай сөз заттың атын білдіреді?',
        ['дәптер', 'жүгірді', 'әдемі'],
        'дәптер',
        'Не? деген сұраққа жауап беретін сөзді таңда.',
      ),
      (
        'Сұраулы сөйлемді тап.',
        ['Сен келдің бе?', 'Мен келдім.', 'Күн жылы!'],
        'Сен келдің бе?',
        'Сұрақ белгісіне қара.',
      ),
    ],
    Subject.literature: [
      (
        'Ертегіде оқиғаға қатысатын адам не жануар қалай аталады?',
        ['кейіпкер', 'тақырып', 'әріп'],
        'кейіпкер',
        'Оқиғаны кім бастан кешіреді?',
      ),
      (
        '«Түлкі қоянға көмектесті». Кім көмектесті?',
        ['түлкі', 'қоян', 'аю'],
        'түлкі',
        'Іс-әрекетті жасағанды тап.',
      ),
      (
        'Оқиға басында не таныстырылады?',
        ['кейіпкерлер мен мекен', 'тек соңғы шешім', 'тек атауы'],
        'кейіпкерлер мен мекен',
        'Оқиға қайда және кіммен басталатынын ойла.',
      ),
      (
        '«Батыр» сөзі кейіпкердің қандай қасиетін білдіреді?',
        ['ержүректік', 'жалқаулық', 'қорқақтық'],
        'ержүректік',
        'Батыр қиындыққа қалай қарайды?',
      ),
      (
        'Мәтіннің негізгі ойын қалай табамыз?',
        [
          'Не туралы айтылғанын анықтаймыз',
          'Әріпті санаймыз',
          'Соңғы сөзді ғана оқимыз',
        ],
        'Не туралы айтылғанын анықтаймыз',
        'Автор не айтқысы келгенін ойла.',
      ),
    ],
    Subject.worldKnowledge: [
      (
        'Күн қай жақтан шығады?',
        ['шығыстан', 'батыстан', 'солтүстіктен'],
        'шығыстан',
        'Таңертең күнді қайдан көреміз?',
      ),
      (
        'Картадағы көк түс көбіне нені көрсетеді?',
        ['суды', 'тауды', 'жолды'],
        'суды',
        'Көл мен өзеннің түсін ойла.',
      ),
      (
        'Қоғамда адамдар не үшін бірлесіп еңбек етеді?',
        ['ортақ қажеттілік үшін', 'еш себепсіз', 'ойынды тоқтату үшін'],
        'ортақ қажеттілік үшін',
        'Бірге жасаған жұмыстың пайдасын ойла.',
      ),
      (
        'Жыл мезгілдерінің дұрыс реті қайсы?',
        [
          'көктем, жаз, күз, қыс',
          'жаз, қыс, көктем, күз',
          'қыс, жаз, күз, көктем',
        ],
        'көктем, жаз, күз, қыс',
        'Көктемнен кейін не келеді?',
      ),
      (
        'Бағдаршамның қызыл түсі нені білдіреді?',
        ['тоқта', 'жүр', 'жылдамда'],
        'тоқта',
        'Жол қауіпсіздігін есіңе түсір.',
      ),
    ],
    Subject.science: [
      (
        'Өсімдіктің өсуіне не қажет?',
        ['су, жарық және ауа', 'тек тас', 'тек қараңғылық'],
        'су, жарық және ауа',
        'Өсімдікті қалай күтеміз?',
      ),
      (
        'Су қыздырғанда қандай күйге өте алады?',
        ['буға', 'тасқа', 'темірге'],
        'буға',
        'Шәйнектен не шығады?',
      ),
      (
        'Мұз дегеніміз не?',
        ['қатты күйдегі су', 'ыстық ауа', 'құм'],
        'қатты күйдегі су',
        'Су қатқанда не болады?',
      ),
      (
        'Көлеңке қашан пайда болады?',
        ['жарық жолын зат бөгегенде', 'тек жаңбырда', 'дыбыс шыққанда'],
        'жарық жолын зат бөгегенде',
        'Шамның алдына қолыңды қойып көр.',
      ),
      (
        'Тәжірибеде нәтижені қалай тексереміз?',
        ['бақылап, салыстырамыз', 'болжап қана қоямыз', 'көзді жұмамыз'],
        'бақылап, салыстырамыз',
        'Не өзгергенін байқа.',
      ),
    ],
    Subject.english: [
      (
        '«Moon» сөзінің қазақша мағынасы?',
        ['Ай', 'Күн', 'Жұлдыз'],
        'Ай',
        'Түнде аспанда көресің.',
      ),
      (
        '«Star» сөзінің қазақша мағынасы?',
        ['Жұлдыз', 'Су', 'Ағаш'],
        'Жұлдыз',
        'Түнгі аспанда жарқырайды.',
      ),
      (
        '«Book» сөзін тап.',
        ['Кітап', 'Қалам', 'Үстел'],
        'Кітап',
        'Оқуға қолданамыз.',
      ),
      (
        '«Hello» сөзі қашан айтылады?',
        ['амандасқанда', 'ұйықтағанда', 'сан санағанда'],
        'амандасқанда',
        'Біреумен кездескен сәтті ойла.',
      ),
      (
        '«One, two, ...» қатарын жалғастыр.',
        ['three', 'five', 'ten'],
        'three',
        '1, 2, 3 деп сана.',
      ),
    ],
    Subject.digital: [
      (
        'Роботты бір қадам оңға жылжытатын команда?',
        ['→', '←', '↑'],
        '→',
        'Жебенің бағытына қара.',
      ),
      (
        'Құпия сөзді кімге айтуға болады?',
        ['ата-анаға не сенімді ересекке', 'барлық адамға', 'бейтанысқа'],
        'ата-анаға не сенімді ересекке',
        'Жеке ақпаратыңды қорға.',
      ),
      (
        'Алгоритм дегеніміз не?',
        ['әрекеттер реті', 'тек сурет', 'кездейсоқ әріптер'],
        'әрекеттер реті',
        'Қадамдар бірінен кейін бірі орындалады.',
      ),
      (
        'Робот жоғары, сосын оңға жүрсін. Қай қатар дұрыс?',
        ['↑ →', '→ ↑', '↓ ←'],
        '↑ →',
        'Бірінші жебе жоғары қарасын.',
      ),
      (
        'Бейтаныс сілтеме келсе не істеу керек?',
        ['ересекке айту', 'бірден ашу', 'құпия сөзді енгізу'],
        'ересекке айту',
        'Қауіпсіздік үшін ересектен сұра.',
      ),
    ],
    Subject.creativity: [
      (
        'Көк пен сары түсті араластырғанда қандай түс шығады?',
        ['жасыл', 'қызыл', 'қара'],
        'жасыл',
        'Шөптің түсін ойла.',
      ),
      (
        'Қағазды бүктеп пішін жасау өнері қалай аталады?',
        ['оригами', 'мозаика', 'ән'],
        'оригами',
        'Қағазды бүктеу әдісін есіңе түсір.',
      ),
      (
        'Суреттегі ең жақын нәрсе көбіне қайда орналасады?',
        ['алдыңғы жоспарда', 'аспанда', 'кадр сыртында'],
        'алдыңғы жоспарда',
        'Алдыңғы және артқы жоспарды ажырат.',
      ),
      (
        'Қай құрал қағазды қиюға арналған?',
        ['қайшы', 'сызғыш', 'өшіргіш'],
        'қайшы',
        'Қауіпсіздік ережесін сақта.',
      ),
      (
        'Өрнектің қайталанатын бөлігі қалай аталады?',
        ['элемент', 'дыбыс', 'сөйлем'],
        'элемент',
        'Бірдей пішіндердің қайталануын байқа.',
      ),
    ],
  };

  @override
  Future<List<Mission>> missionsFor(Subject subject, int grade) async {
    if (grade < 1 || grade > 4) return const [];
    if (subject == Subject.adventure) {
      return [
        Mission(
          id: 'adventure-$grade-starter',
          title: 'Жоғалған ғарыш кемесі',
          subject: Subject.adventure,
          questionIds: [for (var i = 1; i <= 5; i++) 'adventure-$grade-$i'],
          unlocks: ['adventure'],
        ),
      ];
    }
    if (subject == Subject.math && grade == 3) {
      return DemoMathRepository(rules: rules).missionsFor(subject, grade);
    }
    final prefix = '${subject.name}-$grade';
    return [
      Mission(
        id: '$prefix-starter',
        title: '${names[subject]} · $grade-сынып',
        subject: subject,
        questionIds: [for (var i = 1; i <= 5; i++) '$prefix-$i'],
        unlocks: [subject.name],
      ),
    ];
  }

  @override
  Future<List<Question>> questionsFor(String missionId) async {
    final adventureMatch = RegExp(r'^adventure-([1-4])-starter$')
        .firstMatch(missionId);
    if (adventureMatch != null) {
      final grade = int.parse(adventureMatch[1]!);
      final math = _mathQuestions(grade).first;
      final otherSubjects = [
        Subject.kazakh,
        Subject.science,
        Subject.english,
        Subject.digital,
      ];
      final tasks = <Question>[
        math,
        for (final subject in otherSubjects)
          (await questionsFor('${subject.name}-$grade-starter')).first,
      ];
      return [
        for (var i = 0; i < tasks.length; i++)
          Question(
            id: 'adventure-$grade-${i + 1}',
            subject: Subject.adventure,
            topic: tasks[i].topic,
            grade: grade,
            type: tasks[i].type,
            question: tasks[i].question,
            options: tasks[i].options,
            correctAnswer: tasks[i].correctAnswer,
            hint: tasks[i].hint,
            explanation: tasks[i].explanation,
            difficulty: tasks[i].difficulty,
            xp: tasks[i].xp,
          ),
      ];
    }
    if (missionId == 'golden-bridge' || missionId == 'number-tower') {
      return DemoMathRepository(rules: rules).questionsFor(missionId);
    }
    final match = RegExp(r'^(\w+)-([1-4])-starter$').firstMatch(missionId);
    if (match == null) throw ArgumentError.value(missionId, 'missionId');
    final subject = Subject.values.where((s) => s.name == match[1]).firstOrNull;
    if (subject == null) throw ArgumentError.value(missionId, 'missionId');
    final grade = int.parse(match[2]!);
    if (subject == Subject.math) return _mathQuestions(grade);
    final items = _items[subject];
    if (items == null) throw ArgumentError.value(missionId, 'missionId');
    return [
      for (var i = 0; i < items.length; i++)
        Question(
          id: '${subject.name}-$grade-${i + 1}',
          subject: subject,
          topic: names[subject]!,
          grade: grade,
          type: i == 1 && subject == Subject.kazakh
              ? QuestionType.sentenceBuilder
              : i == 3 && subject == Subject.digital
              ? QuestionType.maze
              : QuestionType.multipleChoice,
          question: items[i].$1,
          options: items[i].$2,
          correctAnswer: items[i].$3,
          hint: items[i].$4,
          explanation: 'Дұрыс жауап: ${items[i].$3}.',
          difficulty: Difficulty.normal,
          xp: rules.rewards[RewardAction.simple]!,
        ),
    ];
  }

  List<Question> _mathQuestions(int grade) {
    final a = grade * 7;
    final examples = grade == 1
        ? <(String, int, String)>[
            ('3 + 2 = ?', 5, 'Үштен бастап екі қадам сана.'),
            ('9 − 4 = ?', 5, 'Тоғыздан төртті азайт.'),
            ('6 + 3 = ?', 9, 'Алтыға үшті қос.'),
            ('10 − 2 = ?', 8, 'Оннан екі қадам кері сана.'),
            ('4 + 4 = ?', 8, 'Төртті екі рет сана.'),
          ]
        : <(String, int, String)>[
            ('$a + 5 = ?', a + 5, 'Алдымен $a-ге 5-ті қос.'),
            ('${a + 8} − 3 = ?', a + 5, 'Үшті азайт.'),
            ('$grade × 4 = ?', grade * 4, 'Төрт бірдей топты сана.'),
            ('${grade * 6} ÷ $grade = ?', 6, 'Бөлуді көбейту арқылы тексер.'),
            ('${a + 10} − 10 = ?', a, 'Ондықты кері азайт.'),
          ];
    return [
      for (var i = 0; i < examples.length; i++)
        Question(
          id: 'math-$grade-${i + 1}',
          subject: Subject.math,
          topic: 'Сандар және амалдар',
          grade: grade,
          type: QuestionType.multipleChoice,
          question: examples[i].$1,
          options: [
            '${examples[i].$2 - 1}',
            '${examples[i].$2}',
            '${examples[i].$2 + 2}',
          ],
          correctAnswer: '${examples[i].$2}',
          hint: examples[i].$3,
          explanation: examples[i].$1.replaceFirst('?', '${examples[i].$2}'),
          difficulty: Difficulty.normal,
          xp: rules.rewards[RewardAction.simple]!,
        ),
    ];
  }
}
