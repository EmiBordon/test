import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'objectsState';

export const loadObjectsState = createAsyncThunk(
  'objects/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

export interface ObjectsState {
  diamond: number;
  rubi: number;
  pocketwatch: number;
  keychest1: number;
  keychest2: number;
  keychest3:number;
  keydoor1: number;
  keydoor2: number;
}

const initialState: ObjectsState = {
  diamond: 0,
  rubi: 0,
  pocketwatch: 0,
  keychest1: 0,
  keychest2: 0,
  keychest3: 0,
  keydoor1: 0,
  keydoor2: 0,
};

const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    incrementObject: (state, action: PayloadAction<{ key: keyof ObjectsState; amount: number }>) => {
      state[action.payload.key] += action.payload.amount;
      saveState(state);
    },
    decrementObject: (state, action: PayloadAction<{ key: keyof ObjectsState; amount: number }>) => {
      state[action.payload.key] -= action.payload.amount;
      saveState(state);
    },
    resetObjects: (state) => {
      Object.assign(state, initialState);
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadObjectsState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

// Guardar en AsyncStorage
const saveState = async (state: ObjectsState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Objects:', error);
  }
};

export const { incrementObject, decrementObject, resetObjects } = objectsSlice.actions;
export default objectsSlice.reducer;
