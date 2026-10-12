import '../config/game_rules.dart';
import '../models/question.dart';
import '../repositories/content_repository.dart';

/// Hand-authored grade 3 content for the first playable slice.
class DemoMathRepository implements ContentRepository {
  const DemoMathRepository({this.rules = const GameRules()});
  final GameRules rules;
  static const _seeds = [
    (
      '24 + 15 = ?',
      ['29', '39', '49'],
      '39',
      'Алдымен ондықтарды, содан соң бірліктерді қос.',
      '20 + 10 = 30; 4 + 5 = 9. Барлығы 39.',
    ),
    (
      '47 + 26 = ?',
      ['63', '73', '83'],
      '73',
      '7 + 6 неше? Ондықтан аттауды ұмытпа.',
      '40 + 20 = 60; 7 + 6 = 13. 60 + 13 = 73.',
    ),
    (
      '63 − 21 = ?',
      ['42', '44', '52'],
      '42',
      'Ондықтарды және бірліктерді бөлек азайт.',
      '60 − 20 = 40; 3 − 1 = 2. Жауабы 42.',
    ),
    (
      '6 × 4 = ?',
      ['10', '20', '24'],
      '24',
      '6 санын төрт рет қосып көр.',
      '6 + 6 + 6 + 6 = 24.',
    ),
    (
      '36 ÷ 4 = ?',
      ['6', '8', '9'],
      '9',
      '4-ті қай санға көбейтсең, 36 шығады?',
      '4 × 9 = 36, сондықтан 36 ÷ 4 = 9.',
    ),
    (
      '7 × 3 = ?',
      ['18', '21', '24'],
      '21',
      '7 + 7 + 7 деп есептеп көр.',
      '7 + 7 + 7 = 21.',
    ),
    (
      '56 ÷ 7 = ?',
      ['7', '8', '9'],
      '8',
      '7-нің көбейту кестесін еске түсір.',
      '7 × 8 = 56, сондықтан жауап 8.',
    ),
    (
      '85 − 37 = ?',
      ['48', '52', '58'],
      '48',
      'Алдымен 30-ды, содан кейін 7-ні азайт.',
      '85 − 30 = 55; 55 − 7 = 48.',
    ),
    (
      'Бір себетте 8 алма. 3 себетте неше алма?',
      ['11', '16', '24'],
      '24',
      'Әр себетте бірдей сан. Қай амал көмектеседі?',
      '8 × 3 = 24 алма.',
    ),
    (
      'Шаршының қабырғасы 5 см. Периметрі қанша?',
      ['10 см', '20 см', '25 см'],
      '20 см',
      'Шаршының төрт қабырғасы тең.',
      '5 + 5 + 5 + 5 = 20 см.',
    ),
  ];

  List<Question> get questions => List.unmodifiable([
    for (var i = 0; i < _seeds.length; i++)
      Question(
        id: 'math-${i + 1}',
        subject: Subject.math,
        topic: i < 3 || i == 7
            ? 'Қосу және азайту'
            : i == 9
            ? 'Периметр'
            : 'Көбейту және бөлу',
        grade: 3,
        type: QuestionType.multipleChoice,
        question: _seeds[i].$1,
        options: List.unmodifiable(_seeds[i].$2),
        correctAnswer: _seeds[i].$3,
        hint: _seeds[i].$4,
        explanation: _seeds[i].$5,
        difficulty: Difficulty.normal,
        xp: rules.rewards[RewardAction.simple]!,
      ),
  ]);

  @override
  Future<List<Mission>> missionsFor(Subject subject, int grade) async {
    if (subject != Subject.math || grade != 3) return const [];
    return const [
      Mission(
        id: 'golden-bridge',
        title: 'Алтын көпірдің құпиясы',
        subject: Subject.math,
        questionIds: ['math-1', 'math-2', 'math-3', 'math-4', 'math-5'],
        unlocks: ['math-bridge'],
      ),
      Mission(
        id: 'number-tower',
        title: 'Сандар мұнарасы',
        subject: Subject.math,
        questionIds: ['math-6', 'math-7', 'math-8', 'math-9', 'math-10'],
      ),
    ];
  }

  @override
  Future<List<Question>> questionsFor(String missionId) async {
    final missions = await missionsFor(Subject.math, 3);
    final matching = missions.where((m) => m.id == missionId);
    if (matching.isEmpty) throw ArgumentError.value(missionId, 'missionId');
    final ids = matching.single.questionIds;
    return List.unmodifiable(questions.where((q) => ids.contains(q.id)));
  }
}
