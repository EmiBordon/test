import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves de almacenamiento en AsyncStorage
const STORAGE_KEY = 'weaponsState';

// Interface del estado
export interface WeaponsState {
  currentWeapon: number;
  crossbow: boolean;
  arrows: number;
}

// Función para cargar el estado guardado
export const loadWeaponsState = createAsyncThunk(
  'weapons/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

// Estado inicial
const initialState: WeaponsState = {
  currentWeapon: 0,
  crossbow: false,
  arrows: 6,
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
    incrementArrows: (state, action: PayloadAction<number>) => {
      state.arrows += action.payload;
      saveState(state);
    },
    decrementArrows: (state, action: PayloadAction<number>) => {
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

    // ✅ NUEVO setWeaponsState
    setWeaponsState: (state, action: PayloadAction<WeaponsState>) => {
      state.currentWeapon = action.payload.currentWeapon;
      state.crossbow = action.payload.crossbow;
      state.arrows = action.payload.arrows;
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
const saveState = async (state: WeaponsState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado:', error);
  }
};

// Exports
export const { 
  incrementWeapon, 
  decrementWeapon, 
  incrementArrows, 
  decrementArrows, 
  activateCrossbow, 
  resetState,
  setWeaponsState // 👈 nueva acción
} = weaponsSlice.actions;

export default weaponsSlice.reducer;
