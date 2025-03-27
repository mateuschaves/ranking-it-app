import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublicStack from './PublicStack.navigation';
import { PublicStackParamList } from './navigation.type';
import PrivateStack from './PrivateStack.navigation';
import {asyncStorage} from "~/shared/storage_service";
import {useUserContext} from "~/context/UserContext";

const Stack = createNativeStackNavigator<PublicStackParamList>();

function RootStack() {
  const { isAuthenticated, setIsAuthenticated } = useUserContext()
  useLayoutEffect(useCallback(() => {
      asyncStorage.getItem('accessToken').then((accessToken) => {
        if (accessToken) {
          try {
            const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
            if (decodedToken.exp * 1000 > Date.now()) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error("Invalid token format", error);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      })
  }, []), []);

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