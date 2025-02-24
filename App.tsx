import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/screens/redux/store';
import HomeScreen from './src/screens/HomeScreen';
import NotesScreen from './src/screens/NotesScreen';
import NewNote from './src/screens/newNote';
import SelectedNote from './src/screens/SelectedNote';
import EditNote from './src/screens/EditNote';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }} // Ocultar la barra superior
            />
            <Stack.Screen name="Notes" component={NotesScreen} />
            <Stack.Screen name="NewNote" component={NewNote} />
            <Stack.Screen name="SelectedNote" component={SelectedNote} />
            <Stack.Screen name="EditNote" component={EditNote} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
