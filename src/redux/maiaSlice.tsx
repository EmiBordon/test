// maiaSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MaiaState {
  maiahealth: number;
}

const initialState: MaiaState = {
  maiahealth: 10,
};

const maiaSlice = createSlice({
  name: 'maia',
  initialState,
  reducers: {
    // Incrementa la salud de Maia
    incrementMaiaHealth: (state, action: PayloadAction<number>) => {
      state.maiahealth += action.payload;
    },
    // Decrementa la salud de Maia, sin bajar de 0
    decrementMaiaHealth: (state, action: PayloadAction<number>) => {
      state.maiahealth -= action.payload;
      if (state.maiahealth < 0) {
        state.maiahealth = 0;
      }
    },
    // Reinicia la salud a 10
    resetAll: (state) => {
      state.maiahealth = 10;
    },
  },
});

export const { incrementMaiaHealth, decrementMaiaHealth, resetAll } = maiaSlice.actions;

const maiaPersistConfig = {
  key: 'maia',
  storage: AsyncStorage,
};

export default persistReducer(maiaPersistConfig, maiaSlice.reducer);
