import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme/game_colors.dart';

class Qyran extends StatelessWidget {
  const Qyran({super.key, this.size = 112});
  final double size;
  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Қыран — білім серігің',
    image: true,
    child: RepaintBoundary(
      child: CustomPaint(
        size: Size.square(size),
        painter: const _QyranPainter(),
      ),
    ),
  );
}

class _QyranPainter extends CustomPainter {
  const _QyranPainter();
  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(size.width / 120);
    final fill = Paint();
    canvas.drawOval(
      const Rect.fromLTWH(22, 102, 78, 9),
      fill..color = GameColors.navy.withValues(alpha: .1),
    );
    final wings = Path()
      ..moveTo(40, 44)
      ..quadraticBezierTo(8, 24, 7, 78)
      ..lineTo(29, 67)
      ..lineTo(32, 88)
      ..lineTo(47, 72)
      ..moveTo(79, 44)
      ..quadraticBezierTo(114, 23, 114, 77)
      ..lineTo(92, 66)
      ..lineTo(89, 87)
      ..lineTo(73, 72);
    canvas.drawPath(wings, fill..color = GameColors.turquoise);
    canvas.drawOval(
      const Rect.fromLTWH(31, 24, 58, 77),
      fill..color = GameColors.gold,
    );
    canvas.drawOval(
      const Rect.fromLTWH(42, 60, 36, 34),
      fill..color = GameColors.cream,
    );
    canvas.drawCircle(const Offset(47, 47), 14, fill..color = GameColors.cream);
    canvas.drawCircle(const Offset(74, 47), 14, fill);
    for (final x in [49.0, 72.0]) {
      canvas.drawCircle(Offset(x, 48), 5.5, fill..color = GameColors.navy);
      canvas.drawCircle(Offset(x + 1.5, 46), 1.8, fill..color = Colors.white);
    }
    canvas.drawPath(
      Path()
        ..moveTo(54, 56)
        ..lineTo(67, 56)
        ..lineTo(60, 66)
        ..close(),
      fill..color = GameColors.terracotta,
    );
    canvas.drawPath(
      Path()
        ..moveTo(36, 29)
        ..lineTo(33, 13)
        ..lineTo(51, 25)
        ..lineTo(60, 16)
        ..lineTo(70, 25)
        ..lineTo(88, 13)
        ..lineTo(84, 30),
      fill..color = GameColors.turquoise,
    );
    canvas.save();
    canvas.translate(60, 76);
    canvas.rotate(math.pi / 4);
    canvas.drawRect(
      const Rect.fromLTWH(-4, -4, 8, 8),
      fill..color = GameColors.turquoise,
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _QyranPainter oldDelegate) => false;
}
