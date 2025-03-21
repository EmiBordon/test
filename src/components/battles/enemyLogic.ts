// src/utils/enemyLogic.ts
import { Enemy, EnemyPhase } from "./enemyTypes";

// Calcula la fase correcta según currentHealth
export const getCurrentPhase = (enemy: Enemy, currentHealth: number): EnemyPhase => {
  const healthRatio = currentHealth / enemy.health;

  // Elegimos la primera fase cuyo threshold sea menor o igual al ratio actual
  return enemy.phases.find(phase => healthRatio >= phase.threshold) || enemy.phases[enemy.phases.length - 1];
};
