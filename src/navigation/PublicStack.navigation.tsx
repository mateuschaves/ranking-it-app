import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './navigation.type';
import SignUpEmailScreen from '~/screens/Auth/EmailScreen';
import SignUpPasswordScreen from '~/screens/Auth/PasswordScreen';
import SignInScreen from '~/screens/Auth/SignInScreen';
import SignUpScreen from '~/screens/Auth/SignUpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function PublicStack() {
  return (
      <Stack.Navigator screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerTransparent: true,
      }}>
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpEmailScreen" component={SignUpEmailScreen} />
        <Stack.Screen name="SignUpPasswordScreen" component={SignUpPasswordScreen} />
      </Stack.Navigator>
  );
}

export default PublicStack;