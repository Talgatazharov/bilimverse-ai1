import 'game_settings.dart';

/// Level and pet stage are derived from XP by GameRules to prevent drift.
class StudentProgress {
  StudentProgress({
    required this.name,
    required this.grade,
    required this.xp,
    required this.streak,
    required this.currency,
    Map<String, int> stars = const {},
    Set<String> achievements = const {},
    Set<String> worldUnlocks = const {},
    Map<String, int> topicAttempts = const {},
    Map<String, int> topicCorrect = const {},
    Set<String> completedAssignments = const {},
    this.settings = const GameSettings(),
    this.lastStudyDate,
    this.onboardingComplete = false,
    this.avatar = 'explorer',
    this.petKind = 'qyran',
  }) : stars = Map.unmodifiable(stars),
       achievements = Set.unmodifiable(achievements),
       worldUnlocks = Set.unmodifiable(worldUnlocks),
       topicAttempts = Map.unmodifiable(topicAttempts),
       topicCorrect = Map.unmodifiable(topicCorrect),
       completedAssignments = Set.unmodifiable(completedAssignments);
  final String name;
  final int grade;
  final int xp;
  final int streak;
  final int currency;
  final Map<String, int> stars;
  final Set<String> achievements;
  final Set<String> worldUnlocks;
  final Map<String, int> topicAttempts;
  final Map<String, int> topicCorrect;
  final Set<String> completedAssignments;
  final GameSettings settings;
  final String? lastStudyDate;
  final bool onboardingComplete;
  final String avatar;
  final String petKind;
  Set<String> get completedMissions => stars.keys.toSet();
  StudentProgress copyWith({
    GameSettings? settings,
    String? name,
    int? grade,
    String? avatar,
    String? petKind,
    bool? onboardingComplete,
    int? xp,
    int? currency,
    int? streak,
    String? lastStudyDate,
    Set<String>? achievements,
    Map<String, int>? stars,
    Set<String>? worldUnlocks,
    Map<String, int>? topicAttempts,
    Map<String, int>? topicCorrect,
    Set<String>? completedAssignments,
  }) => StudentProgress(
    name: name ?? this.name,
    grade: grade ?? this.grade,
    xp: xp ?? this.xp,
    streak: streak ?? this.streak,
    currency: currency ?? this.currency,
    stars: stars ?? this.stars,
    achievements: achievements ?? this.achievements,
    worldUnlocks: worldUnlocks ?? this.worldUnlocks,
    topicAttempts: topicAttempts ?? this.topicAttempts,
    topicCorrect: topicCorrect ?? this.topicCorrect,
    completedAssignments: completedAssignments ?? this.completedAssignments,
    settings: settings ?? this.settings,
    lastStudyDate: lastStudyDate ?? this.lastStudyDate,
    avatar: avatar ?? this.avatar,
    petKind: petKind ?? this.petKind,
    onboardingComplete: onboardingComplete ?? this.onboardingComplete,
  );
  Map<String, dynamic> toJson() => {
    'schemaVersion': 1,
    'name': name,
    'grade': grade,
    'xp': xp,
    'streak': streak,
    'currency': currency,
    'stars': stars,
    'achievements': achievements.toList(),
    'worldUnlocks': worldUnlocks.toList(),
    'topicAttempts': topicAttempts,
    'topicCorrect': topicCorrect,
    'completedAssignments': completedAssignments.toList(),
    'settings': settings.toJson(),
    'lastStudyDate': lastStudyDate,
    'avatar': avatar,
    'petKind': petKind,
    'onboardingComplete': onboardingComplete,
  };
  factory StudentProgress.fromJson(Map<String, dynamic> json) {
    if (json['schemaVersion'] != 1) {
      throw const FormatException('Unsupported schema');
    }
    final grade = json['grade'] as int;
    final xp = json['xp'] as int;
    final currency = json['currency'] as int;
    final streak = json['streak'] as int;
    final stars = Map<String, int>.from(json['stars'] as Map);
    final topicAttempts = Map<String, int>.from(
      json['topicAttempts'] as Map? ?? {},
    );
    final topicCorrect = Map<String, int>.from(
      json['topicCorrect'] as Map? ?? {},
    );
    if (grade < 1 ||
        grade > 4 ||
        xp < 0 ||
        currency < 0 ||
        streak < 0 ||
        stars.values.any((v) => v < 1 || v > 3) ||
        topicAttempts.values.any((v) => v <= 0) ||
        topicCorrect.entries.any(
          (e) => e.value < 0 || e.value > (topicAttempts[e.key] ?? 0),
        )) {
      throw const FormatException('Invalid progress values');
    }
    return StudentProgress(
      name: json['name'] as String,
      grade: grade,
      xp: xp,
      currency: currency,
      streak: streak,
      stars: stars,
      achievements: Set<String>.from(json['achievements'] as List),
      worldUnlocks: Set<String>.from(json['worldUnlocks'] as List),
      topicAttempts: topicAttempts,
      topicCorrect: topicCorrect,
      completedAssignments: Set<String>.from(
        json['completedAssignments'] as List? ?? [],
      ),
      settings: GameSettings.fromJson(
        Map<String, dynamic>.from(json['settings'] as Map),
      ),
      lastStudyDate: json['lastStudyDate'] as String?,
      avatar: json['avatar'] as String? ?? 'explorer',
      petKind: json['petKind'] as String? ?? 'qyran',
      onboardingComplete: json['onboardingComplete'] as bool? ?? false,
    );
  }
}
