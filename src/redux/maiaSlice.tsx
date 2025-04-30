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

export interface MaiaState {
  maiahealth: number;
  maiacurrenthealth: number;
}

const initialState: MaiaState = {
  maiahealth: 4,
  maiacurrenthealth: 4,
};

const maiaSlice = createSlice({
  name: 'maia',
  initialState,
  reducers: {
    incrementMaiaHealth: (state, action: PayloadAction<number>) => {
      state.maiahealth += action.payload;
      state.maiacurrenthealth = state.maiahealth; // Se iguala al nuevo valor de maiahealth
      saveState(state);
    },
    decrementMaiaHealth: (state, action: PayloadAction<number>) => {
      state.maiahealth = Math.max(state.maiahealth - action.payload, 0);
      state.maiacurrenthealth = state.maiahealth; // Se iguala al nuevo valor de maiahealth
      saveState(state);
    },
    resetMaiaHealth: (state) => {
      state.maiahealth = initialState.maiahealth;
      state.maiacurrenthealth = initialState.maiacurrenthealth;
      saveState(state);
    },
    incrementMaiaCurrentHealth: (state, action: PayloadAction<number>) => {
      state.maiacurrenthealth = Math.min(state.maiacurrenthealth + action.payload, state.maiahealth);
      saveState(state);
    },
    decrementMaiaCurrentHealth: (state, action: PayloadAction<number>) => {
      state.maiacurrenthealth = Math.max(state.maiacurrenthealth - action.payload, 0);
      saveState(state);
    },
    setMaiaState: (state, action: PayloadAction<MaiaState>) => {
      state.maiahealth = action.payload.maiahealth;
      state.maiacurrenthealth = action.payload.maiacurrenthealth;
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

// Guardar estado en AsyncStorage
const saveState = async (state: MaiaState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Maia:', error);
  }
};

export const { 
  incrementMaiaHealth, 
  decrementMaiaHealth, 
  resetMaiaHealth, 
  incrementMaiaCurrentHealth, 
  decrementMaiaCurrentHealth,
  setMaiaState // 👈 nueva acción agregada
} = maiaSlice.actions;

export default maiaSlice.reducer;
