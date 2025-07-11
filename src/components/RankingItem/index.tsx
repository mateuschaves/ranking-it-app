import React from 'react'

import * as Styles from './styles'
import { LinearGradient } from "expo-linear-gradient";
import constants from '~/config/consts';
import { ActivityIndicator } from 'react-native';
import Colors from '~/theme/colors';
import { Banner } from '~/api/resources/core/get-ranking-by-user';

export interface RankingItemProps {
    onPress: () => void
    onLongPress?: () => void
    title: string
    photo?: Banner
}

export default function RankingItem({ onPress, title, photo, onLongPress }: RankingItemProps) {
    const photoFormated = photo?.name ? `${constants.bucketUrl}/${photo.name}` : constants.bannerPlaceholder;

    return (
        <Styles.Container onPress={onPress} onLongPress={onLongPress}>
            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}>
                <Styles.RankingBanner
                    cachePolicy="memory-disk"
                    cacheControl="immutable"
                    cacheControlExpiry={1000 * 60 * 60 * 24 * 30} // 30 days instead of 7
                    cacheKey={`ranking-banner-${photo?.name || 'placeholder'}`}
                    placeholderContent={(
                        <ActivityIndicator
                            color={Colors.darkTint}
                            size="small"
                            style={{ flex: 1, justifyContent: "center" }}
                        />
                    )}
                    source={{
                        uri: photoFormated,
                    }}
                    onError={(error: any) => {
                        console.warn('Image loading error:', error);
                    }}
                />
            </LinearGradient>
            <Styles.RankingTitle>{title}</Styles.RankingTitle>
        </Styles.Container>
    )
}