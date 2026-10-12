import 'package:flutter/material.dart';

import 'game_button.dart';
import 'shanyrak_portal.dart';

class GameStatus extends StatelessWidget {
  const GameStatus({
    super.key,
    this.message = 'Білім әлемі ашылуда...',
    this.onRetry,
    this.actionLabel = 'Қайта көру',
  });
  final String message;
  final VoidCallback? onRetry;
  final String actionLabel;
  @override
  Widget build(BuildContext context) => Center(
    child: SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const ShanyrakPortal(),
          Text(message, textAlign: TextAlign.center),
          if (onRetry != null) ...[
            const SizedBox(height: 24),
            GameButton(label: actionLabel, onPressed: onRetry),
          ],
        ],
      ),
    ),
  );
}
