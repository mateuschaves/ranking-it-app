import React from 'react'

import * as Styles from './styles'
import Show from '../Standart/Show'
import Colors from '~/theme/colors'

export interface ButtonProps {
    onPress: () => void
    title: string
    loading?: boolean
    variant?: 'filled' | 'outlined'
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
}

export default function Button({ onPress, title, loading = false, iconLeft, variant = 'filled', iconRight }: ButtonProps) {
    function performOnPress() {
        if (loading) return;
        onPress();
    }

    return (
        <Styles.Container onPress={performOnPress} variant={variant}>
            <Show when={!loading}>
                {iconLeft && iconLeft}
                <Styles.Text variant={variant}>{title}</Styles.Text>
                {iconRight && iconRight}
            </Show>
            <Show when={loading}>
                <Styles.ActivityIndicator color={variant === 'filled' ? Colors.white : Colors.darkTint} />
            </Show>
        </Styles.Container>
    )
}