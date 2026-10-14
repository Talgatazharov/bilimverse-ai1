import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../models/question.dart';
import '../../theme/game_colors.dart';
import '../../widgets/game_button.dart';
import '../../widgets/game_status.dart';
import '../../widgets/qyran.dart';
import '../../widgets/xp_progress.dart';
import 'reward_view.dart';

final missionQuestionsProvider = FutureProvider.family<List<Question>, String>(
  (ref, id) => ref.watch(contentRepositoryProvider).questionsFor(id),
);

class MissionScreen extends ConsumerStatefulWidget {
  const MissionScreen({super.key, required this.missionId, this.assignmentId});
  final String missionId;
  final String? assignmentId;
  @override
  ConsumerState<MissionScreen> createState() => _MissionState();
}

class _MissionState extends ConsumerState<MissionScreen> {
  int _index = 0;
  int _mistakes = 0;
  final Map<String, int> _topicAttempts = {};
  final Map<String, int> _topicCorrect = {};
  final List<int> _selectedTokens = [];
  bool _answered = false;
  bool _saving = false;
  bool _complete = false;
  bool _replay = false;
  String? _feedback;
  int _xp = 0;
  int _stars = 1;
  int? _previousLevel;
  bool _levelUp = false;

  Future<void> _next(List<Question> questions) async {
    if (_index < questions.length * 2 - 1) {
      setState(() {
        _index++;
        _answered = false;
        _selectedTokens.clear();
        _feedback = null;
      });
      return;
    }
    setState(() => _saving = true);
    final before = ref.read(studentProvider).asData?.value;
    if (before == null) {
      setState(() {
        _saving = false;
        _feedback = 'Прогресс ашылмады. Қайта көрейік.';
      });
      return;
    }
    _replay = before.completedMissions.contains(widget.missionId);
    _previousLevel = ref.read(gameRulesProvider).levelFor(before.xp);
    _stars = _mistakes == 0
        ? 3
        : _mistakes <= 3
        ? 2
        : 1;
    final saved = await ref
        .read(studentProvider.notifier)
        .completeMission(
          widget.missionId,
          _stars,
          topicAttempts: _topicAttempts,
          topicCorrect: _topicCorrect,
          assignmentId: widget.assignmentId,
        );
    if (!mounted) return;
    if (saved) {
      final after = ref.read(studentProvider).requireValue;
      setState(() {
        _xp = after.xp - before.xp;
        _complete = true;
        _saving = false;
        _levelUp =
            ref.read(gameRulesProvider).levelFor(after.xp) > _previousLevel!;
      });
    } else {
      setState(() {
        _saving = false;
        _feedback = 'Сыйлық сақталмады. Қайта сақтап көрейік!';
      });
    }
  }

