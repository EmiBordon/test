import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar el estado en AsyncStorage
const STORAGE_KEY = 'coinsState';

// Función para cargar el estado guardado al iniciar la app
export const loadCoinsState = createAsyncThunk(
  'coins/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

export interface CoinsState {
  coins: number;
}

const initialState: CoinsState = {
  coins: 1000,
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    incrementCoins: (state, action: PayloadAction<number>) => {
      state.coins += action.payload;
      saveState(state);
    },
    decrementCoins: (state, action: PayloadAction<number>) => {
      state.coins = Math.max(state.coins - action.payload, 0);
      saveState(state);
    },
    resetCoins: (state) => {
      state.coins = initialState.coins;
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCoinsState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

// Función para guardar el estado en AsyncStorage
const saveState = async (state: CoinsState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Coins:', error);
  }
};

export const { incrementCoins, decrementCoins, resetCoins } = coinsSlice.actions;
export default coinsSlice.reducer;