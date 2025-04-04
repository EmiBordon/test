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
  barkey: boolean;
  prisionkey1: boolean;
  prisionkey2: boolean;
  keydoor1: boolean;
  keydoor2: boolean;
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
  state: number | boolean;
  price?: number;
}

export const useObjects = () => {
  const {
    diamond,
    rubi,
    pocketwatch,
    barkey,
    prisionkey1,
    prisionkey2,
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
      id:'barkey',
      name: 'Llave del Bar',
      description: '',
      icon: Key1Icon,
      state: barkey,
    },
    {
      id:'prisionkey1',
      name: 'Llave de la Prision',
      description: 'Key to open chest 2.',
      icon: Key1Icon,
      state: prisionkey1,
    },
    {
      id:'prisionkey2',
      name: 'Llave de la Celda',
      description: 'Key to open chest 3.',
      icon: Key1Icon,
      state: prisionkey2,
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
