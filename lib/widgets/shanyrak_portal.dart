import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme/game_colors.dart';

class ShanyrakPortal extends StatefulWidget {
  const ShanyrakPortal({super.key, this.size = 180});
  final double size;
  @override
  State<ShanyrakPortal> createState() => _ShanyrakPortalState();
}

class _ShanyrakPortalState extends State<ShanyrakPortal>
    with SingleTickerProviderStateMixin {
  late final _controller = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 12),
  );
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller.stop();
      _controller.value = 0;
    } else {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Шаңырақ порталы',
    image: true,
    child: RepaintBoundary(
      child: SizedBox.square(
        dimension: widget.size,
        child: CustomPaint(painter: _PortalPainter(_controller)),
      ),
    ),
  );
}

class _PortalPainter extends CustomPainter {
  _PortalPainter(this.animation) : super(repaint: animation);
  final Animation<double> animation;
  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    final radius = size.width * .34;
    canvas.drawCircle(
      center,
      radius * 1.15,
      Paint()..color = GameColors.gold.withValues(alpha: .08),
    );
    canvas.drawCircle(center, radius, Paint()..color = GameColors.turquoise);
    final line = Paint()
      ..color = GameColors.gold
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * .022
      ..strokeCap = StrokeCap.round;
    canvas.drawCircle(center, radius, line);
    canvas.drawCircle(
      center,
      radius * .82,
      line..strokeWidth = size.width * .012,
    );
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(-math.pi / 4);
    for (final offset in [-.25, .0, .25]) {
      final d = radius * offset;
      final length = math.sqrt(radius * radius * .64 - d * d);
      canvas.drawLine(Offset(d, -length), Offset(d, length), line);
      canvas.drawLine(Offset(-length, d), Offset(length, d), line);
    }
    canvas.restore();
    for (var i = 0; i < 12; i++) {
      final angle = i * math.pi / 6 + animation.value * math.pi * 2;
      final p =
          center + Offset(math.cos(angle), math.sin(angle)) * radius * 1.32;
      canvas.save();
      canvas.translate(p.dx, p.dy);
      canvas.rotate(angle + math.pi / 4);
      canvas.drawRect(
        Rect.fromCenter(
          center: Offset.zero,
          width: i.isEven ? 7 : 4,
          height: i.isEven ? 7 : 4,
        ),
        Paint()..color = GameColors.gold,
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant _PortalPainter oldDelegate) =>
      oldDelegate.animation != animation;
}
