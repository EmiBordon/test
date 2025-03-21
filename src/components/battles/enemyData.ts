// src/data/enemyData.ts
import { Enemy } from './enemyTypes';

export const enemies: Enemy[] = [
  {
    name: "Germis",
    health: 10,
    victoryMessage: "¡Derrotaste a Germis!",
    defeatMessage: "Germis te venció...",
    arrowsRequired: 3,
    phases: [
      { threshold: 0.8, damage: 10, drawBarLevels: 3, drawBarDuration: 1500, moonTearPattern: 3, moonTearDifficulty: 3, gridLength: 3 },
      { threshold: 0.5, damage: 2, drawBarLevels: 4, drawBarDuration: 1500, moonTearPattern: 3, moonTearDifficulty: 3, gridLength: 4 },
      { threshold: 0.2, damage: 3, drawBarLevels: 5, drawBarDuration: 1500, moonTearPattern: 4, moonTearDifficulty: 3, gridLength: 4 },
      { threshold: 0, damage: 4, drawBarLevels: 6, drawBarDuration: 1500, moonTearPattern: 4, moonTearDifficulty: 3.5, gridLength: 5 },
    ],
  },
  {
    name: "Jox",
    health: 150,
    victoryMessage: "¡Jox ha caído!",
    defeatMessage: "Jox te destruyó...",
    arrowsRequired: 6,
    phases: [
      { threshold: 0.9, damage: 6, drawBarLevels: 1, drawBarDuration: 1100, moonTearPattern: 1, moonTearDifficulty: 1, gridLength: 3 },
      { threshold: 0.6, damage: 10, drawBarLevels: 2, drawBarDuration: 900, moonTearPattern: 2, moonTearDifficulty: 2, gridLength: 4 },
      { threshold: 0.4, damage: 14, drawBarLevels: 3, drawBarDuration: 700, moonTearPattern: 3, moonTearDifficulty: 3, gridLength: 5 },
      { threshold: 0, damage: 20, drawBarLevels: 5, drawBarDuration: 500, moonTearPattern: 4, moonTearDifficulty: 5, gridLength: 6 },
    ],
  },
  {
    name: "Gorjox",
    health: 250,
    victoryMessage: "¡Gorjox no es rival para ti!",
    defeatMessage: "Gorjox te aplastó sin piedad.",
    arrowsRequired: 8,
    phases: [
      { threshold: 0.95, damage: 8, drawBarLevels: 2, drawBarDuration: 1000, moonTearPattern: 1, moonTearDifficulty: 2, gridLength: 4 },
      { threshold: 0.7, damage: 12, drawBarLevels: 3, drawBarDuration: 850, moonTearPattern: 2, moonTearDifficulty: 3, gridLength: 5 },
      { threshold: 0.3, damage: 18, drawBarLevels: 4, drawBarDuration: 700, moonTearPattern: 3, moonTearDifficulty: 4, gridLength: 6 },
      { threshold: 0, damage: 25, drawBarLevels: 5, drawBarDuration: 500, moonTearPattern: 4, moonTearDifficulty: 5, gridLength: 7 },
    ],
  }
];
