import React from 'react';
import CachedImage from 'expo-cached-image';
import { ActivityIndicator, ImageStyle } from 'react-native';
import Colors from '~/theme/colors';

interface OptimizedCachedImageProps {
    uri: string;
    style: ImageStyle;
    cacheKey?: string;
    placeholderColor?: string;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    onError?: (error: any) => void;
    onLoad?: () => void;
}

export default function OptimizedCachedImage({
    uri,
    style,
    cacheKey,
    placeholderColor = Colors.darkTint,
    resizeMode = 'cover',
    onError,
    onLoad,
}: OptimizedCachedImageProps) {
    const defaultCacheKey = cacheKey || `image-${uri}`;

    return (
        <CachedImage
            source={{ uri }}
            style={style}
            cacheKey={defaultCacheKey}
            placeholderContent={(
                <ActivityIndicator
                    color={placeholderColor}
                    size="small"
                    style={{ flex: 1, justifyContent: "center" }}
                />
            )}
            resizeMode={resizeMode}
            onError={onError}
            onLoad={onLoad}
        />
    );
} 