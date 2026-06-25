import React from 'react';
import { LifeRunicIcon, KeyRunicIcon, CrossRunicIcon } from '../SvgExporter';
import { healMaiaFull, decrementMaiaMana } from '../../redux/maiaSlice';

export interface SpellResult {
  Icon: React.ComponentType<any>;
  effect?: (dispatch: any) => void;
  noMana: boolean;
}

export interface SpellFlags {
  lifeSpell: boolean;
  iceSpell: boolean;
}

const SPELLS: Array<{
  sequence: number[];
  Icon: React.ComponentType<any>;
  effect?: (dispatch: any) => void;
  requiredFlag?: keyof SpellFlags;
}> = [
  {
    sequence: [40, 31, 32, 33, 42, 51, 50, 49, 48, 47, 38, 29, 30],
    Icon: LifeRunicIcon,
    requiredFlag: 'lifeSpell',
    effect: (dispatch) => {
      dispatch(healMaiaFull());
      dispatch(decrementMaiaMana(1));
    },
  },
  {
    sequence: [40, 31, 22, 13, 14, 15, 6, 5, 4, 3, 2, 11, 12],
    Icon: KeyRunicIcon,
  },
];

export function resolveSpell(sequence: number[], maiaMana: number, flags: SpellFlags): SpellResult {
  for (const spell of SPELLS) {
    if (
      spell.sequence.length === sequence.length &&
      spell.sequence.every((val, idx) => val === sequence[idx])
    ) {
      if (spell.requiredFlag && !flags[spell.requiredFlag]) {
        return { Icon: CrossRunicIcon, noMana: false };
      }
      if (spell.effect && maiaMana === 0) {
        return { Icon: CrossRunicIcon, noMana: true };
      }
      return { Icon: spell.Icon, effect: spell.effect, noMana: false };
    }
  }
  return { Icon: CrossRunicIcon, noMana: false };
}
