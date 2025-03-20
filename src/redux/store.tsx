// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Imports de tus slices
import mattReducer from './mattSlice';
import maiaReducer from './maiaSlice';
import weaponsReducer from './weaponsSlice';
import healingReducer from './healingSlice';
import agendaReducer from './agendaSlice';
import coinsReducer from './coinsSlice';
import charactersReducer from './charactersSlice';
import boxesReducer from './boxesSlice';
import locationsReducer from './locationsSlice';
import objectsReducer from './objectsSlice'
import backupReducer from './backupSlice'; 
import rewardReducer from './rewardSlice'

// Configuración de persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'matt', 
    'maia', 
    'weapons', 
    'healing', 
    'agenda',
    'coins', 
    'characters', 
    'boxes',
    'locations',
    'objects',
    'rewards',
  ],
  // No incluimos 'backup' ya que es un snapshot temporal y no debe persistir
};

// Reducer combinado
const rootReducer = combineReducers({
  matt: mattReducer,
  maia: maiaReducer,
  weapons: weaponsReducer,
  healing: healingReducer,
  agenda: agendaReducer,
  coins: coinsReducer,
  characters: charactersReducer,
  boxes: boxesReducer,
  locations: locationsReducer,
  backup: backupReducer,
  objects:objectsReducer,
  rewards:rewardReducer, 
});

// Reducer persistente
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuración del store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor para mantener el estado guardado
export const persistor = persistStore(store);
