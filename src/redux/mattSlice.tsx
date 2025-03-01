import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar el estado en AsyncStorage
const MATT_STATE_KEY = 'MATT_STATE_KEY';

// Thunk para cargar el estado guardado
export const loadMattState = createAsyncThunk(
  'matt/loadState',
  async (_, thunkAPI) => {
    try {
      const savedState = await AsyncStorage.getItem(MATT_STATE_KEY);
      return savedState !== null ? JSON.parse(savedState) : 0; // 0 es el estado inicial por defecto
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Función auxiliar para guardar el estado
const saveMattState = async (stateValue) => {
  try {
    await AsyncStorage.setItem(MATT_STATE_KEY, JSON.stringify(stateValue));
  } catch (error) {
    console.error('Error al guardar el estado de Matt:', error);
  }
};

const mattSlice = createSlice({
  name: 'matt',
  initialState: {
    value: 0, // Puede tomar los valores 0, 1 o 2
  },
  reducers: {
    // Permite establecer manualmente el valor (por ejemplo, al ocurrir un evento)
    setMattState: (state, action) => {
      state.value = action.payload;
      saveMattState(state.value);
    },
    // Acción para resetear el estado a 0
    resetMattState: (state) => {
      state.value = 0;
      saveMattState(state.value);
    },
    // Ejemplo de acción que incrementa el estado cíclicamente (0 -> 1 -> 2 -> 0)
    nextMattState: (state) => {
      state.value = (state.value + 1) % 3;
      saveMattState(state.value);
    },
    // Acción para decrementar cíclicamente el estado (0 -> 2 -> 1 -> 0)
    prevMattState: (state) => {
      state.value = (state.value - 1 + 3) % 3;
      saveMattState(state.value);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadMattState.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});

export const { setMattState, resetMattState, nextMattState, prevMattState } = mattSlice.actions;
export default mattSlice.reducer;
