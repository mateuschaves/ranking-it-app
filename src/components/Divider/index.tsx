import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '~/theme/colors';

const Divider: React.FC = () => {
    return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
    divider: {
        height: 0.5,
        backgroundColor: Colors.darkTint,
    },
});

export default Divider;