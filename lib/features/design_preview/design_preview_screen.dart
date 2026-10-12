import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../theme/game_colors.dart';
import '../../theme/game_theme.dart';
import '../../widgets/game_button.dart';
import '../../widgets/game_status.dart';
import '../../widgets/shanyrak_portal.dart';
import '../../widgets/xp_progress.dart';
import 'steppe_backdrop.dart';

class DesignPreviewScreen extends ConsumerWidget {
  const DesignPreviewScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final student = ref.watch(studentProvider);
    final rules = ref.watch(gameRulesProvider);
    return Scaffold(
      body: SafeArea(
        child: student.when(
          loading: () => const GameStatus(),
          error: (_, _) => GameStatus(
            message: 'Қыран саяхатыңды аша алмады. Қайта көрейік!',
            onRetry: () => ref.invalidate(studentProvider),
          ),
          data: (profile) => Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(
                maxWidth: GameLayout.contentWidth,
              ),
              child: ListView(
                padding: const EdgeInsets.only(bottom: 32),
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 20,
                    ),
                    child: Row(
                      children: [
                        const Expanded(
                          child: Text(
                            'BILIMVERSE / AI',
                            style: TextStyle(
                              fontWeight: FontWeight.w700,
                              letterSpacing: 2,
                            ),
                          ),
                        ),
                        IconButton(
                          tooltip: 'Баптаулар',
                          onPressed: () => context.push('/settings'),
                          constraints: const BoxConstraints(
                            minWidth: 56,
                            minHeight: 56,
                          ),
                          icon: const Icon(Icons.tune_rounded),
                        ),
                      ],
                    ),
                  ),
                  const RepaintBoundary(child: _PortalScene()),
                  Padding(
                    padding: const EdgeInsets.all(GameLayout.pagePadding),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Сәлем, ${profile.name}!',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${profile.grade}-сынып · ${rules.levelFor(profile.xp)}-деңгей · ${rules.titleFor(profile.xp)}',
                        ),
                        const SizedBox(height: 24),
                        XpProgress(
                          value: rules.levelProgress(profile.xp),
                          label:
                              '${profile.xp} XP · Келесі деңгейге ${rules.xpPerLevel - profile.xp % rules.xpPerLevel} XP',
                        ),
                        const SizedBox(height: 24),
                        Wrap(
                          spacing: 24,
                          runSpacing: 12,
                          children: [
                            _Resource(
                              icon: Icons.auto_awesome_outlined,
                              label: '${profile.currency} Тұмар',
                            ),
                            _Resource(
                              icon: Icons.local_fire_department_outlined,
                              label: '${profile.streak} күн',
                            ),
                            const _Resource(
                              icon: Icons.explore_outlined,
                              label: 'Қыран · Зерттеуші',
                            ),
                          ],
                        ),
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 24),
                          child: Divider(color: GameColors.sand, thickness: 2),
                        ),
                        Text(
                          'Әлемнің алғашқы бояулары',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Бұл — дизайн жүйесінің preview нұсқасы. '
                          'Шаңырақ, түстер, қаріптер және қозғалыс бір әлемге бірігеді.',
                        ),
                        const SizedBox(height: 20),
                        const Wrap(
                          spacing: 12,
                          runSpacing: 12,
                          children: [
                            _Swatch('Дала', GameColors.grass),
                            _Swatch('Аспан', GameColors.sky),
                            _Swatch('Алтын', GameColors.gold),
                            _Swatch('Саз', GameColors.terracotta),
                            _Swatch('Теңіз', GameColors.turquoise),
                          ],
                        ),
                        const SizedBox(height: 24),
                        GameButton(
                          label: 'Саяхатты өзіңе бейімде',
                          icon: Icons.tune_rounded,
                          onPressed: () => context.push('/settings'),
                        ),
                        const SizedBox(height: 20),
                        Text(
                          'DEMO MODE · STAGE 1',
                          style: Theme.of(context).textTheme.labelLarge,
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Келесі кезең: интерактивті әлем картасы мен Сандар патшалығы.',
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _PortalScene extends StatelessWidget {
  const _PortalScene();
  @override
  Widget build(BuildContext context) => CustomPaint(
    painter: const SteppeBackdrop(),
    child: SizedBox(
      width: double.infinity,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 28, 24, 64),
        child: Column(
          children: [
            const Text(
              'ҰЛЫ ДАЛА. ЖАҢА ӘЛЕМ.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: GameColors.gold,
                letterSpacing: 2,
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
            const ShanyrakPortal(size: 196),
            Text(
              'Білім әлеміне\nсаяхат',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.displaySmall!
                  .copyWith(color: GameColors.cream),
            ),
            const SizedBox(height: 12),
            const Text(
              'Әр жаңалықтан әлемің өседі.',
              textAlign: TextAlign.center,
              style: TextStyle(color: GameColors.sky),
            ),
          ],
        ),
      ),
    ),
  );
}

class _Resource extends StatelessWidget {
  const _Resource({required this.icon, required this.label});
  final IconData icon;
  final String label;
  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Icon(icon, color: GameColors.turquoise),
      const SizedBox(width: 8),
      Flexible(child: Text(label)),
    ],
  );
}

class _Swatch extends StatelessWidget {
  const _Swatch(this.label, this.color);
  final String label;
  final Color color;
  @override
  Widget build(BuildContext context) => Column(
    children: [
      Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: color,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(16),
            bottomRight: Radius.circular(16),
          ),
        ),
      ),
      const SizedBox(height: 6),
      Text(label),
    ],
  );
}
