import styled from "styled-components/native";
import theme from "~/theme";

interface TextTitleProps {
    fontWeight?: typeof theme.weights;
}

export const TextTitle = styled.Text<TextTitleProps>`
    font-size: 26px;
    font-weight: ${(props) => props.fontWeight || theme.weights.md};
    color: ${(props) => props.theme.colors.darkTint};
    margin-bottom: 16px;
`;