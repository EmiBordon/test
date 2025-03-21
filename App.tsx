import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';

import HomeScreen from './src/screens/HomeScreen';
import TutorialScreen from './src/screens/levels/tutorial';
import HandGame from './src/components/functions/handgame';
import BattleScreen from './src/components/battles/battlescreen';
import CaveScreen from './src/screens/levels/cave';
import BarScreen from './src/screens/levels/bar';
import ShopScreen from './src/screens/levels/shop';
import PawnShopScreen from './src/screens/levels/pawnshop';
import { RootStackParamList } from './src/components/battles/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }} 
            />
            <Stack.Screen
              name="Tutorial"
              component={TutorialScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HandGame"
              component={HandGame}
            />
            <Stack.Screen
              name="BattleScreen"
              component={BattleScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cave"
              component={CaveScreen}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="Bar"
              component={BarScreen}
              options={{ headerShown: false }}
            />
             <Stack.Screen
              name="Shop"
              component={ShopScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PawnShop"
              component={PawnShopScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
