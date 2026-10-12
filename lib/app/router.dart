import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/design_preview/design_preview_screen.dart';
import '../features/design_preview/settings_screen.dart';
import '../features/home_world/world_screen.dart';
import '../features/missions/mission_screen.dart';
import '../features/onboarding/entry_screen.dart';
import '../features/onboarding/onboarding_screen.dart';
import '../features/subjects/math_kingdom_screen.dart';
import '../widgets/game_status.dart';

final initialLocationProvider = Provider<String?>((ref) => null);
final routerProvider = Provider<GoRouter>((ref) {
  final router = GoRouter(
    initialLocation: ref.watch(initialLocationProvider),
    routes: [
      GoRoute(path: '/', builder: (_, _) => const EntryScreen()),
      GoRoute(path: '/onboarding', builder: (_, _) => const OnboardingScreen()),
      GoRoute(path: '/world', builder: (_, _) => const WorldScreen()),
      GoRoute(
        path: '/kingdom',
        pageBuilder: (context, state) =>
            _portalPage(context, state, const MathKingdomScreen()),
      ),
      GoRoute(
        path: '/mission/:id',
        pageBuilder: (context, state) => _portalPage(
          context,
          state,
          MissionScreen(
            key: ValueKey(state.pathParameters['id']),
            missionId: state.pathParameters['id']!,
          ),
        ),
      ),
      GoRoute(path: '/preview', builder: (_, _) => const DesignPreviewScreen()),
      GoRoute(path: '/settings', builder: (_, _) => const SettingsScreen()),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: GameStatus(
        message: 'Бұл жол әлі ашылмады.',
        actionLabel: 'Әлемге қайту',
        onRetry: () => context.go('/world'),
      ),
    ),
  );
  ref.onDispose(router.dispose);
  return router;
});

Page<void> _portalPage(
  BuildContext context,
  GoRouterState state,
  Widget child,
) => CustomTransitionPage<void>(
  key: state.pageKey,
  child: child,
  transitionDuration: MediaQuery.disableAnimationsOf(context)
      ? Duration.zero
      : const Duration(milliseconds: 450),
  transitionsBuilder: (context, animation, secondary, child) {
    if (MediaQuery.disableAnimationsOf(context)) return child;
    return FadeTransition(
      opacity: animation,
      child: ScaleTransition(
        scale: Tween<double>(begin: .93, end: 1).animate(
          CurvedAnimation(parent: animation, curve: Curves.easeOutCubic),
        ),
        child: child,
      ),
    );
  },
);
