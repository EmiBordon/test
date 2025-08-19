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
  cavebox3: boolean;
  cavebox4: boolean;
  germisbox:boolean;
  joxbox:boolean;
  gorjoxbox:boolean;
  riffbox:boolean;
  prisionbox: boolean;
  mansionbox1: boolean;
  mansionbox2: boolean;
}

const initialState: BoxesState = {
  barbox: true,
  cavebox1: true,
  cavebox2: true,
  cavebox3: true,
  cavebox4: true,
  germisbox:true,
  joxbox:true,
  gorjoxbox:true,
  riffbox:true,
  prisionbox: true,
  mansionbox1: true,
  mansionbox2: true,
};

const boxesSlice = createSlice({
  name: 'boxes',
  initialState,
  reducers: {
    setBoxFalse: (state, action: PayloadAction<keyof BoxesState>) => {
      state[action.payload] = false;
      saveState(state);
    },
    setBoxEmpty: (state, action: PayloadAction<keyof BoxesState>) => {
      // Marcar la caja como vacía (diferente de recompensas exitosas)
      state[action.payload] = false;
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

const saveState = async (state: BoxesState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Boxes:', error);
  }
};

export const { setBoxFalse, setBoxEmpty, resetBoxes } = boxesSlice.actions;
export default boxesSlice.reducer;
