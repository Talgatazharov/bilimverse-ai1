import 'question.dart';

class StudentLearningProfile {
  const StudentLearningProfile({
    required this.grade,
    this.subjectProgress = const {},
    this.topicMastery = const {},
    this.commonErrors = const {},
    this.difficultyLevel = Difficulty.normal,
    this.recentResults = const [],
    this.strongTopics = const [],
    this.weakTopics = const [],
    this.preferredActivityTypes = const [],
  });
  final int grade;
  final Map<Subject, double> subjectProgress;
  final Map<String, double> topicMastery;
  final Map<String, int> commonErrors;
  final Difficulty difficultyLevel;
  final List<bool> recentResults;
  final List<String> strongTopics;
  final List<String> weakTopics;
  final List<QuestionType> preferredActivityTypes;
}

abstract interface class AdaptiveLearningService {
  Difficulty recommend(StudentLearningProfile profile);
}

class LocalAdaptiveLearning implements AdaptiveLearningService {
  const LocalAdaptiveLearning();
  @override
  Difficulty recommend(StudentLearningProfile profile) {
    if (profile.recentResults.isEmpty) return profile.difficultyLevel;
    final accuracy =
        profile.recentResults.where((r) => r).length /
        profile.recentResults.length;
    return accuracy < .5
        ? Difficulty.easy
        : accuracy <= .8
        ? Difficulty.normal
        : Difficulty.hard;
  }
}
