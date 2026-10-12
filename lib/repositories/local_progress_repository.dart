import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../data/demo_student.dart';
import '../models/student_progress.dart';
import 'progress_repository.dart';

abstract interface class LocalStore {
  Future<String?> read(String key);
  Future<void> write(String key, String value);
}

class PreferencesStore implements LocalStore {
  PreferencesStore(this.preferences);
  final SharedPreferencesAsync preferences;
  @override
  Future<String?> read(String key) => preferences.getString(key);
  @override
  Future<void> write(String key, String value) =>
      preferences.setString(key, value);
}

class LocalProgressRepository implements ProgressRepository {
  LocalProgressRepository(this.store);
  static const storageKey = 'bilimverse.progress.v1';
  final LocalStore store;
  @override
  Future<StudentProgress> load() async {
    final raw = await store.read(storageKey);
    if (raw == null) {
      final initial = createDemoStudent();
      await save(initial);
      return initial;
    }
    // Preserve unreadable saves for recovery rather than overwriting progress.
    return StudentProgress.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  @override
  Future<void> save(StudentProgress progress) =>
      store.write(storageKey, jsonEncode(progress.toJson()));
}
