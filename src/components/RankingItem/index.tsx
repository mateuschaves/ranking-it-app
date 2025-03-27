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
                        <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']} style={{flex: 1}}>
                               <Styles.RankingBanner
                                   blurRadius={0.5}
                                   source={{
                                       uri: `https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=`
                                   }}
                               />
                        </LinearGradient>
                        <Styles.RankingTitle>{title}</Styles.RankingTitle>
                </Styles.Container>
    )
}