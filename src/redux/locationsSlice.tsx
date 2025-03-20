import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'locationsState';

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
    setLocation: (state, action: PayloadAction<{ key: keyof LocationsState; value: number }>) => {
      const { key, value } = action.payload;
      state[key] = value;
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

const saveState = async (state: LocationsState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de Locations:', error);
  }
};

export const { setLocation, resetLocations } = locationsSlice.actions;
export default locationsSlice.reducer;
