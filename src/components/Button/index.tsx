import React from 'react'

import * as Styles from './styles'
import Show from '../Standart/Show'

export interface ButtonProps {
    onPress: () => void
    title: string
    loading?: boolean
    variant?: 'filled' | 'outlined'
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
}

export default function Button({ onPress, title, loading = false, iconLeft, variant = 'filled' }: ButtonProps) {
    function performOnPress() {
        if (loading) return;
        onPress();
    }

    return (
        <Styles.Container onPress={performOnPress} variant={variant}>
            <Show when={!loading}>
                {iconLeft && iconLeft}
                <Styles.Text variant={variant}>{title}</Styles.Text>
            </Show>
            <Show when={loading}>
                <Styles.ActivityIndicator />
            </Show>
        </Styles.Container>
    )
}