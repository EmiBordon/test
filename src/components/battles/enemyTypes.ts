import { DefeatEvent } from "./types";

export type EnemyPhase = {
  threshold: number; // % de la salud (por ejemplo: 0.8 significa health / 1.25)
  damage: number;
  drawBarLevels: number;
  drawBarDuration: number;
  moonTearPattern: number;
  moonTearDifficulty: number;
  gridLength: number;
  gridDelay: number;
  dialogue?: string;
};

export type Enemy = {
  name: string;
  health: number;
  initialdamage: number;
  victoryMessage: string;
  defeatMessage: string;
  arrowsRequired: number;
  description?: string;
  icon: React.ElementType;
  onDefeatCallbacks?: DefeatEvent[];
  phases: EnemyPhase[];
};
