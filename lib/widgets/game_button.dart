import 'package:flutter/material.dart';

import '../theme/game_colors.dart';
import '../theme/game_theme.dart';

class GameButton extends StatefulWidget {
  const GameButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon = Icons.arrow_forward_rounded,
    this.secondary = false,
  });
  final String label;
  final VoidCallback? onPressed;
  final IconData icon;
  final bool secondary;
  @override
  State<GameButton> createState() => _GameButtonState();
}

class _GameButtonState extends State<GameButton> {
  bool _pressed = false;
  @override
  Widget build(BuildContext context) => AnimatedScale(
    scale: _pressed && !MediaQuery.disableAnimationsOf(context) ? .96 : 1,
    duration: GameLayout.quickMotion,
    child: Material(
      color: widget.secondary ? GameColors.turquoise : GameColors.gold,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: widget.onPressed,
        onHighlightChanged: (pressed) => setState(() => _pressed = pressed),
        borderRadius: BorderRadius.circular(18),
        child: Container(
          constraints: const BoxConstraints(minHeight: GameLayout.touchTarget),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border(
              bottom: BorderSide(
                width: 4,
                color: widget.secondary
                    ? GameColors.navy
                    : GameColors.terracotta,
              ),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Flexible(
                child: Text(
                  widget.label,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.labelLarge!.copyWith(
                    color: widget.secondary
                        ? GameColors.cream
                        : GameColors.navy,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Icon(
                widget.icon,
                color: widget.secondary ? GameColors.cream : GameColors.navy,
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
