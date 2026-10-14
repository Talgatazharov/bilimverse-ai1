import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../models/student_progress.dart';
import '../../theme/game_colors.dart';
import '../../widgets/student_avatar.dart';

class WorldHeader extends StatelessWidget {
  const WorldHeader({super.key, required this.student});
  final StudentProgress student;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
    child: LayoutBuilder(
      builder: (context, box) => Wrap(
        alignment: WrapAlignment.spaceBetween,
        crossAxisAlignment: WrapCrossAlignment.center,
        spacing: 24,
        runSpacing: 12,
        children: [
          const Text(
            'BILIMVERSE',
            style: TextStyle(
              fontSize: 22,
              letterSpacing: 2,
              fontWeight: FontWeight.w700,
            ),
          ),
          if (box.maxWidth > 700)
            Wrap(
              spacing: 12,
              children: [
                TextButton(
                  onPressed: () => context.go('/world'),
                  child: const Text('Менің әлемім'),
                ),
                TextButton(
                  onPressed: () => context.push('/subject/math'),
                  child: const Text('Миссиялар'),
                ),
                TextButton(
                  onPressed: () => context.push('/my-world'),
                  child: const Text('Менің әлемім'),
                ),
                TextButton(
                  onPressed: () => context.push('/adventure'),
                  child: const Text('Оқиғалы саяхат'),
                ),
                TextButton(
                  onPressed: () => context.push('/homework'),
                  child: const Text('Үй тапсырмасы'),
                ),
                TextButton(
                  onPressed: () => context.push('/teacher'),
                  child: const Text('Мұғалім'),
                ),
              ],
            ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              StudentAvatar(avatar: student.avatar, size: 42),
              const SizedBox(width: 10),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 130),
                child: Text(
                  student.name,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: GameColors.turquoise,
                  ),
                ),
              ),
              IconButton(
                tooltip: 'Баптаулар',
                onPressed: () => context.push('/settings'),
                constraints: const BoxConstraints(minWidth: 56, minHeight: 56),
                icon: const Icon(Icons.tune_rounded),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}
