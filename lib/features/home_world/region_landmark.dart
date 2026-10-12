import 'package:flutter/material.dart';

import '../../theme/game_colors.dart';

class RegionLandmark extends StatelessWidget {
  const RegionLandmark({
    super.key,
    required this.kind,
    this.locked = false,
    this.size = 150,
  });
  final int kind;
  final bool locked;
  final double size;
  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: CustomPaint(
      size: Size(size, size * .8),
      painter: _LandmarkPainter(kind, locked),
    ),
  );
}

class _LandmarkPainter extends CustomPainter {
  const _LandmarkPainter(this.kind, this.locked);
  final int kind;
  final bool locked;
  @override
  void paint(Canvas c, Size s) {
    c.scale(s.width / 180);
    final p = Paint();
    c.drawOval(
      const Rect.fromLTWH(5, 103, 170, 35),
      p..color = GameColors.navy.withValues(alpha: .13),
    );
    c.drawOval(const Rect.fromLTWH(4, 95, 172, 34), p..color = GameColors.sand);
    switch (kind) {
      case 0:
        c.drawRRect(
          RRect.fromRectAndRadius(
            const Rect.fromLTWH(34, 60, 105, 55),
            const Radius.circular(10),
          ),
          p..color = GameColors.cream,
        );
        c.drawPath(
          Path()
            ..moveTo(25, 62)
            ..quadraticBezierTo(84, -1, 148, 62)
            ..close(),
          p..color = GameColors.terracotta,
        );
        c.drawRect(
          const Rect.fromLTWH(76, 79, 23, 36),
          p..color = GameColors.turquoise,
        );
        for (var i = 0; i < 6; i++) {
          c.drawCircle(Offset(45 + i * 15, 70), 3, p..color = GameColors.gold);
        }
        _tree(c, 154, 70, p);
        break;
      case 1:
        for (var i = 0; i < 3; i++) {
          final x = 25.0 + i * 49;
          final y = i == 1 ? 28.0 : 50.0;
          c.drawRect(
            Rect.fromLTWH(x, y, 37, 110 - y),
            p..color = i == 1 ? GameColors.gold : const Color(0xFFD6AA51),
          );
          c.drawPath(
            Path()
              ..moveTo(x - 6, y)
              ..lineTo(x + 18, y - 25)
              ..lineTo(x + 43, y)
              ..close(),
            p..color = GameColors.terracotta,
          );
          c.drawRRect(
            RRect.fromRectAndRadius(
              Rect.fromLTWH(x + 12, y + 16, 13, 20),
              const Radius.circular(6),
            ),
            p..color = GameColors.turquoise,
          );
        }
        c.drawRRect(
          RRect.fromRectAndRadius(
            const Rect.fromLTWH(78, 76, 27, 36),
            const Radius.circular(13),
          ),
          p..color = GameColors.navy,
        );
        break;
      case 2:
        for (final x in [35.0, 89.0, 139.0]) {
          _tree(c, x, x == 89 ? 45 : 70, p);
        }
        break;
      case 3:
        c.drawRect(
          const Rect.fromLTWH(39, 66, 105, 45),
          p..color = GameColors.sand,
        );
        for (final x in [40.0, 90.0, 140.0]) {
          c.drawRect(
            Rect.fromLTWH(x - 13, 37, 26, 74),
            p..color = GameColors.terracotta,
          );
          c.drawPath(
            Path()
              ..moveTo(x - 20, 40)
              ..lineTo(x, 10)
              ..lineTo(x + 20, 40)
              ..close(),
            p..color = GameColors.turquoise,
          );
        }
        break;
      case 4:
        c.drawPath(
          Path()
            ..moveTo(20, 112)
            ..lineTo(71, 20)
            ..lineTo(119, 112)
            ..close(),
          p..color = GameColors.grass,
        );
        c.drawPath(
          Path()
            ..moveTo(53, 54)
            ..lineTo(71, 20)
            ..lineTo(89, 54)
            ..close(),
          p..color = GameColors.cream,
        );
        c.drawRRect(
          RRect.fromRectAndRadius(
            const Rect.fromLTWH(104, 68, 51, 40),
            const Radius.circular(9),
          ),
          p..color = GameColors.cream,
        );
        c.drawCircle(
          const Offset(130, 63),
          23,
          p..color = GameColors.turquoise,
        );
        break;
      case 5:
        for (var i = 0; i < 3; i++) {
          final x = 25.0 + i * 46;
          c.drawRect(
            Rect.fromLTWH(x, 40 + i * 12, 37, 72 - i * 12),
            p..color = i.isEven ? GameColors.terracotta : GameColors.turquoise,
          );
          c.drawPath(
            Path()
              ..moveTo(x - 4, 40 + i * 12)
              ..lineTo(x + 18, 20 + i * 12)
              ..lineTo(x + 42, 40 + i * 12)
              ..close(),
            p..color = GameColors.navy,
          );
          c.drawRect(
            Rect.fromLTWH(x + 11, 62 + i * 8, 14, 15),
            p..color = GameColors.cream,
          );
        }
        break;
      default:
        for (var i = 0; i < 4; i++) {
          final x = 20.0 + i * 37;
          final y = i.isEven ? 40.0 : 20.0;
          c.drawRRect(
            RRect.fromRectAndRadius(
              Rect.fromLTWH(x, y, 28, 113 - y),
              const Radius.circular(5),
            ),
            p..color = GameColors.turquoise,
          );
          for (var j = 0; j < 3; j++) {
            c.drawRect(
              Rect.fromLTWH(x + 7, y + 12 + j * 18, 14, 5),
              p..color = GameColors.gold,
            );
          }
        }
    }
    if (locked) {
      c.drawOval(
        const Rect.fromLTWH(0, 75, 180, 56),
        p..color = GameColors.cream.withValues(alpha: .65),
      );
      c.drawOval(
        const Rect.fromLTWH(15, 40, 146, 65),
        p..color = GameColors.cream.withValues(alpha: .4),
      );
    }
  }

  void _tree(Canvas c, double x, double y, Paint p) {
    c.drawRect(
      Rect.fromLTWH(x - 4, y + 13, 8, 100 - y),
      p..color = GameColors.terracotta,
    );
    c.drawCircle(Offset(x, y), 26, p..color = GameColors.emerald);
    c.drawCircle(Offset(x - 15, y + 18), 21, p..color = GameColors.grass);
    c.drawCircle(Offset(x + 14, y + 15), 22, p..color = GameColors.emerald);
    c.drawCircle(Offset(x - 9, y - 5), 3, p..color = GameColors.gold);
  }

  @override
  bool shouldRepaint(covariant _LandmarkPainter oldDelegate) =>
      oldDelegate.kind != kind || oldDelegate.locked != locked;
}
