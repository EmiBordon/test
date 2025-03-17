import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar el estado en AsyncStorage
const STORAGE_KEY = 'locationsState';

// Función para cargar el estado guardado al iniciar la app
export const loadLocationsState = createAsyncThunk(
  'locations/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

export interface LocationsState {
  cave: number;
  prision: number;
  mansion: number;
  bar: number;
  shop: number;
  home: number;
}

const initialState: LocationsState = {
  cave: 0,
  prision: 0,
  mansion: 0,
  bar: 0,
  shop: 0,
  home: 0,
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setCave: (state, action: PayloadAction<number>) => {
      state.cave = action.payload;
      saveState(state);
    },
    setPrision: (state, action: PayloadAction<number>) => {
      state.prision = action.payload;
      saveState(state);
    },
    setMansion: (state, action: PayloadAction<number>) => {
      state.mansion = action.payload;
      saveState(state);
    },
    setBar: (state, action: PayloadAction<number>) => {
      state.bar = action.payload;
      saveState(state);
    },
    setShop: (state, action: PayloadAction<number>) => {
      state.shop = action.payload;
      saveState(state);
    },
    setHome: (state, action: PayloadAction<number>) => {
      state.home = action.payload;
      saveState(state);
    },
    resetLocations: (state) => {
      Object.assign(state, initialState);
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadLocationsState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

// Función para guardar el estado en AsyncStorage
const saveState = async (state: LocationsState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Locations:', error);
  }
};

export const { 
  setCave, 
  setPrision, 
  setMansion, 
  setBar, 
  setShop, 
  setHome, 
  resetLocations 
} = locationsSlice.actions;

export default locationsSlice.reducer;
