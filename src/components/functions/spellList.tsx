import React from 'react';
import { LifeRunicCodeIcon, LifeRunicIcon } from '../SvgExporter';

export interface SpellEntry {
  name: string;
  code: React.ComponentType<any>;
  icon: React.ComponentType<any>;
  description: string;
  flagKey: string;
}

const spellList: SpellEntry[] = [
  {
    name: 'Life',
    code: LifeRunicCodeIcon,
    icon: LifeRunicIcon,
    description: 'Aumenta la Salud.',
    flagKey: 'lifeSpell',
  },
];

export default spellList;
