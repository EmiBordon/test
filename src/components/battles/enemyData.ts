// src/data/enemyData.ts
import { Enemy } from './enemyTypes';
import { GermisIcon,JoxIcon,GorjoxIcon, MattIcon } from '../SvgExporter'; // Ajusta la ruta según tu estructura
import { setMattState } from '../../redux/mattSlice';
import { setCharacter } from '../../redux/charactersSlice';

export const enemies: Enemy[] = [
    {
        name: "Matt",
        health: 5,
        initialdamage: 1,
        victoryMessage: "Matt esta enojado porque lo golpeaste demasiado fuerte...",
        defeatMessage: "Matt se siente completamente decepcionado de tu desempeño...",
        arrowsRequired: 1,
        description: "Matt no es un gran guerrero...",
        icon: MattIcon,
        onDefeat: () => setMattState(2),
        phases: [
          { threshold: 0, damage: 1, drawBarLevels: 2, drawBarDuration: 1500, moonTearPattern: 2, moonTearDifficulty: 2, gridLength: 2 ,gridDelay: 500},
        ],
      },  
{
    name: "Germis",
    health: 10,
    initialdamage: 2,
    victoryMessage: "Estuviste por darle el golpe final a Germis, pero huyó...",
    defeatMessage: "Germis te venció...vuelve a intentarlo",
    arrowsRequired: 2,
    description: "Es pequeño aunque aterrador, no parece muy peligroso...",
    icon: GermisIcon,
    onDefeat: () => (setCharacter({ key: 'germis', value: 2 })),
    phases: [
      { threshold: 0, damage: 2, drawBarLevels: 3, drawBarDuration: 1500, moonTearPattern: 3, moonTearDifficulty: 3, gridLength: 3 ,gridDelay: 480},
    ],
  },
  {
    name: "Jox",
    health: 12,
    initialdamage: 2,
    victoryMessage: "Jox ha escapado con sus ultimas fuerzas...",
    defeatMessage: "Jox te destruyó...vuelve a intentarlo",
    arrowsRequired: 2,
    description: "El hermano mayor de germis, no es mas poderoso pero si mas rapido...",
    icon: JoxIcon,
    onDefeat: () => (setCharacter({ key: 'jox', value: 2 })),
    phases: [
      { threshold: 0.9, damage: 2, drawBarLevels: 3, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.3, gridLength: 3, gridDelay: 480 },
      { threshold: 0.6, damage: 2, drawBarLevels: 3, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.3, gridLength: 3, gridDelay: 480 },
      { threshold: 0.4, damage: 2, drawBarLevels: 3, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.3, gridLength: 3, gridDelay: 480},
      { threshold: 0, damage: 2, drawBarLevels: 4, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.4, gridLength: 4,gridDelay: 470 },
    ],
  },
  {
    name: "Gorjox",
    health: 20,
    initialdamage: 4,
    victoryMessage: "Gorjox agoniza de dolor.. su sonido al morir hace eco en toda la cueva...",
    defeatMessage: "Gorjox te aplastó sin piedad... vuelve a intentarlo",
    arrowsRequired: 3,
    description: "Una aterradora bestia de destruccion, aumenta su daño cuando se enfurece...",
    icon: GorjoxIcon,
    onDefeat: () => (setCharacter({ key: 'gorjox', value: 4 })),
    phases: [
        { threshold: 0.9, damage: 4, drawBarLevels: 3, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.2, gridLength: 3,gridDelay: 480 },
        { threshold: 0.6, damage: 4, drawBarLevels: 3, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.2, gridLength: 3,gridDelay: 480 },
        { threshold: 0.4, damage: 9, drawBarLevels: 4, drawBarDuration: 1450, moonTearPattern: 5, moonTearDifficulty: 3.8, gridLength: 8 ,gridDelay: 300},
        { threshold: 0.2, damage: 4, drawBarLevels: 4, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.2, gridLength: 3,gridDelay: 480 },
        { threshold: 0, damage: 9, drawBarLevels: 4, drawBarDuration: 1450, moonTearPattern: 5, moonTearDifficulty: 3.8, gridLength: 8 ,gridDelay: 300},
    ],
  }
];
