import React from 'react';
import {RankingLottie, SignInOptions, Title} from './styles';

import {Container} from '~/components/BaseScreen';

import {Envelope} from 'phosphor-react-native';

import * as RankingAnimation from '~/assets/animations/ranking.json';
import navigationService from "~/services/navigation.service";
import Button from "~/components/Button";
import Colors from "~/theme/colors";

export default function SignUpScreen() {
    function handleSignIn() {
        navigationService.navigate('SignInScreen');
    }
    function handleSignUp() {
        navigationService.navigate('SignUpEmailScreen');
    }

    return (
        <Container>
            <RankingLottie
                autoPlay
                loop
                source={RankingAnimation}
            />
            <Title>{`Entre e comece seu ranking!`}</Title>
            <SignInOptions>
                <Button onPress={handleSignIn} iconLeft={<Envelope color={Colors.white} />} title={'Entrar com e-mail'} />
                <Button onPress={handleSignUp} title={'Não tenho conta'} variant={'outlined'}/>
            </SignInOptions>
        </Container>
    );
}
