import styled from "styled-components/native";
import theme from "~/theme";

interface NormalTextProps {
    fontWeight?: typeof theme.weights;
}

export const NormalText = styled.Text<NormalTextProps>`
    font-size: 16px;
    font-weight: ${(props) => props.fontWeight || theme.weights.md};
    color: ${(props) => props.theme.colors.darkTint};
    margin-bottom: 16px;
`;