import React, { useState } from 'react'
import { Container, Content } from '~/components/BaseScreen'
import Button from '~/components/Button'
import TextField from '~/components/TextField'
import { TextTitle } from '~/components/Typography/TextTitle'
import { Trophy } from 'phosphor-react-native'

import theme from '~/theme'
import Colors from '~/theme/colors'

export default function CreateRankingScreen() {
    const [rankingName, setRankingName] = useState<string>('')
    const [rankingDescription, setRankingDescription] = useState<string>('')
  return (
    <Container>
        <Content>
            <TextTitle fontWeigth={theme.weights.lg}>Crie seu ranking</TextTitle>
            <TextField placeholder="Ex. Top 10 músicas" value={rankingName} onChangeText={setRankingName} hasError={false} label='Título' />
            <TextField placeholder="Ex. Músicas preferidas do momento" value={rankingDescription} onChangeText={setRankingDescription} hasError={false} label='Descrição' />
            <Button title='Criar ranking' iconLeft={<Trophy color={Colors.white} />} onPress={() => {}} />
        </Content>
    </Container>
  )
}