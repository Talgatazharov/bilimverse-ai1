import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../config/game_rules.dart';
import '../../theme/game_colors.dart';
import '../../widgets/game_button.dart';
import '../../widgets/qyran.dart';
import '../../widgets/shanyrak_portal.dart';

class RewardView extends StatelessWidget {
  const RewardView({
    super.key,
    required this.xp,
    required this.stars,
    required this.replay,
    required this.levelUp,
  });
  final int xp;
  final int stars;
  final bool replay;
  final bool levelUp;
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: GameColors.navy,
    body: SafeArea(
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(28),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600),
            child: Column(
              children: [
                const ShanyrakPortal(size: 150),
                Text(
                  'МИССИЯ ОРЫНДАЛДЫ!',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineMedium!
                      .copyWith(color: GameColors.gold),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    for (var i = 0; i < 3; i++)
                      Icon(
                        i < stars
                            ? Icons.star_rounded
                            : Icons.star_outline_rounded,
                        color: GameColors.gold,
                        size: 48,
                      ),
                  ],
                ),
                const Qyran(size: 120),
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: 1),
                  duration: MediaQuery.disableAnimationsOf(context)
                      ? Duration.zero
                      : const Duration(milliseconds: 800),
                  builder: (context, value, _) => Transform.translate(
                    offset: Offset(0, 20 * (1 - value)),
                    child: Opacity(
                      opacity: value,
                      child: Text(
                        '+$xp XP  ·  +${replay ? 0 : GameRules.missionCurrency} Тұмар',
                        style: const TextStyle(
                          fontSize: 24,
                          color: GameColors.cream,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                if (levelUp)
                  const Text(
                    'ЖАҢА ДЕҢГЕЙ АШЫЛДЫ!',
                    style: TextStyle(
                      color: GameColors.gold,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                const SizedBox(height: 12),
                Text(
                  replay ? 'Біліміңді бекіттің! Үздік жұлдыздарың сақталды.' : 'Прогресің сақталды. Әлеміңе оралып, саяхатты жалғастыр!',
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: GameColors.sky),
                ),
                const SizedBox(height: 32),
                GameButton(
                  label: 'Әлемге оралу',
                  onPressed: () => context.go('/world'),
                ),
                const SizedBox(height: 16),
                GameButton(
                  label: 'Келесі миссия',
                  secondary: true,
                  onPressed: () => context.go('/world'),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}
