import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './navigation.type';
import CreateRankingScreen from '~/screens/Core/CreateRankingScreen';
import HomeScreen from '~/screens/Core/HomeScreen';
import Colors from '~/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RankingNavigation() {
  return (
      <Stack.Navigator screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerTransparent: true,
      }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{
            headerLeft: () => null,
        }} />
        <Stack.Screen name="CreateRankingScreen" component={CreateRankingScreen} />
      </Stack.Navigator>
  );
}

export default RankingNavigation;