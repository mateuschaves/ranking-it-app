import Styled from 'styled-components/native';
import { Image } from 'react-native';

export const Container = Styled.TouchableOpacity`
  flex-direction: column;
  border-radius: 10px;
  margin-bottom: 20px;
`;

export const RankingBanner = Styled(Image)`    
    width: 100%;
    height: 140px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
`;

export const RankingTitle = Styled.Text`
    font-size: 26px;
    font-weight: 600;
    margin-top: 10px;
`