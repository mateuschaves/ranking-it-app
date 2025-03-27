import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './navigation.type';
import BottomNavigation from "~/navigation/Bottom.navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

function PrivateStack() {
  return (
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="BottomNavigator" component={BottomNavigation} />
      </Stack.Navigator>
  );
}

export default PrivateStack;