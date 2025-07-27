import styled from "styled-components/native";
import {ButtonProps} from "~/components/Button/index";

const Container = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({theme, variant}) => variant == 'filled' ? theme?.colors?.darkTint : 'transparent'};
    border-color: ${({theme, variant}) => variant == 'filled' ? theme?.colors?.darkTint : theme?.colors?.textHiglight};
    border-width: 1px;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 100%;
  margin-top: 8px;
  height: 48px;
  padding: 0 16px;
`;

const Text = styled.Text<ButtonProps>`
  color: ${({variant, theme}) => variant == 'filled' ? theme?.colors?.white : theme?.colors?.darkTint};
  margin-left: 8px;
`;

const ActivityIndicator = styled.ActivityIndicator.attrs<ButtonProps>({
    size: "small",
})``;

export { Container, Text, ActivityIndicator };