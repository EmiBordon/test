// src/redux/store.js
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import levelReducer from './levelSlice';

// Configuración de redux-persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Aplicar persistencia al reducer de niveles
const persistedReducer = persistReducer(persistConfig, levelReducer);

export const store = configureStore({
  reducer: {
    levels: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar las acciones relacionadas con redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
