import React from 'react'
import { NativeSyntheticEvent, TextInputChangeEventData, TextInputProps } from 'react-native'
import { ErrorMessage, TextContainer, TextInput, TextLabel } from './styles'
import Show from '~/components/Standart/Show'
import Colors from "~/theme/colors";

interface TextFieldProps extends TextInputProps {
    label?: string
    placeholder: string
    hasError: boolean
    errorMessage?: string
    value: string
    onChange?: ((e: NativeSyntheticEvent<TextInputChangeEventData>) => void) | undefined
    height?: number
}

export default function TextField({ label, placeholder, onChange, value, hasError, height, ...props }: TextFieldProps) {
    return (
        <TextContainer>
            <Show when={!!label}>
                <TextLabel>{label}</TextLabel>
            </Show>
            <TextInput
                style={{ height: height || 48 }}
                placeholderTextColor={Colors.darkTint}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                hasError={hasError}
                {...props}
            />
            <Show when={hasError}>
                <ErrorMessage>{props.errorMessage}</ErrorMessage>
            </Show>
        </TextContainer>
    )
}