import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../theme/game_colors.dart';
import '../../widgets/game_button.dart';
import '../../widgets/game_status.dart';
import '../../widgets/qyran.dart';
import '../../widgets/student_avatar.dart';
import '../../widgets/shanyrak_portal.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});
  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingState();
}

class _OnboardingState extends ConsumerState<OnboardingScreen> {
  final _name = TextEditingController();
  int _step = 0;
  int _grade = 3;
  String _avatar = 'explorer';
  bool _saving = false;
  String? _error;
  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _next() async {
    if (_step == 0 && _name.text.trim().isEmpty) {
      setState(() => _error = 'Атыңды жазып көр.');
      return;
    }
    if (_step < 4) {
      setState(() {
        _step++;
        _error = null;
      });
      return;
    }
    setState(() => _saving = true);
    final saved = await ref
        .read(studentProvider.notifier)
        .completeOnboarding(name: _name.text, grade: _grade, avatar: _avatar);
    if (!mounted) return;
    if (saved) {
      context.go('/world');
    } else {
      setState(() {
        _saving = false;
        _error = 'Сақталмады. Тағы көрейік!';
      });
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: ref
          .watch(studentProvider)
          .when(
            loading: () => const GameStatus(),
            error: (_, _) => GameStatus(
              message: 'Әлемің ашылмады. Қайта көрейік!',
              onRetry: () => ref.invalidate(studentProvider),
            ),
            data: (_) => Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 640),
                child: ListView(
                  padding: const EdgeInsets.all(32),
                  shrinkWrap: true,
                  children: [
                    const Text(
                      'BILIMVERSE / БІЛІМ ӘЛЕМІ',
                      style: TextStyle(
                        letterSpacing: 2,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 32),
                    Text(
                      '${_step + 1} / 5  ·  САЯХАТҚА ДАЙЫНДЫҚ',
                      style: const TextStyle(color: GameColors.turquoise),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      [
                        'Атың кім?',
                        'Қай сыныпта оқисың?',
                        'Кейіпкеріңді таңда.',
                        'Серігіңмен таныс!',
                        'Алғашқы әлемің дайын!',
                      ][_step],
                      style: Theme.of(context).textTheme.displaySmall,
                    ),
                    const SizedBox(height: 28),
                    if (_step == 0) ...[
                      const Text('Бұл әлемде сені қалай атаймыз?'),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _name,
                        maxLength: 24,
                        textInputAction: TextInputAction.next,
                        onSubmitted: (_) => _next(),
                        decoration: const InputDecoration(
                          labelText: 'Есімің',
                          hintText: 'Мысалы, Аян',
                          filled: true,
                          fillColor: GameColors.sand,
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ],
                    if (_step == 1)
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          for (var i = 1; i <= 4; i++)
                            _Choice(
                              label: '$i-сынып',
                              selected: _grade == i,
                              onTap: () => setState(() => _grade = i),
                            ),
                        ],
                      ),
                    if (_step == 2)
                      Wrap(
                        spacing: 24,
                        runSpacing: 16,
                        children: [
                          for (final entry in [
                            ('explorer', 'Саяхатшы'),
                            ('inventor', 'Өнертапқыш'),
                          ])
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                StudentAvatar(avatar: entry.$1, size: 128),
                                const SizedBox(height: 12),
                                _Choice(
                                  label: entry.$2,
                                  selected: _avatar == entry.$1,
                                  onTap: () =>
                                      setState(() => _avatar = entry.$1),
                                ),
                              ],
                            ),
                        ],
                      ),
                    if (_step == 3)
                      const Column(
                        children: [
                          Qyran(size: 160),
                          SizedBox(height: 16),
                          Text(
                            'Мен Қыранмын! Бірге есептің сырын ашып, жаңа жерлерді зерттейміз.',
                            textAlign: TextAlign.center,
                          ),
                          SizedBox(height: 12),
                          Text(
                            'Алғашқы серігің — Қыран. Басқа серіктер кейін қосылады.',
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    if (_step == 4)
                      const Column(
                        children: [
                          ShanyrakPortal(size: 160),
                          Text(
                            'Бір киіз үй. Бір ағаш. Алда — үлкен саяхат.',
                            textAlign: TextAlign.center,
                          ),
                          SizedBox(height: 12),
                          Text(
                            'Demo әлемінде Аянның бастапқы прогресін пайдаланып көресің.',
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    if (_error != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 16),
                        child: Semantics(
                          liveRegion: true,
                          child: Text(_error!),
                        ),
                      ),
                    const SizedBox(height: 32),
                    GameButton(
                      label: _saving
                          ? 'Сақталуда...'
                          : _step == 4
                          ? 'Әлемге кір'
                          : 'Жалғастыру',
                      onPressed: _saving ? null : _next,
                    ),
                    if (_step > 0)
                      TextButton(
                        onPressed: _saving
                            ? null
                            : () => setState(() {
                                _step--;
                                _error = null;
                              }),
                        child: const Text('Артқа'),
                      ),
                    TextButton(
                      onPressed: _saving ? null : () => context.go('/world'),
                      child: const Text('Әзірге demo әлемін көру'),
                    ),
                  ],
                ),
              ),
            ),
          ),
    ),
  );
}

class _Choice extends StatelessWidget {
  const _Choice({
    required this.label,
    required this.selected,
    required this.onTap,
  });
  final String label;
  final bool selected;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Semantics(
    selected: selected,
    child: OutlinedButton(
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(112, 60),
        backgroundColor: selected ? GameColors.turquoise : GameColors.cream,
        foregroundColor: selected ? GameColors.cream : GameColors.navy,
        side: BorderSide(
          color: selected ? GameColors.turquoise : GameColors.sand,
          width: 2,
        ),
      ),
      onPressed: onTap,
      child: Text(label),
    ),
  );
}
