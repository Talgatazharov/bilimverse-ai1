import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../theme/game_colors.dart';
import '../../widgets/game_button.dart';
import '../../widgets/shanyrak_portal.dart';
import '../design_preview/steppe_backdrop.dart';

class EntryScreen extends ConsumerStatefulWidget {
  const EntryScreen({super.key});
  @override
  ConsumerState<EntryScreen> createState() => _EntryState();
}

class _EntryState extends ConsumerState<EntryScreen>
    with SingleTickerProviderStateMixin {
  late final _opening = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 2600),
  );
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _opening.value = 1;
    } else {
      _opening.forward();
    }
  }

  @override
  void dispose() {
    _opening.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final existing =
        ref.watch(studentProvider).asData?.value.onboardingComplete ?? false;
    return Scaffold(
      backgroundColor: GameColors.navy,
      body: SafeArea(
        child: CustomPaint(
          painter: const SteppeBackdrop(),
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1080),
                child: LayoutBuilder(
                  builder: (context, box) {
                    final portal = AnimatedBuilder(
                      animation: _opening,
                      builder: (context, child) => Opacity(
                        opacity: (.1 + _opening.value * .9).clamp(0, 1),
                        child: Transform.scale(
                          scale:
                              .75 +
                              .25 * Curves.easeOut.transform(_opening.value),
                          child: child,
                        ),
                      ),
                      child: ShanyrakPortal(
                        size: box.maxWidth > 800 ? 360 : 200,
                      ),
                    );
                    final intro = Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          'BILIMVERSE AI',
                          style: TextStyle(
                            color: GameColors.gold,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 3,
                          ),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          'Білім әлеміне\nсаяхат',
                          style: Theme.of(context).textTheme.displaySmall!
                              .copyWith(
                                color: GameColors.cream,
                                fontSize: box.maxWidth > 800 ? 60 : 36,
                              ),
                        ),
                        const SizedBox(height: 24),
                        const Text(
                          'Қазақ даласынан басталған ертегілік әлем.\nМиссия орында. Қыранмен зертте. Әлеміңді дамыт.',
                          style: TextStyle(
                            color: GameColors.sky,
                            fontSize: 18,
                            height: 1.6,
                          ),
                        ),
                        const SizedBox(height: 32),
                        GameButton(
                          label: existing
                              ? 'Саяхатты жалғастыру'
                              : 'Өз әлеміңді құр',
                          onPressed: () =>
                              context.go(existing ? '/world' : '/onboarding'),
                        ),
                        const SizedBox(height: 12),
                        TextButton(
                          onPressed: () => context.go('/world'),
                          child: const Text(
                            'Demo әлемін ашу →',
                            style: TextStyle(color: GameColors.cream),
                          ),
                        ),
                        const SizedBox(height: 24),
                        const Text(
                          '1–4 СЫНЫП  ·  ҚАЗАҚША  ·  БРАУЗЕРДЕ',
                          style: TextStyle(
                            color: GameColors.sky,
                            fontSize: 12,
                            letterSpacing: 1,
                          ),
                        ),
                      ],
                    );
                    return box.maxWidth > 800
                        ? Row(
                            children: [
                              Expanded(child: intro),
                              const SizedBox(width: 40),
                              portal,
                            ],
                          )
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Center(child: portal),
                              intro,
                            ],
                          );
                  },
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