  void _submitAnswer(Question question, String answer) {
    setState(() {
      _topicAttempts[question.topic] =
          (_topicAttempts[question.topic] ?? 0) + 1;
      if (answer == question.correctAnswer) {
        _topicCorrect[question.topic] =
            (_topicCorrect[question.topic] ?? 0) + 1;
        _answered = true;
        _feedback = 'Жарайсың! ${question.explanation}';
      } else {
        _mistakes++;
        _selectedTokens.clear();
        _feedback = 'Тағы ойланып көрейік! ${question.hint}';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_complete) {
      return RewardView(
        xp: _xp,
        stars: _stars,
        replay: _replay,
        levelUp: _levelUp,
      );
    }
    return Scaffold(
      body: SafeArea(
        child: ref
            .watch(missionQuestionsProvider(widget.missionId))
            .when(
              loading: () => const GameStatus(),
              error: (_, _) => GameStatus(
                message: 'Бұл миссия ашылмады.',
                actionLabel: 'Миссияларға қайту',
                onRetry: () => context.go('/world'),
              ),
              data: (questions) {
                if (questions.isEmpty) {
                  return GameStatus(
                    message: 'Қыран жаңа тапсырмалар дайындап жатыр.',
                    actionLabel: 'Әлемге қайту',
                    onRetry: () => context.go('/world'),
                  );
                }
                final boss = _index >= questions.length;
                final question = questions[_index % questions.length];
                final adventure = widget.missionId.startsWith('adventure-');
                return Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 760),
                    child: ListView(
                      padding: const EdgeInsets.all(28),
                      children: [
                        Align(
                          alignment: Alignment.centerLeft,
                          child: TextButton.icon(
                            onPressed: _saving
                                ? null
                                : () => context.go('/world'),
                            icon: const Icon(Icons.arrow_back_rounded),
                            label: const Text('Миссияларға қайту'),
                          ),
                        ),
                        const SizedBox(height: 16),
                        XpProgress(
                          value: _index / (questions.length * 2),
                          label: boss
                              ? 'ТАС САҚШЫНЫҢ СЫНАҒЫ'
                              : 'АЛТЫН КӨПІР · ${_index + 1} / ${questions.length}',
                        ),
                        const SizedBox(height: 32),
                        if (boss) ...[
                          const Center(
                            child: Icon(
                              Icons.shield_outlined,
                              size: 90,
                              color: GameColors.turquoise,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Сақшы: «Үйренгеніңді бекітейік!»',
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          const SizedBox(height: 12),
                          Wrap(
                            alignment: WrapAlignment.center,
                            spacing: 8,
                            children: [
                              for (var i = 0; i < questions.length; i++)
                                Icon(
                                  Icons.diamond_outlined,
                                  color: i < _index - questions.length
                                      ? GameColors.sand
                                      : GameColors.turquoise,
                                ),
                            ],
                          ),
                        ] else
                          Center(
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                for (var i = 0; i < questions.length; i++)
                                  Container(
                                    width: 34,
                                    height: 20,
                                    margin: const EdgeInsets.all(3),
                                    decoration: BoxDecoration(
                                      color: i < _index
                                          ? GameColors.gold
                                          : GameColors.sand,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        const SizedBox(height: 32),
                        if (adventure) ...[
                          Text(
                            [
                              'Ғарыш кемесіне отын керек. Алдымен есепті шеш.',
                              'Капитанның хатын оқуға көмектес.',
                              'Жаңа ғаламшарды зертте.',
                              'Ғарыштағы ағылшын сөзін таны.',
                              'Роботқа қауіпсіз жол көрсет.',
                            ][_index % questions.length],
                            textAlign: TextAlign.center,
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          const SizedBox(height: 20),
                        ],
                        Text(
                          question.question,
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 28),
                        if (question.type == QuestionType.sentenceBuilder ||
                            question.type == QuestionType.maze) ...[
                          Text(
                            question.type == QuestionType.maze
                                ? 'Роботтың бағытын ретімен таңда:'
                                : 'Сөздерді ретімен таңда:',
                          ),
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              for (final selected in _selectedTokens)
                                InputChip(
                                  label: Text(
                                    question.correctAnswer.split(' ')[selected],
                                  ),
                                  onPressed: _answered
                                      ? null
                                      : () => setState(
                                          () =>
                                              _selectedTokens.remove(selected),
                                        ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              for (final token in List.generate(
                                question.correctAnswer.split(' ').length,
                                (i) => i,
                              ).reversed)
                                if (!_selectedTokens.contains(token))
                                  ActionChip(
                                    label: Text(
                                      question.correctAnswer.split(' ')[token],
                                    ),
                                    onPressed: _answered
                                        ? null
                                        : () => setState(
                                            () => _selectedTokens.add(token),
                                          ),
                                  ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          GameButton(
                            label: 'Тексеру',
                            onPressed:
                                _answered ||
                                    _saving ||
                                    _selectedTokens.length !=
                                        question.correctAnswer.split(' ').length
                                ? null
                                : () => _submitAnswer(
                                    question,
                                    _selectedTokens
                                        .map(
                                          (i) => question.correctAnswer.split(
                                            ' ',
                                          )[i],
                                        )
                                        .join(' '),
                                  ),
                          ),
                        ] else
                          for (final option in question.options)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: GameButton(
                                label: option,
                                icon:
                                    _answered &&
                                        option == question.correctAnswer
                                    ? Icons.check_circle_outline
                                    : Icons.touch_app_outlined,
                                secondary:
                                    !_answered ||
                                    option != question.correctAnswer,
                                onPressed: _answered || _saving
                                    ? null
                                    : () => _submitAnswer(question, option),
                              ),
                            ),
                        if (_feedback != null)
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            child: Semantics(
                              liveRegion: true,
                              child: Text(
                                _feedback!,
                                style: const TextStyle(
                                  color: GameColors.turquoise,
                                ),
                              ),
                            ),
                          ),
                        if (!_answered)
                          TextButton.icon(
                            onPressed: () =>
                                setState(() => _feedback = question.hint),
                            icon: const Icon(Icons.lightbulb_outline),
                            label: const Text('Қыраннан көмек'),
                          ),
                        if (_answered)
                          GameButton(
                            label: _saving
                                ? 'Сақталуда...'
                                : _index == questions.length * 2 - 1
                                ? 'Сыйлықты алу'
                                : 'Келесі қадам',
                            onPressed: _saving ? null : () => _next(questions),
                          ),
                        const SizedBox(height: 24),
                        const Center(child: Qyran(size: 74)),
                      ],
                    ),
                  ),
                );
              },
            ),
      ),
    );
  }
}
