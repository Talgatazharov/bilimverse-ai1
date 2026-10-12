import 'dart:developer' as developer;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../config/game_rules.dart';
import '../data/demo_math_repository.dart';
import '../repositories/content_repository.dart';
import '../models/game_settings.dart';
import '../models/question.dart';
import '../models/student_progress.dart';
import '../repositories/local_progress_repository.dart';
import '../repositories/progress_repository.dart';
import '../services/sound_service.dart';

final gameRulesProvider = Provider((ref) => const GameRules());
final contentRepositoryProvider = Provider<ContentRepository>(
  (ref) => DemoMathRepository(rules: ref.watch(gameRulesProvider)),
);
final progressRepositoryProvider = Provider<ProgressRepository>(
  (ref) => LocalProgressRepository(PreferencesStore(SharedPreferencesAsync())),
);
final soundServiceProvider = Provider<SoundService>((ref) {
  final service = SilentSoundService();
  ref.onDispose(service.dispose);
  return service;
});
final studentProvider =
    AsyncNotifierProvider<StudentController, StudentProgress>(
      StudentController.new,
    );

class StudentController extends AsyncNotifier<StudentProgress> {
  bool _saving = false;
  @override
  Future<StudentProgress> build() async {
    try {
      final student = await ref.watch(progressRepositoryProvider).load();
      await ref.read(soundServiceProvider).applySettings(student.settings);
      return student;
    } catch (error, stack) {
      developer.log('Progress load failed', error: error, stackTrace: stack);
      rethrow;
    }
  }

  Future<bool> updateSettings(GameSettings settings) async {
    final current = state.asData?.value;
    if (current == null) return false;
    final updated = current.copyWith(settings: settings);
    return _save(updated);
  }

  Future<bool> completeOnboarding({
    required String name,
    required int grade,
    required String avatar,
  }) async {
    final current = state.asData?.value;
    if (current == null ||
        name.trim().isEmpty ||
        name.trim().length > 24 ||
        grade < 1 ||
        grade > 4 ||
        !{'explorer', 'inventor'}.contains(avatar)) {
      return false;
    }
    return _save(
      current.copyWith(
        name: name.trim(),
        grade: grade,
        avatar: avatar,
        onboardingComplete: true,
      ),
    );
  }

  Future<bool> _save(StudentProgress updated) async {
    if (_saving) return false;
    _saving = true;
    try {
      await ref.read(progressRepositoryProvider).save(updated);
      if (!ref.mounted) return false;
      state = AsyncData(updated);
      await ref.read(soundServiceProvider).applySettings(updated.settings);
      return true;
    } catch (error, stack) {
      developer.log('Settings save failed', error: error, stackTrace: stack);
      return false;
    } finally {
      _saving = false;
    }
  }

  /// Rewards are committed once per mission; replay can improve stars only.
  Future<bool> completeMission(String missionId, int stars) async {
    final current = state.asData?.value;
    if (current == null || stars < 1 || stars > 3 || _saving) return false;
    final content = ref.read(contentRepositoryProvider);
    final missions = await content.missionsFor(Subject.math, 3);
    final matching = missions.where((m) => m.id == missionId);
    if (!ref.mounted || matching.isEmpty) return false;
    final latest = state.asData!.value;
    final first = !latest.completedMissions.contains(missionId);
    final rules = ref.read(gameRulesProvider);
    final questions = await content.questionsFor(missionId);
    if (!ref.mounted) return false;
    // Re-read after awaits: an overlapping completion must not grant twice.
    final now = state.asData!.value;
    if (now != latest) return false;
    final earned =
        questions.fold<int>(0, (sum, q) => sum + q.xp) +
        rules.rewards[RewardAction.mission]! +
        rules.rewards[RewardAction.boss]!;
    return _save(
      now.copyWith(
        xp: now.xp + (first ? earned : 0),
        currency: now.currency + (first ? GameRules.missionCurrency : 0),
        stars: {
          ...now.stars,
          missionId: stars > (now.stars[missionId] ?? 0)
              ? stars
              : now.stars[missionId]!,
        },
        worldUnlocks: {...now.worldUnlocks, ...matching.single.unlocks},
      ),
    );
  }
}
