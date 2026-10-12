enum Subject {
  math,
  kazakh,
  literature,
  science,
  worldKnowledge,
  english,
  digital,
}

enum QuestionType {
  multipleChoice,
  dragDrop,
  matching,
  ordering,
  wordBuilder,
  sentenceBuilder,
  trueFalse,
  imageChoice,
  listenChoice,
  speak,
  maze,
  memory,
  puzzle,
}

enum Difficulty { easy, normal, hard }

class Question {
  const Question({
    required this.id,
    required this.subject,
    required this.topic,
    required this.grade,
    required this.type,
    required this.question,
    required this.options,
    required this.correctAnswer,
    required this.hint,
    required this.explanation,
    required this.difficulty,
    required this.xp,
    this.asset,
  });
  final String id;
  final Subject subject;
  final String topic;
  final int grade;
  final QuestionType type;
  final String question;
  final List<String> options;
  final String correctAnswer;
  final String hint;
  final String explanation;
  final Difficulty difficulty;
  final int xp;
  final String? asset;
}

class Mission {
  const Mission({
    required this.id,
    required this.title,
    required this.subject,
    required this.questionIds,
    this.unlocks = const [],
  });
  final String id;
  final String title;
  final Subject subject;
  final List<String> questionIds;
  final List<String> unlocks;
}
