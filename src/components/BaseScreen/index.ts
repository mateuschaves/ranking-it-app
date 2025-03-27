import styled from "styled-components/native";
import theme from "~/theme";

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`;

export const Content = styled.View`
    flex: 1;
    padding: ${theme.padding.sm}px ${theme.padding.md}px;
`;