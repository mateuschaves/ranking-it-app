import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '~/theme/colors';

interface LoadingProps {
    size?: 'small' | 'large';
    color?: string;
}

export default function Loading({
    size = 'large',
    color = Colors.darkTint
}: LoadingProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
});
