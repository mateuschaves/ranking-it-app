import styled from "styled-components/native";


export const Container = styled.View`
    flex: 1;
    margin-top: 20px;
    background-color: ${(props) => props.theme.colors.background};
`;

export const ImagePickerContainer = styled.TouchableOpacity`
    flex-direction: column;
    flex: 1;
    height: 140px;
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.colors.darkTint};
    justify-content: center;
    align-items: center;
`;

export const ImagePreview = styled.Image`
    width: 100%;
    height: 100%;
    border-radius: 8px;
`