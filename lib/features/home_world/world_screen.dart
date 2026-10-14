import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../models/student_progress.dart';
import '../../theme/game_colors.dart';
import '../../widgets/game_button.dart';
import '../../widgets/game_status.dart';
import '../../widgets/qyran.dart';
import '../../widgets/xp_progress.dart';
import 'region_landmark.dart';
import 'world_header.dart';
import 'world_scene.dart';

class WorldScreen extends ConsumerWidget {
  const WorldScreen({super.key});
  static const regions = [
    ('Менің ауылым', 'Саяхатың басталатын мекен', 'home'),
    ('Сандар патшалығы', 'Математика · Алтын көпір', 'math'),
    ('Сөздер орманы', 'Қазақ тілі', 'kazakh'),
    ('Ертегілер елі', 'Әдебиеттік оқу', 'literature'),
    ('Зерттеушілер аралы', 'Дүниетану', 'worldKnowledge'),
    ('Ғылым зертханасы', 'Жаратылыстану', 'science'),
    ('English Town', 'Ағылшын тілі', 'english'),
    ('Digital City', 'Цифрлық сауаттылық', 'digital'),
    ('Шығармашылық шеберхана', 'Көркем еңбек', 'creativity'),
  ];
  @override
  Widget build(BuildContext context, WidgetRef ref) => Scaffold(
    body: SafeArea(
      child: ref
          .watch(studentProvider)
          .when(
            loading: () => const GameStatus(),
            error: (_, _) => GameStatus(
              message: 'Қыран әлемге жол іздеп жатыр. Қайта көрейік!',
              onRetry: () => ref.invalidate(studentProvider),
            ),
            data: (student) => LayoutBuilder(
              builder: (context, constraints) {
                final wide = constraints.maxWidth >= 1050;
                return SingleChildScrollView(
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1440),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          WorldHeader(student: student),
                          Padding(
                            padding: const EdgeInsets.fromLTRB(24, 24, 24, 28),
                            child: Wrap(
                              alignment: WrapAlignment.spaceBetween,
                              spacing: 40,
                              runSpacing: 16,
                              crossAxisAlignment: WrapCrossAlignment.center,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'ҰЛЫ ДАЛА · ШЕКСІЗ МҮМКІНДІК',
                                      style: TextStyle(
                                        color: GameColors.turquoise,
                                        letterSpacing: 1.2,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Бүгін қайда саяхаттаймыз?',
                                      style: Theme.of(context)
                                          .textTheme
                                          .headlineMedium,
                                    ),
                                  ],
                                ),
                                Text(
                                  '${student.grade}-сынып  /  DEMO ӘЛЕМ',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (!wide)
                            Padding(
                              padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                              child: Column(
                                children: [
                                  GameButton(
                                    label: 'Сандар патшалығына бар',
                                    onPressed: () =>
                                        context.push('/subject/math'),
                                  ),
                                  const SizedBox(height: 10),
                                  GameButton(
                                    label: 'Менің әлемім',
                                    secondary: true,
                                    onPressed: () => context.push('/my-world'),
                                  ),
                                  const SizedBox(height: 10),
                                  GameButton(
                                    label: 'Оқиғалы саяхат',
                                    secondary: true,
                                    onPressed: () => context.push('/adventure'),
                                  ),
                                  const SizedBox(height: 10),
                                  GameButton(
                                    label: 'Үй тапсырмасы',
                                    secondary: true,
                                    onPressed: () => context.push('/homework'),
                                  ),
                                  const SizedBox(height: 10),
                                  GameButton(
                                    label: 'Мұғалім',
                                    secondary: true,
                                    onPressed: () => context.push('/teacher'),
                                  ),
                                ],
                              ),
                            ),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(
                                    wide ? 32 : 0,
                                  ),
                                  child: WorldScene(
                                    hasBridge: student.worldUnlocks.contains(
                                      'math-bridge',
                                    ),
                                    child: Padding(
                                      padding: const EdgeInsets.fromLTRB(
                                        20,
                                        145,
                                        20,
                                        40,
                                      ),
                                      child: Column(
                                        children: [
                                          if (student.worldUnlocks.contains(
                                            'math-bridge',
                                          ))
                                            Container(
                                              margin: const EdgeInsets.only(
                                                bottom: 24,
                                              ),
                                              padding: const EdgeInsets.all(16),
                                              decoration: BoxDecoration(
                                                color: GameColors.gold,
                                                borderRadius:
                                                    BorderRadius.circular(12),
                                              ),
                                              child: const Column(
                                                children: [
                                                  Icon(
                                                    Icons.route_rounded,
                                                    size: 40,
                                                  ),
                                                  Text(
                                                    'Алтын көпір салынды!',
                                                    style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                  ),
                                                  Text(
                                                    'Алғашқы миссияң әлемді өзгертті.',
                                                    textAlign: TextAlign.center,
                                                  ),
                                                ],
                                              ),
                                            ),
                                          for (
                                            var i = 0;
                                            i < regions.length;
                                            i++
                                          )
                                            Align(
                                              alignment: wide
                                                  ? (i.isEven
                                                        ? const Alignment(
                                                            -.55,
                                                            0,
                                                          )
                                                        : const Alignment(
                                                            .55,
                                                            0,
                                                          ))
                                                  : Alignment.center,
                                              child: Padding(
                                                padding: const EdgeInsets.only(
                                                  bottom: 28,
                                                ),
                                                child: _RegionStop(
                                                  index: i,
                                                  title: regions[i].$1,
                                                  subtitle: regions[i].$2,
                                                  locked: !student.worldUnlocks
                                                      .contains(regions[i].$3),
                                                  onTap: () => _visit(
                                                    context,
                                                    student,
                                                    i,
                                                  ),
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              if (wide)
                                SizedBox(
                                  width: 330,
                                  child: Padding(
                                    padding: const EdgeInsets.all(28),
                                    child: _TravelJournal(student: student),
                                  ),
                                ),
                            ],
                          ),
                          if (!wide)
                            Padding(
                              padding: const EdgeInsets.all(24),
                              child: _TravelJournal(student: student),
                            ),
                          const Padding(
                            padding: EdgeInsets.all(24),
                            child: Text(
                              'BILIMVERSE AI · Білімнен басталған үлкен саяхат.',
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
    ),
  );

  void _visit(BuildContext context, StudentProgress student, int index) {
    if (index == 1) {
      context.push('/subject/math');
      return;
    }
    if (index > 1) {
      const subjects = {
        2: 'kazakh',
        3: 'literature',
        4: 'worldKnowledge',
        5: 'science',
        6: 'english',
        7: 'digital',
        8: 'creativity',
      };
      context.push('/subject/${subjects[index]}');
      return;
    }
    showDialog<void>(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: GameColors.cream,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 430),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(28),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                RegionLandmark(kind: index % 7, size: 180),
                Text(
                  regions[index].$1,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 16),
                Text(
                  index == 0
                      ? 'Киіз үйің мен алғашқы ағашың осында. Миссиялар орындаған сайын ауылың кеңейеді.'
                      : 'Бұл аймақтың миссиялары келесі кезеңде қосылады. Алғашқы саяхатты Сандар патшалығынан бастайық!',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                GameButton(
                  label: 'Түсінікті',
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RegionStop extends StatelessWidget {
  const _RegionStop({
    required this.index,
    required this.title,
    required this.subtitle,
    required this.locked,
    required this.onTap,
  });
  final int index;
  final String title;
  final String subtitle;
  final bool locked;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => SizedBox(
    width: 290,
    child: Semantics(
      button: true,
      label: '$title. ${locked ? 'Әзірленуде' : 'Ашық'}',
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(30),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              children: [
                RegionLandmark(
                  kind: index % 7,
                  locked: locked,
                  size: index == 1 ? 180 : 150,
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: locked
                        ? GameColors.cream.withValues(alpha: .85)
                        : GameColors.cream,
                    borderRadius: BorderRadius.circular(12),
                    border: Border(
                      bottom: BorderSide(
                        color: index == 1 ? GameColors.gold : GameColors.sand,
                        width: 4,
                      ),
                    ),
                  ),
                  child: Column(
                    children: [
                      Text(
                        title,
                        textAlign: TextAlign.center,
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 4),
                      Text(subtitle, textAlign: TextAlign.center),
                      if (locked)
                        const Icon(
                          Icons.lock_outline_rounded,
                          size: 17,
                          color: GameColors.turquoise,
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

class _TravelJournal extends ConsumerWidget {
  const _TravelJournal({required this.student});
  final StudentProgress student;
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rules = ref.watch(gameRulesProvider);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Qyran(size: 130),
        Text(
          'Сәлем, ${student.name}!',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        const Text('Алтын көпірдің ар жағында құпия бар. Бірге зерттейік пе?'),
        const SizedBox(height: 20),
        GameButton(
          label: 'Миссияға бару',
          onPressed: () => context.push('/subject/math'),
        ),
        const SizedBox(height: 32),
        const Divider(color: GameColors.sand),
        const SizedBox(height: 24),
        Text(
          '${rules.levelFor(student.xp)}-деңгей · ${rules.titleFor(student.xp)}',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 16),
        XpProgress(
          value: rules.levelProgress(student.xp),
          label: '${student.xp} XP',
        ),
        const SizedBox(height: 20),
        Text('${student.currency} Тұмар · ${student.streak} күндік саяхат'),
        const SizedBox(height: 24),
        const Text('Өз қарқыныңмен оқы. Әр кішкентай жаңалық маңызды.'),
        const SizedBox(height: 24),
        TextButton(
          onPressed: () => context.push('/onboarding'),
          child: const Text('Кейіпкерімді баптау'),
        ),
      ],
    );
  }
}
