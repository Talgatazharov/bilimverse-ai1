import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../data/local_curriculum_repository.dart';
import '../../models/question.dart';
import '../../widgets/game_status.dart';

class SubjectScreen extends ConsumerWidget {
  const SubjectScreen({super.key, required this.subject});
  final Subject subject;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final student = ref.watch(studentProvider).asData?.value;
    if (student == null) return const Scaffold(body: GameStatus());
    return Scaffold(
      appBar: AppBar(title: Text(LocalCurriculumRepository.names[subject]!)),
      body: FutureBuilder<List<Mission>>(
        future: ref
            .read(contentRepositoryProvider)
            .missionsFor(subject, student.grade),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return GameStatus(
              message: 'Тапсырмалар ашылмады.',
              onRetry: () => context.go('/world'),
            );
          }
          if (!snapshot.hasData) return const GameStatus();
          return Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 800),
              child: ListView(
                padding: const EdgeInsets.all(24),
                children: [
                  Text(
                    '${student.grade}-сынып · ${LocalCurriculumRepository.names[subject]}',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Әр миссияда бес тапсырма және қорытынды сынақ бар.',
                  ),
                  const SizedBox(height: 24),
                  for (final mission in snapshot.data!)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              mission.title,
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              student.completedMissions.contains(mission.id)
                                  ? 'Аяқталды · ${student.stars[mission.id]} жұлдыз'
                                  : 'Ойналуға дайын',
                            ),
                            const SizedBox(height: 12),
                            FilledButton(
                              onPressed: () =>
                                  context.push('/mission/${mission.id}'),
                              child: const Text('Миссияны бастау'),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
