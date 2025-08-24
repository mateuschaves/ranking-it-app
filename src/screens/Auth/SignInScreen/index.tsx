import React, { useState } from 'react';
import TextInput from '~/components/TextField';

import { isValidEmail } from '~/utils/validation';
import { hapticFeedback, HapticsType } from '~/utils/feedback';
import { Container, Content } from "~/components/BaseScreen";
import Button from "~/components/Button";
import { TextTitle } from "~/components/Typography/TextTitle";
import Colors from "~/theme/colors";
import { useUserContext } from '~/context/UserContext';
import { useMutation } from '@tanstack/react-query';
import { SignInWithEmailAndPassword, SignInWithEmailAndPasswordResponse } from '~/api/resources/auth/signin.resource';
import { QuerieKeys } from '~/api/resources/querie-keys';
import { toast } from 'sonner-native';
import { Keyboard } from 'react-native';
import { asyncStorage, StorageKeys } from '~/shared/storage_service';

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const { setIsAuthenticated } = useUserContext();
  const {
    mutateAsync: SignInWithEmailAndPasswordFn,
    isPending: isSignInLoading,
  } = useMutation({
    mutationFn: SignInWithEmailAndPassword,
    mutationKey: [QuerieKeys.SigninWithEmailAndPassword],
    networkMode: 'online',
    onSuccess: handleSuccessAuth,
    onError: () => {
      Keyboard.dismiss();
      hapticFeedback(HapticsType.ERROR);
      toast.error('E-mail ou senha inválidos');
      setPassword('');
    }
  });

  function clearForm() {
    setEmail('');
    setPassword('');
    setHasError(false);
  }

  async function handleSuccessAuth(response: SignInWithEmailAndPasswordResponse) {
    await asyncStorage.setItem(StorageKeys.ACCESS_TOKEN, response.accessToken);
    Keyboard.dismiss();
    hapticFeedback(HapticsType.SUCCESS);
    setIsAuthenticated(true);
    clearForm();
  }

  async function handleContinue() {
    if (!isValidEmail(email)) {
      setHasError(true)
      hapticFeedback(HapticsType.ERROR);
      return;
    }

    await SignInWithEmailAndPasswordFn({
      email,
      password,
    })
  }

  return (
    <Container>
      <Content>
        <TextTitle>Entre para visualizar seus rankings</TextTitle>
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
        <TextInput
          placeholder="Senha"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          hasError={false}
          placeholderTextColor={Colors.darkTint}
        />
        <Button onPress={handleContinue} title={'Entrar'} loading={isSignInLoading} />
      </Content>
    </Container>
  );
};

export default SignInScreen;