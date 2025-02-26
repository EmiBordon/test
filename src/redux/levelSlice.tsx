// src/redux/levelSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  levels: Array(15).fill(false), // 15 niveles, todos inicialmente incompletos
  level1AnswerCorrect: false,    // Estado específico para la respuesta del nivel 1
};

const levelSlice = createSlice({
  name: 'levels',
  initialState,
  reducers: {
    completeLevel: (state, action) => {
      const levelIndex = action.payload; // El índice del nivel a completar
      if (levelIndex >= 0 && levelIndex < state.levels.length) {
        state.levels[levelIndex] = true; // Marcar el nivel como completado
      }
    },

    resetLevels: (state) => {
      state.levels = Array(15).fill(false); // Restablecer todos los niveles a incompletos
      state.level1AnswerCorrect = false;    // Restablecer la respuesta del nivel 1 a incorrecta
    },
  },
});

export const { completeLevel,resetLevels } = levelSlice.actions;
export default levelSlice.reducer;
