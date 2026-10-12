enum RewardAction { simple, difficult, mission, boss, dailyQuest, perfect }

enum PetStage { egg, baby, explorer, guardian, legendary }

class GameRules {
  static const missionCurrency = 15;
  const GameRules({
    this.xpPerLevel = 200,
    this.rewards = const {
      RewardAction.simple: 10,
      RewardAction.difficult: 20,
      RewardAction.mission: 50,
      RewardAction.boss: 100,
      RewardAction.dailyQuest: 30,
      RewardAction.perfect: 25,
    },
  }) : assert(xpPerLevel > 0);
  final int xpPerLevel;
  final Map<RewardAction, int> rewards;
  int levelFor(int xp) => 1 + xp ~/ xpPerLevel;
  double levelProgress(int xp) => (xp % xpPerLevel) / xpPerLevel;
  PetStage petFor(int xp) => switch (levelFor(xp)) {
    >= 50 => PetStage.legendary,
    >= 20 => PetStage.guardian,
    >= 5 => PetStage.explorer,
    >= 2 => PetStage.baby,
    _ => PetStage.egg,
  };
  String titleFor(int xp) => switch (levelFor(xp)) {
    >= 50 => 'Білім сақшысы',
    >= 30 => 'Жас ғалым',
    >= 20 => 'Білгір',
    >= 10 => 'Зерек',
    >= 5 => 'Ізденуші',
    _ => 'Балапан',
  };
}
