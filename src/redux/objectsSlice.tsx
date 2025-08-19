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
  doubledice:number;
  sixdice:number;
  barkey: boolean;
  prisionkey1: boolean;
  prisionkey2: boolean;
  keydoor1: boolean;
  keydoor2: boolean;
}

const initialState: ObjectsState = {
  diamond: 0,
  rubi: 0,
  pocketwatch: 0,
  doubledice:0,
  sixdice:0,
  barkey: false,
  prisionkey1: true,
  prisionkey2: true,
  keydoor1: false,
  keydoor2: false,
};

const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    incrementObject: (state, action: PayloadAction<{ key: 'diamond' | 'rubi' | 'pocketwatch' | 'doubledice' | 'sixdice'; amount: number }>) => {
      state[action.payload.key] += action.payload.amount;
      saveState(state);
    },
    decrementObject: (state, action: PayloadAction<{ key: 'diamond' | 'rubi' | 'pocketwatch' | 'doubledice' | 'sixdice'; amount: number }>) => {
      state[action.payload.key] -= action.payload.amount;
      saveState(state);
    },
    setKeyTrue: (state, action: PayloadAction<'barkey' | 'prisionkey1' | 'prisionkey2' | 'keydoor1' | 'keydoor2'>) => {
      state[action.payload] = true;
      saveState(state);
    },
    setKeyFalse: (state, action: PayloadAction<'barkey' | 'prisionkey1' | 'prisionkey2' | 'keydoor1' | 'keydoor2'>) => {
      state[action.payload] = false;
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

export const {
  incrementObject,
  decrementObject,
  setKeyTrue,
  setKeyFalse,
  resetObjects
} = objectsSlice.actions;

export default objectsSlice.reducer;
