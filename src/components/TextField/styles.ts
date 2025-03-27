import styled from 'styled-components/native';

interface TextInputProps {
    hasError: boolean;
}

export const TextInput = styled.TextInput<TextInputProps>`
    background-color: transparent;
    border-radius: 8px;
    height: 48px;
    padding: 0 16px;
    border-width: 1px;
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.darkTint};
    color: ${props => props.theme.colors.darkTint};
`;

export const TextContainer = styled.View`
    width: 100%;
    margin-bottom: 16px;
`;

export const TextLabel = styled.Text`
    color: ${props => props.theme.colors.darkTint};
    font-size: 16px;
    margin-bottom: 8px;
`;

export const ErrorMessage = styled.Text`
    color: ${(props) => props.theme.colors.error};
    font-size: 12px;
    margin-top: 4px;
`

