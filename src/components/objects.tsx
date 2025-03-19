import { useSelector } from 'react-redux';
import { 
  Key1Icon, 
  Key4Icon, 
  DiamondIcon, 
  RubiIcon, 
  PocketWatchIcon 
} from './SvgExporter';

// Define el estado de tu slice de objects
interface ObjectsState {
  diamond: number;
  rubi: number;
  pocketwatch: number;
  keychest1: number;
  keychest2: number;
  keydoor1: number;
  keydoor2: number;
}

// Define RootState parcial solo para lo que vas a consumir
interface RootState {
  objects: ObjectsState;
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
    keydoor1,
    keydoor2,
  } = useSelector((state: RootState) => state.objects);

  const treasures: GameObject[] = [
    {
      id:'diamond',
      name: 'Diamante',
      description: 'Pequeño Diamante',
      icon: DiamondIcon,
      state: diamond,
      price: 30, // Precio de ejemplo
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
      description: 'Reloj de Bolsillo',
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

  return { treasures, keys };
};
