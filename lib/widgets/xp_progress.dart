import 'package:flutter/material.dart';

import '../theme/game_colors.dart';
import '../theme/game_theme.dart';

class XpProgress extends StatelessWidget {
  const XpProgress({super.key, required this.value, required this.label});
  final double value;
  final String label;
  @override
  Widget build(BuildContext context) => Semantics(
    label: label,
    value: '${(value * 100).round()}%',
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.labelLarge),
        const SizedBox(height: 10),
        TweenAnimationBuilder<double>(
          tween: Tween(begin: 0, end: value.clamp(0, 1)),
          duration: MediaQuery.disableAnimationsOf(context)
              ? Duration.zero
              : GameLayout.progressMotion,
          builder: (context, progress, _) => Container(
            height: 12,
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: GameColors.sand,
              borderRadius: BorderRadius.circular(4),
            ),
            alignment: Alignment.centerLeft,
            child: FractionallySizedBox(
              widthFactor: progress,
              child: const ColoredBox(
                color: GameColors.turquoise,
                child: SizedBox.expand(),
              ),
            ),
          ),
        ),
      ],
    ),
  );
}
