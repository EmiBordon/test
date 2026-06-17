import React from 'react';
import { LifeRunicIcon, KeyRunicIcon, CrossRunicIcon } from '../SvgExporter';

const SPELLS: Array<{ sequence: number[]; Icon: React.ComponentType<any> }> = [
  {
    sequence: [40, 31, 32, 33, 42, 51, 50, 49, 48, 47, 38, 29, 30],
    Icon: LifeRunicIcon,
  },
  {
    sequence: [40, 31, 22, 13, 14, 15, 6, 5, 4, 3, 2, 11, 12],
    Icon: KeyRunicIcon,
  },
];

export function getSpellIcon(sequence: number[]): React.ComponentType<any> {
  for (const spell of SPELLS) {
    if (
      spell.sequence.length === sequence.length &&
      spell.sequence.every((val, idx) => val === sequence[idx])
    ) {
      return spell.Icon;
    }
  }
  return CrossRunicIcon;
}
