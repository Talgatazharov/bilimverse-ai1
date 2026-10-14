import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../models/local_assignment.dart';

class HomeworkScreen extends ConsumerWidget {
  const HomeworkScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final student = ref.watch(studentProvider).asData?.value;
    return Scaffold(
      appBar: AppBar(title: const Text('Үй тапсырмасы')),
      body: FutureBuilder<List<LocalAssignment>>(
        future: ref.read(assignmentRepositoryProvider).load(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return const Center(child: Text('Тапсырмалар ашылмады.'));
          }
          if (student == null || !snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }
          final items = snapshot.data!
              .where((item) => item.grade == student.grade)
              .toList();
          if (items.isEmpty) {
            return const Center(
              child: Text('Бұл сыныпқа үй тапсырмасы берілмеген.'),
            );
          }
          return Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 800),
              child: ListView.builder(
                padding: const EdgeInsets.all(24),
                itemCount: items.length,
                itemBuilder: (context, index) {
                  final item = items[index];
                  final done = student.completedAssignments.contains(item.id);
                  return Card(
                    child: ListTile(
                      title: Text(item.title),
                      subtitle: Text(done ? 'Орындалды' : 'Орындалмаған'),
                      trailing: Icon(
                        done ? Icons.check_circle : Icons.play_arrow,
                      ),
                      onTap: () => context.push(
                        '/mission/${item.missionId}?assignment=${Uri.encodeComponent(item.id)}',
                      ),
                    ),
                  );
                },
              ),
            ),
          );
        },
      ),
    );
  }
}
