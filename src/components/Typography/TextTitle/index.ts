import styled from "styled-components/native";
import theme from "~/theme";

interface TextTitleProps {
    fontWeigth?: typeof theme.weights;
}

export const TextTitle = styled.Text<TextTitleProps>`
    font-size: 26px;
    font-weight: ${(props) => props.fontWeigth || theme.weights.md};
    color: ${(props) => props.theme.colors.textHiglight};
    margin-bottom: 16px;
`;