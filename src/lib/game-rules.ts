import { PetStage } from "@/types";

export const GAME_RULES = {
  xpPerLevel: 200,
  missionCurrency: 15,
  bossCurrency: 25,
  rewards: {
    simple: 10,
    normal: 20,
    hard: 30,
    mission: 50,
    boss: 100,
    perfectBonus: 25,
    streakDaily: 15,
  },
  levelFor(xp: number): number {
    return Math.floor(xp / this.xpPerLevel) + 1;
  },
  levelProgress(xp: number): { current: number; max: number; percent: number } {
    const current = xp % this.xpPerLevel;
    return {
      current,
      max: this.xpPerLevel,
      percent: Math.round((current / this.xpPerLevel) * 100),
    };
  },
  titleFor(level: number): string {
    if (level >= 50) return "Білім сақшысы";
    if (level >= 30) return "Жас ғалым";
    if (level >= 20) return "Білгір";
    if (level >= 10) return "Зерек";
    if (level >= 5) return "Ізденуші";
    return "Балапан";
  },
  petStageFor(level: number): PetStage {
    if (level >= 50) return "legendary";
    if (level >= 20) return "guardian";
    if (level >= 5) return "explorer";
    if (level >= 2) return "baby";
    return "egg";
  },
  petTitle(stage: PetStage): string {
    switch (stage) {
      case "legendary":
        return "Аңызға айналған Қыран";
      case "guardian":
        return "Сақшы Қыран";
      case "explorer":
        return "Зерттеуші Қыран";
      case "baby":
        return "Балапан Қыран";
      case "egg":
        return "Алтын жұмыртқа";
    }
  },
};
