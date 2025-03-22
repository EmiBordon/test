import { useSelector } from 'react-redux';
import { 
  Key1Icon, 
  Key4Icon, 
  DiamondIcon, 
  RubiIcon, 
  PocketWatchIcon,
  QuiverArrowIcon,
  HealthPotionIcon,
  BigHealthPotionIcon,
} from './SvgExporter';

// Define el estado de tu slice de objects
interface ObjectsState {
  diamond: number;
  rubi: number;
  pocketwatch: number;
  keychest1: number;
  keychest2: number;
  keychest3: number;
  keydoor1: number;
  keydoor2: number;
}

// Define el estado de weapons y healing
interface WeaponsState {
  arrows: number;
}
interface HealingState {
  healthpotion: number;
  bighealthpotion: number;
}

interface RootState {
  objects: ObjectsState;
  weapons: WeaponsState;
  healing: HealingState;
}

// Objeto base
export interface GameObject {
  id: string;
  name: string;
  description?: string;
  icon: React.ComponentType<any>;
  state: number;
  price?: number;
}

export const useObjects = () => {
  const {
    diamond,
    rubi,
    pocketwatch,
    keychest1,
    keychest2,
    keychest3,
    keydoor1,
    keydoor2,
  } = useSelector((state: RootState) => state.objects);

  const { arrows } = useSelector((state: RootState) => state.weapons);
  const { healthpotion, bighealthpotion } = useSelector((state: RootState) => state.healing);

  const treasures: GameObject[] = [
    {
      id:'diamond',
      name: 'Diamante',
      description: 'Pequeño Diamante',
      icon: DiamondIcon,
      state: diamond,
      price: 30,
    },
    {
      id:'rubi',
      name: 'Rubi',
      description: 'Pequeño Rubi',
      icon: RubiIcon,
      state: rubi,
      price: 10,
    },
    {
      id:'pocketwatch',
      name: 'Reloj de Bolsillo',
      description: 'Reloj de Bolsillo antiguo, una reliquia',
      icon: PocketWatchIcon,
      state: pocketwatch,
      price: 35,
    },
  ];

  const keys: GameObject[] = [
    {
      id:'keychest1',
      name: 'keychest1',
      description: 'Key to open chest 1.',
      icon: Key1Icon,
      state: keychest1,
    },
    {
      id:'keychest2',
      name: 'keychest2',
      description: 'Key to open chest 2.',
      icon: Key1Icon,
      state: keychest2,
    },
    {
      id:'keychest3',
      name: 'keychest3',
      description: 'Key to open chest 3.',
      icon: Key1Icon,
      state: keychest3,
    },
    {
      id:'keydoor1',
      name: 'keydoor1',
      description: 'Key to unlock door 1.',
      icon: Key4Icon,
      state: keydoor1,
    },
    {
      id:'keydoor2',
      name: 'keydoor2',
      description: 'Key to unlock door 2.',
      icon: Key4Icon,
      state: keydoor2,
    },
  ];

  const inventory: GameObject[] = [
    {
      id: 'arrows',
      name: 'Flecha',
      description: 'Flecha de combate y caza',
      icon: QuiverArrowIcon,
      state: arrows,
      price: 2,
    },
    {
      id: 'healthpotion',
      name: 'Frasco de Salud',
      description: 'Pequeño Frasco de Salud, se puede revender a guerreros',
      icon: HealthPotionIcon,
      state: healthpotion,
      price: 15,
    },
    {
      id: 'bighealthpotion',
      name: 'Gran Frasco de Salud',
      description: 'Un Gran Frasco de Salud, dificiles de conseguir',
      icon: BigHealthPotionIcon,
      state: bighealthpotion,
      price: 30,
    },
  ];

  return { treasures, keys, inventory };
};
