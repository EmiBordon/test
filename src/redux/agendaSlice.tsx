import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "agendaState";

// Función para cargar el estado guardado
export const loadAgendaState = createAsyncThunk(
  "agenda/loadState",
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

export interface AgendaState {
  nota1: boolean;
  nota2: boolean;
  nota3: boolean;
  nota4: boolean;
  nota5: boolean;
  nota6: boolean;
  nota7: boolean;
  nota8: boolean;
  nota9: boolean;
  nota10: boolean;
  nota11: boolean;
  nota12: boolean;
}

const initialState: AgendaState = {
  nota1: true,
  nota2: false,
  nota3: false,
  nota4: false,
  nota5: false,
  nota6: false,
  nota7: false,
  nota8: false,
  nota9: false,
  nota10: false,
  nota11: false,
  nota12: false,
};

const agendaSlice = createSlice({
  name: "agenda",
  initialState,
  reducers: {
    setNotaTrue: (state, action) => {
      const notaKey = `nota${action.payload}` as keyof AgendaState;
      state[notaKey] = true;
      saveState(state);
    },
    resetNotas: (state) => {
      Object.assign(state, initialState);
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAgendaState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

// Función para guardar el estado en AsyncStorage
const saveState = async (state: AgendaState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error al guardar el estado:", error);
  }
};

export const { setNotaTrue, resetNotas } = agendaSlice.actions;

/**
 * Selector memoizado para obtener un array con las notas activas.
 * Se utiliza createSelector para evitar retornar una nueva referencia en cada llamada.
 */
export const selectVisibleNotas = createSelector(
  (state: { agenda: AgendaState }) => state.agenda,
  (agenda) =>
    Object.keys(agenda)
      .filter((key) => agenda[key as keyof AgendaState])
      .map((key) => ({
        key,
        label: `Nota número ${key.replace("nota", "")}`,
      }))
);

export default agendaSlice.reducer;
