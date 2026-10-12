class GameSettings {
  const GameSettings({
    this.music = true,
    this.sfx = true,
    this.reduceMotion = false,
  });
  final bool music;
  final bool sfx;
  final bool reduceMotion;
  GameSettings copyWith({bool? music, bool? sfx, bool? reduceMotion}) =>
      GameSettings(
        music: music ?? this.music,
        sfx: sfx ?? this.sfx,
        reduceMotion: reduceMotion ?? this.reduceMotion,
      );
  Map<String, dynamic> toJson() => {
    'music': music,
    'sfx': sfx,
    'reduceMotion': reduceMotion,
  };
  factory GameSettings.fromJson(Map<String, dynamic> json) => GameSettings(
    music: json['music'] as bool? ?? true,
    sfx: json['sfx'] as bool? ?? true,
    reduceMotion: json['reduceMotion'] as bool? ?? false,
  );
}
