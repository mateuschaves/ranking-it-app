import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublicStack from './PublicStack.navigation';
import { PublicStackParamList } from './navigation.type';
import PrivateStack from './PrivateStack.navigation';
import { useUserContext } from "~/context/UserContext";

const Stack = createNativeStackNavigator<PublicStackParamList>();

function RootStack() {
  const { isAuthenticated, isLoading } = useUserContext();

  // The native splash screen will be shown while isLoading is true
  // and will be hidden automatically when checkAuthStatus completes

  // Don't render anything while checking auth status
  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="PrivateStack" component={PrivateStack} />
      ) : (
        <Stack.Screen name="PublicStack" component={PublicStack} />
      )}
    </Stack.Navigator>
  );
}

export default RootStack;