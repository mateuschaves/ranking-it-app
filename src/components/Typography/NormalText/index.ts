import styled from "styled-components/native";
import theme from "~/theme";

interface NormalTextProps  extends React.ComponentProps<typeof styled.Text> {
    fontWeight?: typeof theme.weights;
    color?: string;
}

export const NormalText = styled.Text<NormalTextProps>`
    font-size: 16px;
    font-weight: ${(props) => props.fontWeight || theme.weights.md};
    color: ${(props) => props.color || props.theme.colors.darkTint};
    margin-bottom: 16px;
`;