import 'package:flutter/material.dart';

import '../../theme/game_colors.dart';

/// Lightweight vector scenery; no external image dependencies.
class SteppeBackdrop extends CustomPainter {
  const SteppeBackdrop();
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    canvas.drawRect(Offset.zero & size, Paint()..color = GameColors.navy);
    final stars = Paint()..color = GameColors.sand.withValues(alpha: .6);
    for (var i = 0; i < 32; i++) {
      canvas.drawCircle(
        Offset((i * 137.0 + 19) % w, (i * 47.0 + 11) % (h * .65)),
        i % 3 == 0 ? 1.8 : .8,
        stars,
      );
    }
    final distant = Path()
      ..moveTo(0, h * .78)
      ..lineTo(w * .13, h * .5)
      ..lineTo(w * .24, h * .64)
      ..lineTo(w * .43, h * .35)
      ..lineTo(w * .62, h * .7)
      ..lineTo(w * .8, h * .48)
      ..lineTo(w, h * .73)
      ..lineTo(w, h)
      ..lineTo(0, h)
      ..close();
    canvas.drawPath(distant, Paint()..color = const Color(0xFF275462));
    final snow = Path()
      ..moveTo(w * .36, h * .46)
      ..lineTo(w * .43, h * .35)
      ..lineTo(w * .5, h * .48)
      ..lineTo(w * .43, h * .44)
      ..lineTo(w * .41, h * .47)
      ..close();
    canvas.drawPath(
      snow,
      Paint()..color = GameColors.sky.withValues(alpha: .5),
    );
    final hill = Path()
      ..moveTo(0, h * .87)
      ..quadraticBezierTo(w * .3, h * .63, w * .6, h * .86)
      ..quadraticBezierTo(w * .85, h, w, h * .83)
      ..lineTo(w, h)
      ..lineTo(0, h)
      ..close();
    canvas.drawPath(hill, Paint()..color = GameColors.turquoise);
    final trail = Path()
      ..moveTo(w * .52, h)
      ..quadraticBezierTo(w * .8, h * .9, w * .6, h * .88);
    canvas.drawPath(
      trail,
      Paint()
        ..color = GameColors.sand.withValues(alpha: .5)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 5,
    );
  }

  @override
  bool shouldRepaint(covariant SteppeBackdrop oldDelegate) => false;
}
