import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'boxesState';

export const loadBoxesState = createAsyncThunk(
  'boxes/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

export interface BoxesState {
  barbox: boolean;
  cavebox1: boolean;
  cavebox2: boolean;
  prisionbox: boolean;
  mansionbox1: boolean;
  mansionbox2: boolean;
}

const initialState: BoxesState = {
  barbox: true,
  cavebox1: true,
  cavebox2: true,
  prisionbox: true,
  mansionbox1: true,
  mansionbox2: true,
};

const boxesSlice = createSlice({
  name: 'boxes',
  initialState,
  reducers: {
    setBarboxFalse: (state) => {
      state.barbox = false;
      saveState(state);
    },
    setCavebox1False: (state) => {
      state.cavebox1 = false;
      saveState(state);
    },
    setCavebox2False: (state) => {
      state.cavebox2 = false;
      saveState(state);
    },
    setPrisionboxFalse: (state) => {
      state.prisionbox = false;
      saveState(state);
    },
    setMansionbox1False: (state) => {
      state.mansionbox1 = false;
      saveState(state);
    },
    setMansionbox2False: (state) => {
      state.mansionbox2 = false;
      saveState(state);
    },
    resetBoxes: (state) => {
      Object.assign(state, initialState);
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadBoxesState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

// Guardar estado en AsyncStorage
const saveState = async (state: BoxesState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Boxes:', error);
  }
};

export const { 
  setBarboxFalse, 
  setCavebox1False, 
  setCavebox2False, 
  setPrisionboxFalse, 
  setMansionbox1False, 
  setMansionbox2False, 
  resetBoxes 
} = boxesSlice.actions;

export default boxesSlice.reducer;
