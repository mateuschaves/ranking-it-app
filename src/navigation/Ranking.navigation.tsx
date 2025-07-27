import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '~/theme/colors';

import { RootStackParamList } from './navigation.type';
import CreateRankingScreen from '~/screens/Core/CreateRankingScreen';
import HomeScreen from '~/screens/Core/HomeScreen';
import RankingDetailScreen from '~/screens/Core/RankingDetailScreen';
import RankingItemDetailScreen from '~/screens/Core/RankingItemDetailScreen';
import CreateRankingItemScoreScreen from '~/screens/Core/CreateRankingItemScoreScreen';
import CreateRankingItemScreen from '~/screens/Core/CreateRankingItemScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente separado para o header personalizado
function CustomBackButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ marginLeft: 8 }}
      onPress={() => navigation.goBack()}
    >
      <ArrowLeft size={24} color={Colors.darkTint} weight="bold" />
    </TouchableOpacity>
  );
}

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
      <Stack.Screen name="RankingDetailScreen" component={RankingDetailScreen} options={{
        headerBackVisible: false,
        headerLeft: () => <CustomBackButton />,
      }} />
      <Stack.Screen name="CreateRankingItemScreen" component={CreateRankingItemScreen} options={{
        title: 'Adicionar Item',
        headerTitle: 'Adicionar Item',
      }} />
      <Stack.Screen name="RankingItemDetailScreen" component={RankingItemDetailScreen} options={{
        presentation: 'modal',
        title: 'Pontuação',
        headerTitle: 'Pontuação',
      }} />
      <Stack.Screen name="CreateRankingItemScoreScreen" component={CreateRankingItemScoreScreen} options={{
        presentation: 'modal',
        title: 'Adicionar pontuação',
        headerTitle: 'Adicionar pontuação',
      }} />
    </Stack.Navigator>
  );
}

export default RankingNavigation;