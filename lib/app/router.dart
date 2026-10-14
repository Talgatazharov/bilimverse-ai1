import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/design_preview/design_preview_screen.dart';
import '../features/design_preview/settings_screen.dart';
import '../features/home_world/world_screen.dart';
import '../features/home_world/progress_world_screen.dart';
import '../features/homework/homework_screen.dart';
import '../features/teacher/teacher_studio_screen.dart';
import '../features/missions/mission_screen.dart';
import '../features/onboarding/entry_screen.dart';
import '../features/onboarding/onboarding_screen.dart';
import '../features/subjects/math_kingdom_screen.dart';
import '../features/subjects/subject_screen.dart';
import '../models/question.dart';
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
        path: '/my-world',
        builder: (_, _) => const ProgressWorldScreen(),
      ),
      GoRoute(path: '/homework', builder: (_, _) => const HomeworkScreen()),
      GoRoute(path: '/teacher', builder: (_, _) => const TeacherStudioScreen()),
      GoRoute(
        path: '/adventure',
        builder: (context, state) =>
            const SubjectScreen(subject: Subject.adventure),
      ),
      GoRoute(
        path: '/kingdom',
        pageBuilder: (context, state) =>
            _portalPage(context, state, const MathKingdomScreen()),
      ),
      GoRoute(
        path: '/subject/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'];
          final subject = Subject.values.where((s) => s.name == id).firstOrNull;
          return subject == null
              ? Scaffold(body: GameStatus(onRetry: () => context.go('/world')))
              : SubjectScreen(subject: subject);
        },
      ),
      GoRoute(
        path: '/mission/:id',
        pageBuilder: (context, state) => _portalPage(
          context,
          state,
          MissionScreen(
            key: ValueKey(state.pathParameters['id']),
            missionId: state.pathParameters['id']!,
            assignmentId: state.uri.queryParameters['assignment'],
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
