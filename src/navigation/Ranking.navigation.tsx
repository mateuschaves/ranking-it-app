import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './navigation.type';
import CreateRankingScreen from '~/screens/Core/CreateRankingScreen';
import HomeScreen from '~/screens/Core/HomeScreen';
import RankingDetailScreen from '~/screens/Core/RankingDetailScreen';
import RankingItemDetailScreen from '~/screens/Core/RankingItemDetailScreen';

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
        <Stack.Screen name="RankingDetailScreen" component={RankingDetailScreen} />
        <Stack.Screen name="RankingItemDetailScreen" component={RankingItemDetailScreen} options={{
          presentation: 'modal',
        }}/>
      </Stack.Navigator>
  );
}

export default RankingNavigation;