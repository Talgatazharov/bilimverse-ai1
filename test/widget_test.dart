import 'package:bilimai/app/bilimverse_app.dart';
import 'package:bilimai/app/providers.dart';
import 'package:bilimai/app/router.dart';
import 'package:bilimai/repositories/local_progress_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'support/memory_store.dart';

void main() {
  for (final width in [320.0, 800.0]) {
    testWidgets('Preview and persisted settings at width $width', (
      tester,
    ) async {
      tester.view.physicalSize = Size(width, 900);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      final store = MemoryStore();
      Widget app() => ProviderScope(
        overrides: [
          initialLocationProvider.overrideWithValue('/preview'),
          progressRepositoryProvider.overrideWithValue(
            LocalProgressRepository(store),
          ),
        ],
        child: const BilimverseApp(),
      );
      await tester.pumpWidget(app());
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 700));
      expect(find.text('Сәлем, Аян!'), findsOneWidget);
      expect(tester.takeException(), isNull);
      await tester.tap(find.byTooltip('Баптаулар'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 400));
      await tester.tap(find.text('Қозғалысты азайту'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));
      expect(
        (await LocalProgressRepository(store).load()).settings.reduceMotion,
        isTrue,
      );
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox());
      await tester.pumpWidget(app());
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 700));
      final context = tester.element(find.text('Сәлем, Аян!'));
      expect(MediaQuery.disableAnimationsOf(context), isTrue);
      expect(tester.takeException(), isNull);
    });
  }
  testWidgets('Large Kazakh text remains readable without overflow', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(320, 900);
    tester.view.devicePixelRatio = 1;
    tester.platformDispatcher.textScaleFactorTestValue = 2;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          initialLocationProvider.overrideWithValue('/preview'),
          progressRepositoryProvider.overrideWithValue(
            LocalProgressRepository(MemoryStore()),
          ),
        ],
        child: const BilimverseApp(),
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 700));
    expect(tester.takeException(), isNull);
    await tester.tap(find.byTooltip('Баптаулар'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    expect(tester.takeException(), isNull);
  });
}
