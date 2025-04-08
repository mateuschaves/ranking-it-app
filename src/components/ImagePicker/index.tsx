import React from 'react'
import { Container, ImagePickerContainer, ImagePreview } from './styles'

import {Image} from 'phosphor-react-native'
import Button from '../Button';
import Show from '../Standart/Show';

interface ImagePickerProps {
    onPress: () => void;
    image: string | null;
    loading?: boolean;
}

export default function ImagePicker({onPress, image, loading = false}: ImagePickerProps) {
  return (
    <Container>
        <ImagePickerContainer onPress={onPress}>
            <Show when={!image}>
                <Image size={34} />
            </Show>
            <Show when={!!image}>
                <ImagePreview source={{ uri: image }} />
            </Show>
        </ImagePickerContainer>
        <Button
            iconLeft={image && <Image size={24} />}
            variant='outlined'
            title={'Adicionar imagem'}
            onPress={onPress}
            loading={loading}
        />
    </Container>
  )
}