import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'charactersState';

export const loadCharactersState = createAsyncThunk(
  'characters/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

export interface CharactersState {
  shopgirl: number;
  baris: number;
  germis: number;
  jox: number;
  gorjox: number;
  riff: number;
  pawnshopboy: number;
  death: number;
  tim: number;
  shopgirlHealth: number;
  barisHealth: number;
  germisHealth: number;
  joxHealth: number;
  gorjoxHealth: number;
  riffHealth: number;
  pawnshopboyHealth: number;
  deathHealth: number;
  timHealth: number;
}

type HealthKey = 'shopgirlHealth' | 'barisHealth' | 'germisHealth' | 'joxHealth' | 'gorjoxHealth' | 'riffHealth' | 'pawnshopboyHealth' | 'deathHealth' | 'timHealth';

const initialState: CharactersState = {
  shopgirl: 0,
  baris: 0,
  germis: 0,
  jox: 0,
  gorjox: 0,
  riff: 0,
  pawnshopboy: 0,
  death: 1,
  tim: 0,
  shopgirlHealth: 3,
  barisHealth: 3,
  germisHealth: 3,
  joxHealth: 3,
  gorjoxHealth: 3,
  riffHealth: 3,
  pawnshopboyHealth: 3,
  deathHealth: 3,
  timHealth: 3,
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setCharacter: (state, action: PayloadAction<{ key: keyof CharactersState; value: number }>) => {
      const { key, value } = action.payload;
      state[key] = value;
      saveState(state);
    },
    setCharacterHealth: (state, action: PayloadAction<{ key: HealthKey; value: number }>) => {
      const { key, value } = action.payload;
      state[key] = Math.max(value, 0);
      saveState(state);
    },
    incrementCharacterHealth: (state, action: PayloadAction<{ key: HealthKey; delta: number }>) => {
      const { key, delta } = action.payload;
      state[key] += delta;
      saveState(state);
    },
    decrementCharacterHealth: (state, action: PayloadAction<{ key: HealthKey; delta: number }>) => {
      const { key, delta } = action.payload;
      state[key] = Math.max(state[key] - delta, 0);
      saveState(state);
    },
    resetCharacters: (state) => {
      Object.assign(state, initialState);
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCharactersState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

const saveState = async (state: CharactersState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Characters:', error);
  }
};

export const {
  setCharacter,
  setCharacterHealth,
  incrementCharacterHealth,
  decrementCharacterHealth,
  resetCharacters,
} = charactersSlice.actions;

export type { HealthKey };
export default charactersSlice.reducer;
