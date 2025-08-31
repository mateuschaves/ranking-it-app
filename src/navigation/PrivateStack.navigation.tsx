import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '~/theme/colors';

import { RootStackParamList } from './navigation.type';
import BottomNavigation from "~/navigation/Bottom.navigation";
import ProfilePhotoScreen from '~/screens/Core/ProfilePhotoScreen';
import UserPendingInvitesScreen from '~/screens/Core/UserPendingInvitesScreen';
import NotificationTest from '~/components/NotificationTest';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente separado para o header personalizado
function CustomBackButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ marginLeft: 16 }}
      onPress={() => navigation.goBack()}
    >
      <ArrowLeft size={24} color={Colors.darkTint} weight="bold" />
    </TouchableOpacity>
  );
}

function PrivateStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="BottomNavigator" component={BottomNavigation} />
      <Stack.Screen name="ProfilePhotoScreen" component={ProfilePhotoScreen} options={{ headerShown: true, headerTransparent: true, headerTitle: '', headerBackVisible: false }} />
      <Stack.Screen
        name="UserPendingInvitesScreen"
        component={UserPendingInvitesScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => <CustomBackButton />,
        }}
      />
      <Stack.Screen
        name="NotificationTestScreen"
        component={NotificationTest}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: 'Notification Test',
          headerBackVisible: false,
          headerLeft: () => <CustomBackButton />,
        }}
      />
    </Stack.Navigator>
  );
}

export default PrivateStack;