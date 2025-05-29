import { View, Image, Text, ScrollView, TouchableOpacity } from 'react-native'
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
    <View style={{ flex: 1, backgroundColor: Colors.background, paddingTop: theme.padding.xl + 20 }}>
        <Content>
            <View style={{
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.margin.xl,
            }}>
                <TouchableOpacity onPress={handleClickRankingItem}>
                    <PlusCircle
                        size={40}
                        color={theme.colors.darkTint}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {rankingItemsScoresGroupedByCriteria && Object.keys(rankingItemsScoresGroupedByCriteria).map((criteriaId) => (
                    <View key={criteriaId}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: Colors.darkTint,
                            marginBottom: theme.margin.sm,
                        }}>{captalizeFirstLetter(rankingItemsScoresGroupedByCriteria[criteriaId][0].rankingCriteria.name)}</Text>
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
                                        <Image
                                            source={{ uri: getImageUrl(item.user.avatar.path) }}
                                            style={{ width: 40, height: 40, borderRadius: 20 }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Text>{item.user.name[0]}</Text>
                                    )}
                                </View>
                                <View>
                                    <Text style={{
                                        fontSize: 16,
                                        color: Colors.darkTint,
                                    }}>{captalizeFirstLetter(item.score.toFixed(2))}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </Content>
    </View>
  )
}