import 'dart:convert';

import 'package:bilimai/app/providers.dart';
import 'package:bilimai/config/game_rules.dart';
import 'package:bilimai/models/game_settings.dart';
import 'package:bilimai/models/learning_profile.dart';
import 'package:bilimai/models/question.dart';
import 'package:bilimai/models/student_progress.dart';
import 'package:bilimai/repositories/local_progress_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'support/memory_store.dart';

void main() {
  test(
    'First launch persists demo and a new repository restores every field',
    () async {
      final store = MemoryStore();
      final first = await LocalProgressRepository(store).load();
      expect(first.name, 'Аян');
      expect(first.xp, 1250);
      expect(const GameRules().levelFor(first.xp), 7);
      expect(const GameRules().petFor(first.xp), PetStage.explorer);
      final progress = StudentProgress(
        name: 'Аян',
        grade: 3,
        xp: 1450,
        currency: 355,
        streak: 7,
        stars: {'math-1': 3},
        achievements: {'first'},
        worldUnlocks: {'math', 'bridge'},
        topicAttempts: {'Көбейту': 5},
        topicCorrect: {'Көбейту': 4},
        petKind: 'fox',
        lastStudyDate: '2026-10-12',
        settings: const GameSettings(
          music: false,
          sfx: false,
          reduceMotion: true,
        ),
      );
      await LocalProgressRepository(store).save(progress);
      final restored = await LocalProgressRepository(store).load();
      expect(restored.toJson(), progress.toJson());
      expect(restored.completedMissions, {'math-1'});
    },
  );
  test('Unreadable and future saves are preserved', () async {
    final store = MemoryStore();
    for (final raw in [
      'broken-json',
      jsonEncode({'schemaVersion': 99}),
    ]) {
      store.values[LocalProgressRepository.storageKey] = raw;
      await expectLater(
        LocalProgressRepository(store).load(),
        throwsFormatException,
      );
      expect(store.values[LocalProgressRepository.storageKey], raw);
    }
  });
  test('Failed settings save leaves the visible profile unchanged', () async {
    final store = MemoryStore();
    final container = ProviderContainer(
      overrides: [
        progressRepositoryProvider.overrideWithValue(
          LocalProgressRepository(store),
        ),
      ],
    );
    addTearDown(container.dispose);
    final initial = await container.read(studentProvider.future);
    store.failWrites = true;
    final saved = await container
        .read(studentProvider.notifier)
        .updateSettings(initial.settings.copyWith(music: false));
    expect(saved, isFalse);
    expect(container.read(studentProvider).requireValue.settings.music, isTrue);
  });
  test(
    'Adaptive thresholds include 50 and 80 percent in normal difficulty',
    () {
      const adaptive = LocalAdaptiveLearning();
      for (final correct in [0, 4, 5, 8, 9, 10]) {
        final profile = StudentLearningProfile(
          grade: 3,
          recentResults: List.generate(10, (i) => i < correct),
        );
        expect(
          adaptive.recommend(profile),
          correct < 5
              ? Difficulty.easy
              : correct <= 8
              ? Difficulty.normal
              : Difficulty.hard,
        );
      }
      expect(
        adaptive.recommend(const StudentLearningProfile(grade: 1)),
        Difficulty.normal,
      );
    },
  );
  test('Level boundary and reward configuration', () {
    const rules = GameRules();
    expect(rules.levelFor(199), 1);
    expect(rules.levelFor(200), 2);
    expect(rules.levelProgress(200), 0);
    expect(rules.rewards[RewardAction.boss], 100);
    expect(const GameRules(xpPerLevel: 100).levelFor(200), 3);
  });
}
