import React from 'react';
import { View } from 'react-native';

interface WhitespaceProps {
    space?: number;
    direction?: 'horizontal' | 'vertical';
}

const Whitespace: React.FC<WhitespaceProps> = ({
    space = 10,
    direction = 'vertical',
}) => {
    const style = direction === 'vertical' 
        ? { height: space } 
        : { width: space };

    return <View style={style} />;
};

export default Whitespace;