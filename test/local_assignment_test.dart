import 'package:bilimai/models/local_assignment.dart';
import 'package:bilimai/repositories/local_assignment_repository.dart';
import 'package:flutter_test/flutter_test.dart';

import 'support/memory_store.dart';

void main() {
  test('local assignment survives reload and rejects duplicate IDs', () async {
    final store = MemoryStore();
    final repository = LocalAssignmentRepository(store);
    const assignment = LocalAssignment(
      id: 'first',
      title: 'Сандар тапсырмасы',
      grade: 3,
      missionId: 'golden-bridge',
      subject: 'math',
    );
    await repository.add(assignment);
    final restored = await LocalAssignmentRepository(store).load();
    expect(restored.single.toJson(), assignment.toJson());
    await expectLater(repository.add(assignment), throwsFormatException);
    expect((await repository.load()).length, 1);
  });
}
