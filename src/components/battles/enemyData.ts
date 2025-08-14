// src/data/enemyData.ts
import { Enemy } from './enemyTypes';
import { GermisIcon,JoxIcon,GorjoxIcon, MattIcon, GorjoxFuryIcon, RiffIcon } from '../SvgExporter'; // Ajusta la ruta según tu estructura
import { setMattState } from '../../redux/mattSlice';
import { setCharacter } from '../../redux/charactersSlice';
import { incrementObjective } from '../../redux/objectivesSlice';


export const enemies: Enemy[] = [
  {
    name: "Matt",
    health: 26,
    initialdamage: 1,
    victoryMessage: "Matt esta enojado porque lo golpeaste demasiado fuerte...",
    defeatMessage: "Matt se siente completamente decepcionado de tu desempeño...",
    arrowsRequired: 1,
    description: "Matt no es un gran guerrero...",
    
    onDefeatCallbacks: [
      { type: 'dispatch', action: () => setMattState(2) },
    ],
    phases: [
      { threshold: 0, damage: 1, drawBarLevels: 2, drawBarDuration: 1500, moonTearPattern: 2, moonTearDifficulty: 2, gridLength: 2 ,gridDelay: 500, icon: MattIcon, },
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
    onDefeatCallbacks: [
      { type: 'dispatch', action: () => setCharacter({ key: 'germis', value: 2 }) }
    ],
    phases: [
      { threshold: 0, damage: 2, drawBarLevels: 3, drawBarDuration: 1500, moonTearPattern: 3, moonTearDifficulty: 3, gridLength: 3 ,gridDelay: 480,icon: GermisIcon, },
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
    onDefeatCallbacks: [
      { type: 'dispatch', action: () => setCharacter({ key: 'jox', value: 2 }) }
    ],
    phases: [
      { threshold: 0.9, damage: 2, drawBarLevels: 3, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.3, gridLength: 3, gridDelay: 480,icon: JoxIcon },
      { threshold: 0.6, damage: 2, drawBarLevels: 3, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.3, gridLength: 3, gridDelay: 480,icon: JoxIcon },
      { threshold: 0.4, damage: 2, drawBarLevels: 3, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.3, gridLength: 3, gridDelay: 480,icon: JoxIcon },
      { threshold: 0, damage: 2, drawBarLevels: 4, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.4, gridLength: 4, gridDelay: 470,icon: JoxIcon },
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
    onDefeatCallbacks: [
      { type: 'dispatch', action: () => setCharacter({ key: 'gorjox', value: 4 }) },
      { type: 'dispatch', action: () => setCharacter({ key: 'baris', value: 2 }) },
      { type: 'dispatch', action: () => setMattState(4) },
      { type: 'dispatch', action: () => incrementObjective()},
    ],
    phases: [
      { threshold: 0.9, damage: 4, drawBarLevels: 3, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.2, gridLength: 3, gridDelay: 480,icon: GorjoxIcon },
      { threshold: 0.6, damage: 4, drawBarLevels: 3, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.2, gridLength: 3, gridDelay: 480,icon: GorjoxIcon },
      { threshold: 0.4, damage: 9, drawBarLevels: 4, drawBarDuration: 1450, moonTearPattern: 5, moonTearDifficulty: 3.8, gridLength: 8 ,gridDelay: 300,icon: GorjoxFuryIcon },
      { threshold: 0.2, damage: 4, drawBarLevels: 4, drawBarDuration: 1450, moonTearPattern: 3, moonTearDifficulty: 3.2, gridLength: 3, gridDelay: 480,icon: GorjoxIcon },
      { threshold: 0, damage: 9, drawBarLevels: 4, drawBarDuration: 1450, moonTearPattern: 5, moonTearDifficulty: 3.8, gridLength: 8 ,gridDelay: 300,icon: GorjoxFuryIcon },
    ],
  },
  {
    name: "Riff",
    health: 6,
    initialdamage: 1,
    victoryMessage: "Riff llora de dolor mientras se desintegra...",
    defeatMessage: "Riff acabo contigo, se siente muy triste y arrepentido.",
    arrowsRequired: 1,
    description: "Riff es un Bicho debil.. aunque bastante rapido.",
    
    onDefeatCallbacks: [
      { type: 'dispatch', action: () => setCharacter({ key: 'riff', value: 2 }) },
    ],
    phases: [
      { threshold: 0, damage: 1, drawBarLevels: 2, drawBarDuration: 1500, moonTearPattern: 6, moonTearDifficulty: 3, gridLength: 6 ,gridDelay: 400, icon: RiffIcon, },
    ],
  },  

];
