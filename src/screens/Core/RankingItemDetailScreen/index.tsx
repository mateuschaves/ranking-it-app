import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Content } from '~/components/BaseScreen'
import Colors from '~/theme/colors'
import theme from '~/theme'
import { useQuery } from '@tanstack/react-query'
import { GetRankingItemScores, GetRankingItemScoresResponse } from '~/api/resources/core/get-ranking-item-votes'
import { QuerieKeys } from '~/api/resources/querie-keys'
import { useRoute, RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '~/navigation/navigation.type'
import { getImageUrl } from '~/utils/image'
import { captalizeFirstLetter } from '~/utils/general'
import { PlusCircle } from 'phosphor-react-native'
import navigationService from '~/services/navigation.service'
import CachedImage from 'expo-cached-image'
import { ActivityIndicator } from 'react-native'

export default function RankingItemDetailScreen() {
    const { params } = useRoute<RouteProp<RootStackParamList, 'RankingItemDetailScreen'>>();
    const {
        data: rankingItemScores,
    } = useQuery({
        queryKey: [QuerieKeys.GetRankingItemsScores, params.rankingItemId, params.rankingId],
        queryFn: () => GetRankingItemScores({ rankingItemId: params.rankingItemId, rankingId: params.rankingId }),
        networkMode: 'online',
        retry: 2,
    })

    const rankingItemsScoresGroupedByCriteria = rankingItemScores?.reduce((acc, item) => {
        const criteriaId = item.rankingCriteria.id;
        if (!acc[criteriaId]) {
            acc[criteriaId] = [];
        }

        acc[criteriaId].push(item);
        return acc;
    }, {} as Record<string, GetRankingItemScoresResponse[]>);


    function handleClickRankingItem() {
        navigationService.navigate('CreateRankingItemScoreScreen', {
            rankingItemId: params.rankingItemId,
            rankingId: params.rankingId,
        })
    }

    return (
        <Content>
            <ScrollView showsVerticalScrollIndicator={false}>
                {rankingItemsScoresGroupedByCriteria &&
                    Object.keys(rankingItemsScoresGroupedByCriteria).map((criteriaId) => (
                        <View key={criteriaId} style={{ marginBottom: theme.margin.lg }}>
                            <Text style={{ fontSize: theme.text.lg, fontWeight: theme.weights.lg, marginBottom: theme.margin.sm }}>
                                {captalizeFirstLetter(rankingItemsScoresGroupedByCriteria[criteriaId][0].rankingCriteria.name)}
                            </Text>

                            {rankingItemsScoresGroupedByCriteria[criteriaId].map((item) => (
                                <View
                                    key={item.id}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: theme.padding.sm,
                                        backgroundColor: Colors.white,
                                        borderRadius: 8,
                                        marginBottom: theme.margin.sm,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 35,
                                            height: 35,
                                            borderRadius: 20,
                                            backgroundColor: Colors.tint,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: theme.margin.sm,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {item.user.avatar.path ? (
                                            <CachedImage
                                                source={{ uri: getImageUrl(item.user.avatar.path) }}
                                                style={{ width: 40, height: 40, borderRadius: 20 }}
                                                cachePolicy="memory-disk"
                                                cacheControl="immutable"
                                                cacheControlExpiry={1000 * 60 * 60 * 24 * 30} // 30 days
                                                cacheKey={`user-avatar-${item.user.id}`}
                                                placeholderContent={(
                                                    <ActivityIndicator
                                                        color={Colors.white}
                                                        size="small"
                                                    />
                                                )}
                                                resizeMode="cover"
                                                onError={(error: any) => {
                                                    console.warn('Avatar loading error:', error);
                                                }}
                                            />
                                        ) : (
                                            <Text>{item.user.name[0]}</Text>
                                        )}
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: theme.text.md, fontWeight: theme.weights.md }}>
                                            {item.user.name}
                                        </Text>
                                    </View>

                                    <Text style={{ fontSize: theme.text.lg, fontWeight: theme.weights.lg }}>
                                        {item.score}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}

                {(!rankingItemsScoresGroupedByCriteria || Object.keys(rankingItemsScoresGroupedByCriteria).length === 0) && (
                    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <Text style={{ fontSize: theme.text.md, textAlign: 'center', marginBottom: theme.margin.lg }}>
                            Nenhuma pontuação adicionada ainda.
                        </Text>
                        <TouchableOpacity
                            onPress={handleClickRankingItem}
                            style={{
                                backgroundColor: Colors.darkTint,
                                paddingHorizontal: theme.padding.lg,
                                paddingVertical: theme.padding.md,
                                borderRadius: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <PlusCircle size={20} color={Colors.white} style={{ marginRight: 8 }} />
                            <Text style={{ color: Colors.white, fontSize: theme.text.md }}>
                                Adicionar pontuação
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </Content>
    )
}