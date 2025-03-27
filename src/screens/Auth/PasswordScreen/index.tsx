import React, {useContext, useEffect, useState} from 'react';
import { Container, Content } from '~/components/BaseScreen';
import TextInput  from '~/components/TextField';

import { hapticFeedback, HapticsType } from '~/utils/feedback';
import { SignUpWithEmailAndPassword } from '~/api/resources/auth/signup.resource';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/navigation.type';
import { QuerieKeys } from '~/api/resources/querie-keys';
import { toast } from 'sonner-native';
import {useMutation} from "@tanstack/react-query";
import Button from '~/components/Button';
import {TextTitle} from "~/components/Typography/TextTitle";
import {asyncStorage} from "~/shared/storage_service";
import navigationService from "~/services/navigation.service";
import {useUserContext} from "~/context/UserContext";

type SignUpPasswordScreenRouteProp = RouteProp<RootStackParamList, 'SignUpPasswordScreen'>;

const SignUpPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isPassworMatch, setIsPasswordMatch] = useState<boolean>(true)

  const { setIsAuthenticated } = useUserContext()

  const { params } = useRoute<SignUpPasswordScreenRouteProp>();

  useEffect(() => {
    if (!isPassworMatch) {
      setIsPasswordMatch(true)
    }
  }, [password, confirmPassword])

  const {
    mutateAsync: SignUpWithEmailAndPasswordFn,
    isPending: isSignUpLoading,
  } = useMutation({
    mutationFn: SignUpWithEmailAndPassword,
    mutationKey: [QuerieKeys.SignupWithEmailAndPassword],
    networkMode: 'online',
    onSuccess: () => {
      toast.success('Cadastro realizado com sucesso 🎉');
      setIsAuthenticated(true);
    },
  })

  function isPasswordValid(_password: string, _confirmPassword: string) {
    return (_password === _confirmPassword) 
  }

  async function handleSignUp() {
    if(!isPasswordValid(password, confirmPassword)) {
      hapticFeedback(HapticsType.ERROR)
      setIsPasswordMatch(false)
      return;
    }

    const signUpresponse = await SignUpWithEmailAndPasswordFn({
      password,
      email: params.email,
    })

    signUpresponse.accessToken && asyncStorage.setItem(
      'accessToken',
      signUpresponse.accessToken)
  }

  return (
      <Container>
        <Content>
          <TextTitle>Agora vamos criar uma senha!</TextTitle>
          <TextInput
              autoFocus
              autoCapitalize='none'
              accessibilityLabel="Campo de senha"
              accessibilityHint="Digite a senha para confirmar"
              placeholder='Digite sua senha'
              keyboardType='default'
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              hasError={!isPassworMatch}
              errorMessage='As senhas não conferem'

          />
          <TextInput
              autoCapitalize='none'
              accessibilityLabel="Campo de confirmação de senha"
              accessibilityHint="Digite a senha novamente para confirmar"
              placeholder='Confirme sua senha'
              keyboardType='default'
              secureTextEntry
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              hasError={!isPassworMatch}
              errorMessage='As senhas não conferem'
          />
          <Button onPress={handleSignUp} loading={isSignUpLoading} title={'Criar conta'} />
        </Content>
     </Container>
  );
}

export default SignUpPasswordScreen;