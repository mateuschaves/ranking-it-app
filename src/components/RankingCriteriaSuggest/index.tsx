import React from 'react'
import { Container } from './styles';
import { ActivityIndicator, Text } from 'react-native';
import Colors from '~/theme/colors';
import Show from '../Standart/Show';

interface RankingCriteriaSuggestProps {
    name: string;
    id: string;
    onPress: () => void;
    loading?: boolean;
    selected: boolean;
}

export default function RankingCriteriaSuggest({name, onPress, loading, selected}: RankingCriteriaSuggestProps) {
  return (
    <Container style={{
        backgroundColor: selected ? Colors.tint : Colors.darkTint,
    }} onPress={onPress}>
        <Show when={!!loading}>
          <ActivityIndicator color={selected ? Colors.darkTint : Colors.white} style={{marginLeft: 8}}/>
        </Show>
        <Show when={!loading}>
          <Text style={{color: selected ? Colors.darkTint : Colors.white, textAlign: 'center', fontSize: 16}}>{name}</Text>
        </Show>
    </Container>
  )
}