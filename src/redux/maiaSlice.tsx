import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar el estado en AsyncStorage
const STORAGE_KEY = 'maiaState';

// Función para cargar el estado guardado al iniciar la app
export const loadMaiaState = createAsyncThunk(
  'maia/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

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
    incrementMaiaHealth: (state, action: PayloadAction<number>) => {
      state.maiahealth += action.payload;
      saveState(state);
    },
    decrementMaiaHealth: (state, action: PayloadAction<number>) => {
      state.maiahealth = Math.max(state.maiahealth - action.payload, 0);
      saveState(state);
    },
    resetMaiaHealth: (state) => {
      state.maiahealth = initialState.maiahealth;
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadMaiaState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

// Función para guardar el estado en AsyncStorage
const saveState = async (state: MaiaState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Maia:', error);
  }
};

export const { incrementMaiaHealth, decrementMaiaHealth, resetMaiaHealth } = maiaSlice.actions;
export default maiaSlice.reducer;
