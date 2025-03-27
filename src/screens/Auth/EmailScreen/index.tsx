import React, { useState } from 'react';
import TextInput from '~/components/TextField';

import navigationService from '~/services/navigation.service';
import { isValidEmail } from '~/utils/validation';
import { hapticFeedback, HapticsType } from '~/utils/feedback';
import {Container, Content} from "~/components/BaseScreen";
import Button from "~/components/Button";
import {TextTitle} from "~/components/Typography/TextTitle";
import Colors from "~/theme/colors";

const SignUpEmailScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [hasError, setHasError] = useState(false);


  function handleContinue() {
    if (!isValidEmail(email)) {
      setHasError(true)
      hapticFeedback(HapticsType.ERROR);
      return;
    }

    setHasError(false)

    navigationService.navigate('SignUpPasswordScreen', {
      email,
    });
  }

  return (
    <Container>
      <Content>
        <TextTitle>Qual seu melhor e-mail ?</TextTitle>
        <TextInput
          autoFocus
          autoCapitalize="none"
          accessibilityLabel="Campo de e-mail"
          accessibilityHint="Digite o e-mail para continuar"
          placeholder="E-mail"
          keyboardType="email-address"
          errorMessage="E-mail inválido"
          onChangeText={setEmail}
          value={email}
          hasError={hasError}
          placeholderTextColor={Colors.darkTint}
        />

        <Button onPress={handleContinue} title={'Continuar'} />
      </Content>
    </Container>
  );
};

export default SignUpEmailScreen;