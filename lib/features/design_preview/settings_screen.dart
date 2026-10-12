import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../models/game_settings.dart';
import '../../theme/game_colors.dart';
import '../../theme/game_theme.dart';
import '../../widgets/game_button.dart';
import '../../widgets/game_status.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});
  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _saving = false;
  String? _feedback;
  Future<void> _save(GameSettings settings) async {
    setState(() {
      _saving = true;
      _feedback = null;
    });
    final saved = await ref
        .read(studentProvider.notifier)
        .updateSettings(settings);
    if (!mounted) return;
    setState(() {
      _saving = false;
      _feedback = saved ? 'Баптау сақталды.' : 'Сақталмады. Қайта көрейік!';
    });
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: ref
          .watch(studentProvider)
          .when(
            loading: () => const GameStatus(),
            error: (_, _) => GameStatus(
              message: 'Баптаулар ашылмады. Қайта көрейік!',
              onRetry: () => ref.invalidate(studentProvider),
            ),
            data: (student) => Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(
                  maxWidth: GameLayout.contentWidth,
                ),
                child: ListView(
                  padding: const EdgeInsets.all(24),
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: IconButton(
                        tooltip: 'Артқа',
                        constraints: const BoxConstraints(
                          minWidth: 56,
                          minHeight: 56,
                        ),
                        onPressed: () => context.canPop()
                            ? context.pop()
                            : context.go('/world'),
                        icon: const Icon(Icons.arrow_back_rounded),
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Өзіңе ыңғайлы\nсаяхат',
                      style: Theme.of(context).textTheme.displaySmall,
                    ),
                    const SizedBox(height: 16),
                    const Text('Дыбыс пен қозғалысты өз қалауыңша ретте.'),
                    const SizedBox(height: 32),
                    _Setting(
                      label: 'Қозғалысты азайту',
                      detail: 'Анимацияларды тыныштандыру',
                      value: student.settings.reduceMotion,
                      enabled: !_saving,
                      onTap: () => _save(
                        student.settings.copyWith(
                          reduceMotion: !student.settings.reduceMotion,
                        ),
                      ),
                    ),
                    _Setting(
                      label: 'Музыка',
                      detail: 'Даланың әуені',
                      value: student.settings.music,
                      enabled: !_saving,
                      onTap: () => _save(
                        student.settings.copyWith(
                          music: !student.settings.music,
                        ),
                      ),
                    ),
                    _Setting(
                      label: 'Ойын дыбыстары',
                      detail: 'Батырмалар мен жетістіктер',
                      value: student.settings.sfx,
                      enabled: !_saving,
                      onTap: () => _save(
                        student.settings.copyWith(sfx: !student.settings.sfx),
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Demo нұсқасында дыбыс файлдары әлі қосылмаған. Таңдауың сақталады.',
                    ),
                    if (_feedback != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 16),
                        child: Semantics(
                          liveRegion: true,
                          child: Text(_feedback!),
                        ),
                      ),
                    const SizedBox(height: 32),
                    GameButton(
                      label: 'Дайын',
                      onPressed: () => context.canPop()
                          ? context.pop()
                          : context.go('/world'),
                    ),
                  ],
                ),
              ),
            ),
          ),
    ),
  );
}

class _Setting extends StatelessWidget {
  const _Setting({
    required this.label,
    required this.detail,
    required this.value,
    required this.onTap,
    required this.enabled,
  });
  final String label;
  final String detail;
  final bool value;
  final bool enabled;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Semantics(
    toggled: value,
    label: label,
    enabled: enabled,
    child: Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: enabled ? onTap : null,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(label, style: Theme.of(context).textTheme.titleMedium),
                    Text(detail),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Container(
                width: 56,
                height: 36,
                decoration: BoxDecoration(
                  color: value ? GameColors.turquoise : GameColors.sand,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  value ? Icons.check_rounded : Icons.remove_rounded,
                  color: value ? GameColors.cream : GameColors.navy,
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
