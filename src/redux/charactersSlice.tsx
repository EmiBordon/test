import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar el estado en AsyncStorage
const STORAGE_KEY = 'charactersState';

// Función para cargar el estado guardado al iniciar la app
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
}

const initialState: CharactersState = {
  shopgirl: 0,
  baris: 0,
  germis: 1,
  jox: 0,
  gorjox: 0,
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setShopgirl: (state, action: PayloadAction<number>) => {
      state.shopgirl = action.payload;
      saveState(state);
    },
    setBaris: (state, action: PayloadAction<number>) => {
      state.baris = action.payload;
      saveState(state);
    },
    setGermis: (state, action: PayloadAction<number>) => {
      state.germis = action.payload;
      saveState(state);
    },
    setJox: (state, action: PayloadAction<number>) => {
      state.jox = action.payload;
      saveState(state);
    },
    setGorjox: (state, action: PayloadAction<number>) => {
      state.gorjox = action.payload;
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

// Función para guardar el estado en AsyncStorage
const saveState = async (state: CharactersState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Characters:', error);
  }
};

export const { setShopgirl, setBaris, setGermis, setJox, setGorjox, resetCharacters } = charactersSlice.actions;
export default charactersSlice.reducer;
