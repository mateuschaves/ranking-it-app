import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './navigation.type';
import BottomNavigation from "~/navigation/Bottom.navigation";
import ProfilePhotoScreen from '~/screens/Core/ProfilePhotoScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function PrivateStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="BottomNavigator" component={BottomNavigation} />
      <Stack.Screen name="ProfilePhotoScreen" component={ProfilePhotoScreen} options={{ headerShown: true, headerTransparent: true, headerTitle: '', headerBackVisible: false }} />
    </Stack.Navigator>
  );
}

export default PrivateStack;