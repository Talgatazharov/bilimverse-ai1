import 'package:flutter/material.dart';

import '../theme/game_colors.dart';

class StudentAvatar extends StatelessWidget {
  const StudentAvatar({super.key, required this.avatar, this.size = 100});
  final String avatar;
  final double size;
  @override
  Widget build(BuildContext context) => Semantics(
    label: avatar == 'inventor' ? 'Өнертапқыш қыз' : 'Саяхатшы ұл',
    image: true,
    child: CustomPaint(
      size: Size.square(size),
      painter: _AvatarPainter(avatar),
    ),
  );
}

class _AvatarPainter extends CustomPainter {
  const _AvatarPainter(this.avatar);
  final String avatar;
  @override
  void paint(Canvas c, Size s) {
    c.scale(s.width / 100);
    final p = Paint();
    c.drawCircle(const Offset(50, 50), 48, p..color = GameColors.sand);
    final girl = avatar == 'inventor';
    if (girl) {
      c.drawRRect(
        RRect.fromRectAndRadius(
          const Rect.fromLTWH(20, 23, 60, 65),
          const Radius.circular(24),
        ),
        p..color = GameColors.navy,
      );
    }
    c.drawRRect(
      RRect.fromRectAndRadius(
        const Rect.fromLTWH(23, 61, 54, 36),
        const Radius.circular(14),
      ),
      p..color = girl ? GameColors.terracotta : GameColors.turquoise,
    );
    c.drawCircle(const Offset(50, 43), 24, p..color = const Color(0xFFE1AB7A));
    c.drawArc(
      const Rect.fromLTWH(26, 16, 48, 44),
      3.14,
      3.14,
      true,
      p..color = GameColors.navy,
    );
    if (!girl) {
      c.drawRRect(
        RRect.fromRectAndRadius(
          const Rect.fromLTWH(25, 18, 50, 13),
          const Radius.circular(6),
        ),
        p..color = GameColors.turquoise,
      );
    }
    for (final x in [41.0, 59.0]) {
      c.drawCircle(Offset(x, 43), 2.4, p..color = GameColors.navy);
    }
    c.drawArc(
      const Rect.fromLTWH(43, 49, 14, 8),
      0,
      3.14,
      false,
      p
        ..color = GameColors.navy
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );
    p.style = PaintingStyle.fill;
    for (var i = 0; i < 3; i++) {
      final x = 36.0 + i * 14;
      c.drawPath(
        Path()
          ..moveTo(x, 78)
          ..lineTo(x + 5, 83)
          ..lineTo(x, 88)
          ..lineTo(x - 5, 83)
          ..close(),
        p..color = GameColors.gold,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _AvatarPainter oldDelegate) =>
      oldDelegate.avatar != avatar;
}
