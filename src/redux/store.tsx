// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import levelReducer from './levelSlice';
import mattReducer from './mattSlice';
import maiaReducer from './maiaSlice'; // Importamos el nuevo slice

const rootReducer = combineReducers({
  levels: levelReducer,
  matt: mattReducer,
  maia: maiaReducer,  // Agregamos el reducer de maia
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['levels', 'matt', 'maia'], // Asegúrate de persistir los slices que desees
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Deshabilita la verificación de valores no serializables
    }),
});

export const persistor = persistStore(store);
