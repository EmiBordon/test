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
  maiaMana: number;
  maiaManaLevel: number;
}

const initialState: MaiaState = {
  maiahealth: 9,
  maiacurrenthealth: 9,
  maiaMana: 3,
  maiaManaLevel: 1,
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
    healMaiaFull: (state) => {
      state.maiacurrenthealth = state.maiahealth;
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
    incrementMaiaMana: (state, action: PayloadAction<number>) => {
      state.maiaMana += action.payload;
      saveState(state);
    },
    decrementMaiaMana: (state, action: PayloadAction<number>) => {
      state.maiaMana = Math.max(state.maiaMana - action.payload, 0);
      saveState(state);
    },
    resetMaiaMana: (state) => {
      state.maiaMana = initialState.maiaMana;
      saveState(state);
    },
    incrementMaiaManaLevel: (state, action: PayloadAction<number>) => {
      state.maiaManaLevel += action.payload;
      saveState(state);
    },
    decrementMaiaManaLevel: (state, action: PayloadAction<number>) => {
      state.maiaManaLevel = Math.max(state.maiaManaLevel - action.payload, 0);
      saveState(state);
    },
    resetMaiaManaLevel: (state) => {
      state.maiaManaLevel = initialState.maiaManaLevel;
      saveState(state);
    },
    setMaiaState: (state, action: PayloadAction<MaiaState>) => {
      state.maiahealth = action.payload.maiahealth;
      state.maiacurrenthealth = action.payload.maiacurrenthealth;
      state.maiaMana = action.payload.maiaMana;
      state.maiaManaLevel = action.payload.maiaManaLevel;
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
  healMaiaFull,
  incrementMaiaCurrentHealth,
  decrementMaiaCurrentHealth,
  incrementMaiaMana,
  decrementMaiaMana,
  resetMaiaMana,
  incrementMaiaManaLevel,
  decrementMaiaManaLevel,
  resetMaiaManaLevel,
  setMaiaState,
} = maiaSlice.actions;

export default maiaSlice.reducer;
