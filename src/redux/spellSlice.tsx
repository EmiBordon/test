import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'spellState';

export const loadSpellState = createAsyncThunk(
  'spell/loadState',
  async () => {
    const savedState = await AsyncStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }
);

export interface SpellState {
  lifeSpell: boolean;
  iceSpell: boolean;
}

const initialState: SpellState = {
  lifeSpell: false,
  iceSpell: false,
};

const spellSlice = createSlice({
  name: 'spell',
  initialState,
  reducers: {
    enableLifeSpell: (state) => {
      state.lifeSpell = true;
      saveState(state);
    },
    disableLifeSpell: (state) => {
      state.lifeSpell = false;
      saveState(state);
    },
    enableIceSpell: (state) => {
      state.iceSpell = true;
      saveState(state);
    },
    disableIceSpell: (state) => {
      state.iceSpell = false;
      saveState(state);
    },
    resetSpells: (state) => {
      state.lifeSpell = false;
      state.iceSpell = false;
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadSpellState.fulfilled, (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    });
  },
});

const saveState = async (state: SpellState) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error al guardar el estado de spells:', error);
  }
};

export const { enableLifeSpell, disableLifeSpell, enableIceSpell, disableIceSpell, resetSpells } = spellSlice.actions;
export default spellSlice.reducer;
