import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'objectivesState';

// Cargar estado desde AsyncStorage
export const loadObjectivesState = createAsyncThunk(
  'objectives/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

// Tipado del estado
export interface ObjectivesState {
  currentObjective: number;
  lastSeenObjective: number;
}

// Estado inicial
const initialState: ObjectivesState = {
  currentObjective: 0,
  lastSeenObjective: -1, // -1 para que el primer objetivo siempre se detecte como nuevo
};

const objectivesSlice = createSlice({
  name: 'objectives',
  initialState,
  reducers: {
    incrementObjective: (state) => {
      state.currentObjective += 1;
      saveState(state);
    },
    resetObjectives: (state) => {
      state.currentObjective = initialState.currentObjective;
      state.lastSeenObjective = initialState.lastSeenObjective;
      saveState(state);
    },
    markObjectiveAsSeen: (state) => {
      state.lastSeenObjective = state.currentObjective;
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadObjectivesState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

// Guardar estado en AsyncStorage
const saveState = async (state: ObjectivesState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Objectives:', error);
  }
};

export const {
  incrementObjective,
  resetObjectives,
  markObjectiveAsSeen,
} = objectivesSlice.actions;

export default objectivesSlice.reducer;
