import 'package:bilimai/repositories/local_progress_repository.dart';

class MemoryStore implements LocalStore {
  final values = <String, String>{};
  bool failWrites = false;
  @override
  Future<String?> read(String key) async => values[key];
  @override
  Future<void> write(String key, String value) async {
    if (failWrites) throw StateError('Disk unavailable');
    values[key] = value;
  }
}
