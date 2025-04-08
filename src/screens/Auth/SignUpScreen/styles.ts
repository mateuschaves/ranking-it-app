import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    align-items: center;
    justify-content: center;
`;

export const Title = styled.Text`
    font-size: 26px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.textHiglight};
    text-align: center;
    margin-top: 20px;
    margin-bottom: 100px;
`;

export const RankingLottie = styled(LottieView)`
    width: 100%;
    height: 100px;
`;

export const SignInOptions = styled.View`
    width: 100%;
    padding: 0 32px;
    margin-top: 20px;
    gap: 16px;
`;