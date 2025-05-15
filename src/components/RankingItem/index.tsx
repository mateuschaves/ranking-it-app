import React from 'react'

import * as Styles from './styles'
import {LinearGradient} from "expo-linear-gradient";
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

export default function RankingItem({ onPress, title, photo, onLongPress}: RankingItemProps) {
    const photoFormated = `${constants.bucketUrl}/${photo?.name}`;
    return (
        <Styles.Container onPress={onPress} onLongPress={onLongPress}>
            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}>
                    <Styles.RankingBanner
                        cacheKey={photoFormated}
                        placeholderContent={(
                            <ActivityIndicator 
                              color={Colors.darkTint}
                              size="small"
                              style={{ flex: 1, justifyContent: "center" }}
                            />
                          )}
                        source={{
                            uri: photoFormated ? photoFormated : constants.bannerPlaceholder,
                        }}
                    />
            </LinearGradient>
            <Styles.RankingTitle>{title}</Styles.RankingTitle>
        </Styles.Container>
    )
}