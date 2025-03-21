// src/data/enemyTypes.ts

export type EnemyPhase = {
    threshold: number; // % de la salud (por ejemplo: 0.8 significa health / 1.25)
    damage: number;
    drawBarLevels: number;
    drawBarDuration: number;
    moonTearPattern: number;
    moonTearDifficulty: number;
    gridLength: number;
  };
  
  export type Enemy = {
    name: string;
    health: number;
    victoryMessage: string;
    defeatMessage: string;
    arrowsRequired: number;
    phases: EnemyPhase[];
  };
  