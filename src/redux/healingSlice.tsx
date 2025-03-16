import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar el estado en AsyncStorage
const STORAGE_KEY = 'healingState';

// Función para cargar el estado guardado al iniciar la app
export const loadHealingState = createAsyncThunk(
  'healing/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

interface HealingState {
  grapes: number;
  healthpotion: number;
  bighealthpotion: number;
  pills: number;
}

const initialState: HealingState = {
  grapes: 3,
  healthpotion: 1,
  bighealthpotion: 1,
  pills:0,
};

const healingSlice = createSlice({
  name: 'healing',
  initialState,
  reducers: {
    incrementGrapes: (state, action: PayloadAction<number>) => {
      state.grapes += action.payload;
      saveState(state);
    },
    decrementGrapes: (state, action: PayloadAction<number>) => {
      state.grapes = Math.max(state.grapes - action.payload, 0);
      saveState(state);
    },
    incrementHealthPotion: (state, action: PayloadAction<number>) => {
      state.healthpotion += action.payload;
      saveState(state);
    },
    decrementHealthPotion: (state, action: PayloadAction<number>) => {
      state.healthpotion = Math.max(state.healthpotion - action.payload, 0);
      saveState(state);
    },
    incrementBigHealthPotion: (state, action: PayloadAction<number>) => {
      state.bighealthpotion += action.payload;
      saveState(state);
    },
    decrementBigHealthPotion: (state, action: PayloadAction<number>) => {
      state.bighealthpotion = Math.max(state.bighealthpotion - action.payload, 0);
      saveState(state);
    },
    incrementPills: (state, action: PayloadAction<number>) => {
      state.pills += action.payload;
      saveState(state);
    },
    decrementPills: (state, action: PayloadAction<number>) => {
      state.pills = Math.max(state.pills - action.payload, 0);
      saveState(state);
    },
    resetHealing: (state) => {
      state.grapes = initialState.grapes;
      state.healthpotion = initialState.healthpotion;
      state.bighealthpotion = initialState.bighealthpotion;
      state.pills = initialState.pills;
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadHealingState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

// Función para guardar el estado en AsyncStorage
const saveState = async (state: HealingState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Healing:', error);
  }
};

export const { incrementGrapes, decrementGrapes, incrementHealthPotion, decrementHealthPotion, incrementBigHealthPotion, decrementBigHealthPotion, resetHealing 
  ,incrementPills, decrementPills
} = healingSlice.actions;
export default healingSlice.reducer;