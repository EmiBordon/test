import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HealingState } from './healingSlice';
import { MaiaState } from './maiaSlice';
import { WeaponsState } from './weaponsSlice';

interface BackupState {
  healing: HealingState | null;
  maia: MaiaState | null;
  weapons: WeaponsState | null;
}

const initialState: BackupState = {
  healing: null,
  maia: null,
  weapons: null,
};

interface BackupPayload {
  healing: HealingState;
  maia: MaiaState;
  weapons: WeaponsState;
}

const backupSlice = createSlice({
  name: 'backup',
  initialState,
  reducers: {
    // Save all states together
    saveBackup: (state, action: PayloadAction<BackupPayload>) => {
      state.healing = { ...action.payload.healing };
      state.maia = { ...action.payload.maia };
      state.weapons = { ...action.payload.weapons };
    },

    // This action is just a trigger, real restore is outside
    restoreBackup: (state) => {},

    // Clear all backups
    clearBackup: (state) => {
      state.healing = null;
      state.maia = null;
      state.weapons = null;
    },
  },
});

export const { saveBackup, restoreBackup, clearBackup } = backupSlice.actions;

export default backupSlice.reducer;
