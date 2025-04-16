import React from 'react'
import { Container } from './styles';
import { Text } from 'react-native';
import Colors from '~/theme/colors';
import { Plus } from 'phosphor-react-native';

interface NewRankingCriteriaSuggestProps {
    name: string;
    onPress: () => void;
}

export default function NewRankingCriteriaSuggest({name, onPress}: NewRankingCriteriaSuggestProps) {
  return (
    <Container style={{
        backgroundColor: Colors.darkTint,
    }} onPress={onPress}>
        <Text style={{color: Colors.white, textAlign: 'center', fontSize: 16}}>{name}</Text>
        <Plus color={Colors.white} style={{marginLeft: 8}} size={16} />
    </Container>
  )
}