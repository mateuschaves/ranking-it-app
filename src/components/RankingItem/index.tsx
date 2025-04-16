import React from 'react'

import * as Styles from './styles'
import {LinearGradient} from "expo-linear-gradient";
import constants from '~/config/consts';

export interface RankingItemProps {
    onPress: () => void
    title: string
    photo?: string
}

export default function RankingItem({ onPress, title, photo}: RankingItemProps) {

    return (
                <Styles.Container onPress={onPress}>
                    <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}>
                            <Styles.RankingBanner
                                blurRadius={0.5}
                                source={{
                                    uri: photo ? photo : constants.bannerPlaceholder,
                                    cache: 'force-cache',
                                    headers: {
                                            'Cache-Control': 'max-age=604800',
                                    },
                                    priority: 'high',
                                }}
                            />
                    </LinearGradient>
                    <Styles.RankingTitle>{title}</Styles.RankingTitle>
                </Styles.Container>
    )
}