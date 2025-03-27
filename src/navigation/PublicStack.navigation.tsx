import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '~/screens/Auth/SignUpScreen';

import { RootStackParamList } from './navigation.type';
import SignUpEmailScreen from '~/screens/Auth/EmailScreen';
import SignUpPasswordScreen from '~/screens/Auth/PasswordScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function PublicStack() {
  return (
      <Stack.Navigator screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerTransparent: true,
      }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUpEmailScreen" component={SignUpEmailScreen} />
        <Stack.Screen name="SignUpPasswordScreen" component={SignUpPasswordScreen} />
      </Stack.Navigator>
  );
}

export default PublicStack;