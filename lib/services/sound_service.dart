import '../models/game_settings.dart';

enum SoundEvent {
  buttonTap,
  correct,
  incorrect,
  xpGain,
  levelUp,
  chestOpen,
  missionComplete,
  worldUnlock,
  petReaction,
}

abstract interface class SoundService {
  Future<void> play(SoundEvent event);
  Future<void> applySettings(GameSettings settings);
  Future<void> dispose();
}

/// Intentionally silent until licensed audio assets are available.
class SilentSoundService implements SoundService {
  @override
  Future<void> play(SoundEvent event) async {}
  @override
  Future<void> applySettings(GameSettings settings) async {}
  @override
  Future<void> dispose() async {}
}

abstract interface class SpeechService {
  Future<void> speak(String text, {String language = 'kk'});
  Future<String?> listen({String language = 'kk'});
  Future<void> stop();
}
