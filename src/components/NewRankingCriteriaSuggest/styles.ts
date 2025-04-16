import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.darkTint};
  padding: 8px 16px;
  border-radius: 12px;
  color: '#ffffff';

  height: 36px;

  justify-content: center;
  align-items: center;

  margin: 8px 4px;
`;

export const SuggestName = styled.Text`
    font-size: 16px;
    color: '#ffffff';
    text-align: center;
`