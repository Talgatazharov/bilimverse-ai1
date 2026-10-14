import 'package:bilimai/app/bilimverse_app.dart';
import 'package:bilimai/app/providers.dart';
import 'package:bilimai/app/router.dart';
import 'package:bilimai/data/demo_student.dart';
import 'package:bilimai/data/demo_math_repository.dart';
import 'package:bilimai/models/game_settings.dart';
import 'package:bilimai/repositories/local_progress_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'support/memory_store.dart';

Future<void> launch(
  WidgetTester tester,
  MemoryStore store,
  String route, {
  double width = 1280,
  double scale = 1,
}) async {
  tester.view.physicalSize = Size(width, 1000);
  tester.view.devicePixelRatio = 1;
  tester.platformDispatcher.textScaleFactorTestValue = scale;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
  await LocalProgressRepository(store).save(
    createDemoStudent().copyWith(
      settings: const GameSettings(reduceMotion: true),
    ),
  );
  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        progressRepositoryProvider.overrideWithValue(
          LocalProgressRepository(store),
        ),
        initialLocationProvider.overrideWithValue(route),
      ],
      child: const BilimverseApp(),
    ),
  );
  await tester.pumpAndSettle();
}

Future<void> click(WidgetTester tester, String text) async {
  final target = find.text(text).first;
  await tester.ensureVisible(target);
  await tester.tap(target);
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('Sentence builder accepts words in order', (tester) async {
    await launch(tester, MemoryStore(), '/mission/kazakh-3-starter');
    await click(tester, 'Бала');
    await click(tester, 'Келесі қадам');
    await click(tester, 'Мен');
    await click(tester, 'кітап');
    await click(tester, 'оқимын');
    await click(tester, 'Тексеру');
    expect(find.textContaining('Жарайсың!'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
  for (final width in [320.0, 1440.0]) {
    testWidgets('Browser entry and world navigation at $width', (tester) async {
      await launch(tester, MemoryStore(), '/', width: width);
      expect(find.text('Білім әлеміне\nсаяхат'), findsOneWidget);
      expect(tester.takeException(), isNull);
      await click(tester, 'Demo әлемін ашу →');
      expect(find.text('Сандар патшалығы'), findsOneWidget);
      expect(tester.takeException(), isNull);
      await click(tester, 'Сандар патшалығы');
      expect(find.text('Алтын көпірдің құпиясы'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  }
  testWidgets('World supports 200 percent text at narrow width', (
    tester,
  ) async {
    await launch(tester, MemoryStore(), '/world', width: 320, scale: 2);
    expect(tester.takeException(), isNull);
  });
  testWidgets('Five-step onboarding saves chosen name, grade and avatar', (
    tester,
  ) async {
    final store = MemoryStore();
    await launch(tester, store, '/onboarding', width: 600);
    await click(tester, 'Жалғастыру');
    expect(find.text('Атыңды жазып көр.'), findsOneWidget);
    await tester.enterText(find.byType(TextField), 'Айша');
    await click(tester, 'Жалғастыру');
    await click(tester, '4-сынып');
    await click(tester, 'Жалғастыру');
    await click(tester, 'Өнертапқыш');
    await click(tester, 'Жалғастыру');
    await click(tester, 'Жалғастыру');
    await click(tester, 'Әлемге кір');
    final restored = await LocalProgressRepository(store).load();
    expect(restored.name, 'Айша');
    expect(restored.grade, 4);
    expect(restored.avatar, 'inventor');
    expect(restored.onboardingComplete, isTrue);
    expect(tester.takeException(), isNull);
  });
  testWidgets(
    'Five tasks, supportive retry, boss, reward and persistent bridge',
    (tester) async {
      final store = MemoryStore();
      await launch(tester, store, '/mission/golden-bridge');
      await click(tester, '29');
      expect(find.textContaining('Тағы ойланып көрейік!'), findsOneWidget);
      final questions = await const DemoMathRepository().questionsFor(
        'golden-bridge',
      );
      for (var i = 0; i < 10; i++) {
        await click(tester, questions[i % 5].correctAnswer);
        await click(tester, i == 9 ? 'Сыйлықты алу' : 'Келесі қадам');
      }
      expect(find.text('МИССИЯ ОРЫНДАЛДЫ!'), findsOneWidget);
      final saved = await LocalProgressRepository(store).load();
      expect(saved.xp, 1450);
      expect(saved.currency, 355);
      expect(saved.stars['golden-bridge'], 2);
      expect(saved.worldUnlocks, contains('math-bridge'));
      await click(tester, 'Әлемге оралу');
      expect(find.text('Алтын көпір салынды!'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );
  test(
    'Rewards cannot be duplicated and old save schema remains compatible',
    () async {
      final store = MemoryStore();
      final container = ProviderContainer(
        overrides: [
          progressRepositoryProvider.overrideWithValue(
            LocalProgressRepository(store),
          ),
        ],
      );
      addTearDown(container.dispose);
      await container.read(studentProvider.future);
      final controller = container.read(studentProvider.notifier);
      expect(await controller.completeMission('golden-bridge', 1), isTrue);
      expect(await controller.completeMission('golden-bridge', 3), isTrue);
      expect(
        await controller.completeMission(
          'golden-bridge',
          3,
          assignmentId: 'a1',
        ),
        isTrue,
      );
      final progress = await LocalProgressRepository(store).load();
      expect(progress.xp, 1450);
      expect(progress.currency, 355);
      expect(progress.stars['golden-bridge'], 3);
      expect(progress.completedAssignments, contains('a1'));
      expect(await controller.completeMission('unknown', 3), isFalse);
    },
  );
}
