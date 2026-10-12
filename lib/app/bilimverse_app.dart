import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../theme/game_theme.dart';
import 'providers.dart';
import 'router.dart';

class BilimverseApp extends ConsumerStatefulWidget {
  const BilimverseApp({super.key});
  @override
  ConsumerState<BilimverseApp> createState() => _BilimverseAppState();
}

class _BilimverseAppState extends ConsumerState<BilimverseApp> {
  @override
  void initState() {
    super.initState();
    LicenseRegistry.addLicense(() async* {
      yield LicenseEntryWithLineBreaks([
        'Noto Sans',
      ], await rootBundle.loadString('assets/fonts/OFL.txt'));
    });
  }

  @override
  Widget build(BuildContext context) {
    final reduceMotion =
        ref.watch(studentProvider).asData?.value.settings.reduceMotion ?? false;
    return MaterialApp.router(
      title: 'BILIMVERSE AI',
      debugShowCheckedModeBanner: false,
      theme: GameTheme.light,
      routerConfig: ref.watch(routerProvider),
      builder: (context, child) {
        final media = MediaQuery.of(context);
        return MediaQuery(
          data: media.copyWith(
            disableAnimations: media.disableAnimations || reduceMotion,
          ),
          child: child!,
        );
      },
    );
  }
}
