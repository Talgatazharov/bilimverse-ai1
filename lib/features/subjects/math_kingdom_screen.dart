import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../models/question.dart';
import '../../theme/game_colors.dart';
import '../../widgets/game_button.dart';
import '../../widgets/game_status.dart';
import '../home_world/region_landmark.dart';

final mathMissionsProvider = FutureProvider(
  (ref) => ref.watch(contentRepositoryProvider).missionsFor(Subject.math, 3),
);

class MathKingdomScreen extends ConsumerWidget {
  const MathKingdomScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) => Scaffold(
    body: SafeArea(
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1000),
          child: ListView(
            padding: const EdgeInsets.all(28),
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton.icon(
                  onPressed: () => context.go('/world'),
                  icon: const Icon(Icons.arrow_back_rounded),
                  label: const Text('Әлем картасы'),
                ),
              ),
              const SizedBox(height: 24),
              const Center(child: RegionLandmark(kind: 1, size: 240)),
              Text(
                'Сандар патшалығы',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 12),
              const Text(
                'Алтын көпірден өт. Сандардың сырын аш.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              const Text(
                'Алғашқы demo миссиялар: 3-сынып. Өзге сыныптардың мазмұны кейін қосылады.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              ref
                  .watch(mathMissionsProvider)
                  .when(
                    loading: () => const GameStatus(),
                    error: (_, _) => GameStatus(
                      message: 'Миссиялар ашылмады. Қайта көрейік!',
                      onRetry: () => ref.invalidate(mathMissionsProvider),
                    ),
                    data: (missions) => Column(
                      children: [
                        for (var i = 0; i < missions.length; i++)
                          Container(
                            padding: const EdgeInsets.symmetric(vertical: 28),
                            decoration: const BoxDecoration(
                              border: Border(
                                top: BorderSide(
                                  color: GameColors.sand,
                                  width: 2,
                                ),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'САЯХАТ 0${i + 1}',
                                  style: const TextStyle(
                                    color: GameColors.turquoise,
                                    letterSpacing: 2,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  missions[i].title,
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineMedium,
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  '5 тапсырма · Тас сақшының сынағы · Әлемге сыйлық',
                                ),
                                const SizedBox(height: 20),
                                GameButton(
                                  label: 'Миссияны бастау',
                                  onPressed: () => context.push(
                                    '/mission/${missions[i].id}',
                                  ),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
            ],
          ),
        ),
      ),
    ),
  );
}
