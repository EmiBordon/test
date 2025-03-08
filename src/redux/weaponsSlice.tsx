import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves de almacenamiento en AsyncStorage
const STORAGE_KEY = 'weaponsState';

// Función para cargar el estado guardado
export const loadWeaponsState = createAsyncThunk(
  'weapons/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

const initialState = {
  currentWeapon: 0,
  crossbow: false,
  arrows: 5,
};

const weaponsSlice = createSlice({
  name: 'weapons',
  initialState,
  reducers: {
    incrementWeapon: (state) => {
      state.currentWeapon += 1;
      saveState(state);
    },
    decrementWeapon: (state) => {
      if (state.currentWeapon > 0) state.currentWeapon -= 1;
      saveState(state);
    },
    incrementArrows: (state, action) => {
      state.arrows += action.payload;
      saveState(state);
    },
    decrementArrows: (state, action) => {
      state.arrows = Math.max(0, state.arrows - action.payload);
      saveState(state);
    },
    activateCrossbow: (state) => {
      state.crossbow = true;
      saveState(state);
    },
    resetState: (state) => {
      Object.assign(state, initialState);
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadWeaponsState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

// Guardar estado en AsyncStorage
const saveState = async (state) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado:', error);
  }
};

export const { 
  incrementWeapon, 
  decrementWeapon, 
  incrementArrows, 
  decrementArrows, 
  activateCrossbow, 
  resetState 
} = weaponsSlice.actions;

export default weaponsSlice.reducer;
