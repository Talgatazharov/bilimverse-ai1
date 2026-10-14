import 'dart:convert';

import '../models/local_assignment.dart';
import 'local_progress_repository.dart';

class LocalAssignmentRepository {
  const LocalAssignmentRepository(this.store);
  final LocalStore store;
  static const storageKey = 'bilimverse.assignments.v1';

  Future<List<LocalAssignment>> load() async {
    final raw = await store.read(storageKey);
    if (raw == null) return const [];
    final data = jsonDecode(raw) as List;
    return [
      for (final item in data)
        LocalAssignment.fromJson(Map<String, dynamic>.from(item as Map)),
    ];
  }

  Future<void> add(LocalAssignment assignment) async {
    final assignments = await load();
    if (assignments.any((item) => item.id == assignment.id)) {
      throw const FormatException('Duplicate assignment');
    }
    await store.write(
      storageKey,
      jsonEncode(
        [...assignments, assignment].map((item) => item.toJson()).toList(),
      ),
    );
  }
}
