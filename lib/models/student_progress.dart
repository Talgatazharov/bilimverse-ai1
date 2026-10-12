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
    this.settings = const GameSettings(),
    this.lastStudyDate,
    this.onboardingComplete = false,
    this.avatar = 'explorer',
  }) : stars = Map.unmodifiable(stars),
       achievements = Set.unmodifiable(achievements),
       worldUnlocks = Set.unmodifiable(worldUnlocks);
  final String name;
  final int grade;
  final int xp;
  final int streak;
  final int currency;
  final Map<String, int> stars;
  final Set<String> achievements;
  final Set<String> worldUnlocks;
  final GameSettings settings;
  final String? lastStudyDate;
  final bool onboardingComplete;
  final String avatar;
  Set<String> get completedMissions => stars.keys.toSet();
  StudentProgress copyWith({
    GameSettings? settings,
    String? name,
    int? grade,
    String? avatar,
    bool? onboardingComplete,
    int? xp,
    int? currency,
    Map<String, int>? stars,
    Set<String>? worldUnlocks,
  }) => StudentProgress(
    name: name ?? this.name,
    grade: grade ?? this.grade,
    xp: xp ?? this.xp,
    streak: streak,
    currency: currency ?? this.currency,
    stars: stars ?? this.stars,
    achievements: achievements,
    worldUnlocks: worldUnlocks ?? this.worldUnlocks,
    settings: settings ?? this.settings,
    lastStudyDate: lastStudyDate,
    avatar: avatar ?? this.avatar,
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
    'settings': settings.toJson(),
    'lastStudyDate': lastStudyDate,
    'avatar': avatar,
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
    if (grade < 1 ||
        grade > 4 ||
        xp < 0 ||
        currency < 0 ||
        streak < 0 ||
        stars.values.any((v) => v < 1 || v > 3)) {
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
      settings: GameSettings.fromJson(
        Map<String, dynamic>.from(json['settings'] as Map),
      ),
      lastStudyDate: json['lastStudyDate'] as String?,
      avatar: json['avatar'] as String? ?? 'explorer',
      onboardingComplete: json['onboardingComplete'] as bool? ?? false,
    );
  }
}
