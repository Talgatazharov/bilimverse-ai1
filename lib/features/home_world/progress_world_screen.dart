import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../config/game_rules.dart';
import '../../widgets/qyran.dart';

class ProgressWorldScreen extends ConsumerWidget {
  const ProgressWorldScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final student = ref.watch(studentProvider).asData?.value;
    if (student == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    final level = ref.read(gameRulesProvider).levelFor(student.xp);
    final pet = ref.read(gameRulesProvider).petFor(student.xp);
    final completed = student.completedMissions.length;
    final topics = student.topicAttempts.keys.toList()
      ..sort((a, b) {
        final aScore =
            (student.topicCorrect[a] ?? 0) / student.topicAttempts[a]!;
        final bScore =
            (student.topicCorrect[b] ?? 0) / student.topicAttempts[b]!;
        return aScore.compareTo(bScore);
      });
    final places = <(String, IconData, int)>[
      ('Киіз үй', Icons.home_rounded, 0),
      ('Ағаш', Icons.park_rounded, 0),
      ('Қамал', Icons.castle_rounded, 1),
      ('Орман', Icons.forest_rounded, 2),
      ('Обсерватория', Icons.travel_explore_rounded, 3),
      ('Ойын алаңы', Icons.toys_rounded, 4),
      ('Ғарыш станциясы', Icons.rocket_launch_rounded, 5),
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('Менің әлемім')),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 850),
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              Text(
                '${student.name} · $level-деңгей',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 12),
              Text(
                '$completed миссия · ${student.xp} XP · ${student.currency} Тұмар · ${student.streak} күндік қатар',
              ),
              const SizedBox(height: 24),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      if (student.petKind == 'qyran' && pet != PetStage.egg)
                        const Qyran(size: 105)
                      else
                        Text(
                          pet == PetStage.egg
                              ? '🥚'
                              : switch (student.petKind) {
                                  'fox' => '🦊',
                                  'dragon' => '🐉',
                                  'robot' => '🤖',
                                  _ => '🦅',
                                },
                          style: const TextStyle(fontSize: 84),
                        ),
                      Text(
                        'Менің серігім: ${_petName(pet)}',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      Text(
                        pet == PetStage.legendary
                            ? 'Қыран ең жоғары даму сатысына жетті!'
                            : 'Миссия орындаған сайын серігің дамиды.',
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Ашылған мекендер',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  for (final place in places)
                    Chip(
                      avatar: Icon(place.$2),
                      label: Text(
                        completed >= place.$3
                            ? place.$1
                            : '${place.$1} · ${place.$3} миссиядан кейін',
                      ),
                      backgroundColor: completed >= place.$3
                          ? Theme.of(context).colorScheme.primaryContainer
                          : Theme.of(context).colorScheme.surfaceContainer,
                    ),
                ],
              ),
              const SizedBox(height: 20),
              Text(
                'Оқу профилі',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              if (topics.isEmpty)
                const Text(
                  'Тақырып бойынша нәтиже миссия аяқталған соң көрінеді.',
                ),
              if (topics.isNotEmpty)
                Text('Келесіде «${topics.first}» тақырыбын қайталап көр.'),
              for (final topic in topics)
                ListTile(
                  title: Text(topic),
                  subtitle: LinearProgressIndicator(
                    value:
                        (student.topicCorrect[topic] ?? 0) /
                        student.topicAttempts[topic]!,
                  ),
                  trailing: Text(
                    '${((student.topicCorrect[topic] ?? 0) * 100 / student.topicAttempts[topic]!).round()}%',
                  ),
                ),
              const SizedBox(height: 20),
              Text(
                'Жетістіктер',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              if (student.achievements.isEmpty)
                const Text('Алғашқы жетістік үшін миссияны аяқта.'),
              for (final achievement in student.achievements)
                ListTile(
                  leading: const Icon(Icons.emoji_events_rounded),
                  title: Text(switch (achievement) {
                    'first-mission' => 'Алғашқы миссия',
                    'perfect-mission' => 'Мінсіз нәтиже',
                    'five-day-streak' => '5 күн қатарынан оқу',
                    _ => achievement,
                  }),
                ),
              const SizedBox(height: 20),
              FilledButton.icon(
                onPressed: () => context.push('/adventure'),
                icon: const Icon(Icons.auto_stories_rounded),
                label: const Text('Оқиғалы саяхатқа шығу'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _petName(PetStage stage) => switch (stage) {
    PetStage.egg => 'Жұмыртқа',
    PetStage.baby => 'Балапан',
    PetStage.explorer => 'Жас қыран',
    PetStage.guardian => 'Қыран',
    PetStage.legendary => 'Аңыз қыраны',
  };
}
