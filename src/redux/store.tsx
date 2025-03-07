// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mattReducer from './mattSlice';
import maiaReducer from './maiaSlice';
import weaponsReducer from './weaponsSlice'; // Importamos weaponsSlice
import healingReducer from './healingSlice'; 

// Configuración del persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['matt', 'maia', 'weapons','healing'], // Agregamos 'weapons' a la lista de persistencia
};

// Reducer combinado
const rootReducer = combineReducers({
  matt: mattReducer,
  maia: maiaReducer,
  weapons: weaponsReducer,
  healing: healingReducer, // Agregamos el reducer de weapons
});

// Reducer persistente
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuración del store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Deshabilita la verificación de valores no serializables
    }),
});

// Persistor para mantener el estado guardado
export const persistor = persistStore(store);
