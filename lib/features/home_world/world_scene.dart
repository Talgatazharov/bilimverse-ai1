import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme/game_colors.dart';

/// Static terrain is isolated from the lightweight animated atmosphere.
class WorldScene extends StatelessWidget {
  const WorldScene({super.key, required this.child, this.hasBridge = false});
  final Widget child;
  final bool hasBridge;
  @override
  Widget build(BuildContext context) => Stack(
    children: [
      Positioned.fill(
        child: RepaintBoundary(
          child: CustomPaint(painter: _TerrainPainter(hasBridge)),
        ),
      ),
      Positioned.fill(child: IgnorePointer(child: _Atmosphere())),
      child,
    ],
  );
}

class _Atmosphere extends StatefulWidget {
  @override
  State<_Atmosphere> createState() => _AtmosphereState();
}

class _AtmosphereState extends State<_Atmosphere>
    with SingleTickerProviderStateMixin {
  late final _motion = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 24),
  );
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _motion.stop();
    } else {
      _motion.repeat();
    }
  }

  @override
  void dispose() {
    _motion.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) =>
      RepaintBoundary(child: CustomPaint(painter: _CloudPainter(_motion)));
}

class _TerrainPainter extends CustomPainter {
  const _TerrainPainter(this.hasBridge);
  final bool hasBridge;
  @override
  void paint(Canvas c, Size s) {
    final w = s.width;
    final h = s.height;
    c.drawRect(Offset.zero & s, Paint()..color = const Color(0xFFD7E7CD));
    c.drawRect(Rect.fromLTWH(0, 0, w, 160), Paint()..color = GameColors.sky);
    final mountains = Path()
      ..moveTo(0, 170)
      ..lineTo(w * .12, 60)
      ..lineTo(w * .23, 126)
      ..lineTo(w * .43, 15)
      ..lineTo(w * .63, 134)
      ..lineTo(w * .79, 45)
      ..lineTo(w, 154)
      ..lineTo(w, 280)
      ..lineTo(0, 280)
      ..close();
    c.drawPath(mountains, Paint()..color = const Color(0xFF7DADB0));
    c.drawPath(
      Path()
        ..moveTo(w * .35, 62)
        ..lineTo(w * .43, 15)
        ..lineTo(w * .52, 69)
        ..lineTo(w * .44, 51)
        ..lineTo(w * .42, 62)
        ..close(),
      Paint()..color = GameColors.cream,
    );
    for (var i = 0; i < 9; i++) {
      c.drawOval(
        Rect.fromCenter(
          center: Offset(w * (i.isEven ? .1 : .9), 240 + i * h / 10),
          width: w * .9,
          height: 320,
        ),
        Paint()
          ..color = i.isEven
              ? const Color(0xFFB8D5A1)
              : const Color(0xFFC4DBB0),
      );
    }
    final river = Path()
      ..moveTo(w * .72, 175)
      ..cubicTo(w * .2, h * .27, w * .9, h * .37, w * .61, h * .53)
      ..cubicTo(w * .13, h * .8, w * .82, h * .86, w * .35, h);
    c.drawPath(
      river,
      Paint()
        ..color = const Color(0xFF9BCECF)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 54,
    );
    c.drawPath(
      river,
      Paint()
        ..color = GameColors.sky
        ..style = PaintingStyle.stroke
        ..strokeWidth = 31,
    );
    for (var i = 0; i < 70; i++) {
      final x = (i * 137.7 + 28) % w;
      final y = 250 + (i * 197.3) % (h - 280);
      c.drawLine(
        Offset(x, y),
        Offset(x - 3, y - 7),
        Paint()
          ..color = GameColors.grass.withValues(alpha: .45)
          ..strokeWidth = 2,
      );
    }
    if (hasBridge) {
      c.save();
      c.translate(w * .61, h * .53);
      c.rotate(.4);
      c.drawRRect(
        RRect.fromRectAndRadius(
          const Rect.fromLTWH(-55, -18, 110, 36),
          const Radius.circular(6),
        ),
        Paint()..color = GameColors.terracotta,
      );
      for (var i = 0; i < 9; i++) {
        c.drawRect(
          Rect.fromLTWH(-51 + i * 12, -14, 9, 28),
          Paint()..color = GameColors.gold,
        );
      }
      c.restore();
    }
  }

  @override
  bool shouldRepaint(covariant _TerrainPainter oldDelegate) =>
      oldDelegate.hasBridge != hasBridge;
}

class _CloudPainter extends CustomPainter {
  _CloudPainter(this.motion) : super(repaint: motion);
  final Animation<double> motion;
  @override
  void paint(Canvas c, Size s) {
    final p = Paint()..color = GameColors.cream.withValues(alpha: .7);
    for (var i = 0; i < 7; i++) {
      final x = ((i * 191 + motion.value * 90) % (s.width + 120)) - 60;
      final y = 60.0 + i * 217;
      c.drawOval(
        Rect.fromCenter(center: Offset(x, y), width: 105, height: 25),
        p,
      );
      c.drawOval(
        Rect.fromCenter(center: Offset(x + 15, y - 10), width: 50, height: 29),
        p,
      );
    }
    final bird = Paint()
      ..color = GameColors.navy.withValues(alpha: .55)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    for (var i = 0; i < 3; i++) {
      final x =
          s.width * .35 + i * 22 + math.sin(motion.value * math.pi * 2) * 22;
      final y = 98.0 + i * 7;
      c.drawPath(
        Path()
          ..moveTo(x - 8, y - 3)
          ..quadraticBezierTo(x - 3, y - 7, x, y)
          ..quadraticBezierTo(x + 3, y - 7, x + 8, y - 3),
        bird,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _CloudPainter oldDelegate) =>
      oldDelegate.motion != motion;
}
