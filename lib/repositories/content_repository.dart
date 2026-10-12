import '../models/question.dart';

abstract interface class ContentRepository {
  Future<List<Mission>> missionsFor(Subject subject, int grade);
  Future<List<Question>> questionsFor(String missionId);
}
