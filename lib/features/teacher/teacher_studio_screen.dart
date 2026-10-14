import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../app/providers.dart';
import '../../data/local_curriculum_repository.dart';
import '../../models/local_assignment.dart';
import '../../models/question.dart';

class TeacherStudioScreen extends ConsumerStatefulWidget {
  const TeacherStudioScreen({super.key});

  @override
  ConsumerState<TeacherStudioScreen> createState() => _TeacherStudioState();
}

class _TeacherStudioState extends ConsumerState<TeacherStudioScreen> {
  final _title = TextEditingController();
  int _grade = 3;
  Subject _subject = Subject.math;
  Mission? _mission;
  List<Question> _questions = const [];
  bool _busy = false;
  String? _message;
  late Future<List<LocalAssignment>> _assignments;

  @override
  void initState() {
    super.initState();
    _assignments = ref.read(assignmentRepositoryProvider).load();
  }

  @override
  void dispose() {
    _title.dispose();
    super.dispose();
  }

  Future<void> _prepare() async {
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      final content = ref.read(contentRepositoryProvider);
      final missions = await content.missionsFor(_subject, _grade);
      if (missions.isEmpty) throw const FormatException('No local mission');
      final questions = await content.questionsFor(missions.first.id);
      if (!mounted) return;
      _title.text = missions.first.title;
      setState(() {
        _mission = missions.first;
        _questions = questions;
      });
    } catch (_) {
      if (mounted) {
        setState(() => _message = 'Тапсырманы дайындау мүмкін болмады.');
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _assign() async {
    final mission = _mission;
    if (mission == null || _title.text.trim().isEmpty) return;
    setState(() => _busy = true);
    try {
      await ref
          .read(assignmentRepositoryProvider)
          .add(
            LocalAssignment(
              id: DateTime.now().microsecondsSinceEpoch.toString(),
              title: _title.text.trim(),
              grade: _grade,
              missionId: mission.id,
              subject: _subject.name,
            ),
          );
      if (!mounted) return;
      setState(() {
        _message = 'Үй тапсырмасы осы браузерде сақталды.';
        _assignments = ref.read(assignmentRepositoryProvider).load();
      });
    } catch (_) {
      if (mounted) setState(() => _message = 'Үй тапсырмасы сақталмады.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final student = ref.watch(studentProvider).asData?.value;
    return Scaffold(
      appBar: AppBar(title: const Text('Teacher Studio · жергілікті нұсқа')),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 900),
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              Text(
                'Сынып және оқушы',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              Text(
                student == null
                    ? 'Оқушы жүктелуде...'
                    : '${student.grade}-сынып · ${student.name} · ${student.completedMissions.length} миссия',
              ),
              const SizedBox(height: 20),
              Text(
                'Тапсырма дайындау',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              const Text(
                'Пән мен сыныпты таңдаңыз. Жүйе жергілікті тапсырмалар жинағынан миссия ұсынады.',
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<int>(
                initialValue: _grade,
                decoration: const InputDecoration(labelText: 'Сынып'),
                items: [
                  for (var grade = 1; grade <= 4; grade++)
                    DropdownMenuItem(value: grade, child: Text('$grade-сынып')),
                ],
                onChanged: _busy
                    ? null
                    : (grade) => setState(() {
                        _grade = grade!;
                        _mission = null;
                      }),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<Subject>(
                initialValue: _subject,
                decoration: const InputDecoration(labelText: 'Пән'),
                items: [
                  for (final subject in Subject.values.where(
                    (s) => s != Subject.adventure,
                  ))
                    DropdownMenuItem(
                      value: subject,
                      child: Text(LocalCurriculumRepository.names[subject]!),
                    ),
                ],
                onChanged: _busy
                    ? null
                    : (subject) => setState(() {
                        _subject = subject!;
                        _mission = null;
                      }),
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: _busy ? null : _prepare,
                child: const Text('Миссияны дайындау'),
              ),
              if (_mission != null) ...[
                const SizedBox(height: 20),
                TextField(
                  controller: _title,
                  maxLength: 80,
                  decoration: const InputDecoration(
                    labelText: 'Тапсырма атауы',
                  ),
                ),
                for (var i = 0; i < _questions.length; i++)
                  ListTile(
                    leading: CircleAvatar(child: Text('${i + 1}')),
                    title: Text(_questions[i].question),
                    subtitle: Text('Тақырып: ${_questions[i].topic}'),
                  ),
                const SizedBox(height: 12),
                FilledButton.icon(
                  onPressed: _busy ? null : _assign,
                  icon: const Icon(Icons.send_rounded),
                  label: const Text('Үй тапсырмасы ретінде беру'),
                ),
              ],
              if (_message != null)
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Text(_message!),
                ),
              const SizedBox(height: 28),
              Text(
                'Берілген тапсырмалар',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              FutureBuilder<List<LocalAssignment>>(
                future: _assignments,
                builder: (context, snapshot) {
                  if (snapshot.hasError) {
                    return const Text('Тапсырмалар ашылмады.');
                  }
                  if (!snapshot.hasData) return const LinearProgressIndicator();
                  if (snapshot.data!.isEmpty) {
                    return const Text('Әзірге тапсырма жоқ.');
                  }
                  return Column(
                    children: [
                      for (final item in snapshot.data!)
                        ListTile(
                          leading: const Icon(Icons.assignment_rounded),
                          title: Text(item.title),
                          subtitle: Text(
                            '${item.grade}-сынып · ${item.subject}',
                          ),
                          trailing: Icon(
                            student?.completedAssignments.contains(item.id) ==
                                    true
                                ? Icons.check_circle_rounded
                                : Icons.pending_outlined,
                          ),
                        ),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
