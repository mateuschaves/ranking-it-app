import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native'
import React from 'react'
import { Container, Content } from '~/components/BaseScreen'
import Colors from '~/theme/colors'
import theme from '~/theme'
import { useQuery } from '@tanstack/react-query'
import { GetRankingItemScores, GetRankingItemScoresResponse } from '~/api/resources/core/get-ranking-item-votes'
import { QuerieKeys } from '~/api/resources/querie-keys'
import { useRoute, RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '~/navigation/navigation.type'
import { getImageUrl } from '~/utils/image'
import { captalizeFirstLetter } from '~/utils/general'
import { PlusCircle, User, Star } from 'phosphor-react-native'
import navigationService from '~/services/navigation.service'
import { Image } from 'react-native'
import { TextTitle } from '~/components/Typography/TextTitle'
import { NormalText } from '~/components/Typography/NormalText'

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
        <Container>
            <Content>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                    {rankingItemsScoresGroupedByCriteria &&
                        Object.keys(rankingItemsScoresGroupedByCriteria).map((criteriaId) => (
                            <View key={criteriaId} style={styles.criteriaSection}>
                                <View style={styles.criteriaHeader}>
                                    <View style={styles.criteriaInfo}>
                                        <Star size={18} color={Colors.darkTint} weight="bold" />
                                        <TextTitle style={styles.criteriaTitle}>
                                            {captalizeFirstLetter(rankingItemsScoresGroupedByCriteria[criteriaId][0].rankingCriteria.name)}
                                        </TextTitle>
                                    </View>
                                    <View style={styles.averageContainer}>
                                        {rankingItemsScoresGroupedByCriteria[criteriaId].length > 0 ? (
                                            <>
                                                <Star size={16} color={Colors.darkTint} weight="fill" />
                                                <NormalText style={styles.averageText}>
                                                    {(rankingItemsScoresGroupedByCriteria[criteriaId].reduce((sum, item) => sum + item.score, 0) / rankingItemsScoresGroupedByCriteria[criteriaId].length).toFixed(1)}
                                                </NormalText>
                                            </>
                                        ) : (
                                            <NormalText style={styles.noScoreText}>
                                                Não avaliado
                                            </NormalText>
                                        )}
                                    </View>
                                </View>

                                {rankingItemsScoresGroupedByCriteria[criteriaId].map((item) => (
                                    <View key={item.id} style={styles.scoreCard}>
                                        <View style={styles.userSection}>
                                            {item.user.avatar.url ? (
                                                <Image
                                                    source={{ uri: item.user.avatar.url }}
                                                    style={styles.userAvatar}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View style={styles.avatarPlaceholder}>
                                                    <User size={16} color={Colors.white} weight="bold" />
                                                </View>
                                            )}

                                            <View style={styles.userInfo}>
                                                <NormalText style={styles.userName}>
                                                    {item.user.name}
                                                </NormalText>
                                            </View>
                                        </View>

                                        <View style={styles.scoreSection}>
                                            <NormalText style={styles.scoreText}>
                                                {item.score}
                                            </NormalText>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}

                    {(!rankingItemsScoresGroupedByCriteria || Object.keys(rankingItemsScoresGroupedByCriteria).length === 0) && (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconContainer}>
                                <Star size={64} color={Colors.textHiglight} weight="light" />
                            </View>
                            <TextTitle style={styles.emptyTitle}>
                                Nenhuma pontuação ainda
                            </TextTitle>
                            <NormalText style={styles.emptySubtitle}>
                                Seja o primeiro a pontuar este item!
                            </NormalText>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.addButtonContainer}>
                    <TouchableOpacity
                        onPress={handleClickRankingItem}
                        style={styles.addButton}
                        activeOpacity={0.8}
                    >
                        <PlusCircle size={24} color={Colors.white} weight="bold" />
                        <NormalText style={styles.addButtonText}>
                            Avaliar este item
                        </NormalText>
                    </TouchableOpacity>
                </View>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    criteriaSection: {
        marginBottom: 24,
    },
    criteriaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    criteriaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    criteriaTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.darkTint,
        marginLeft: 10,
        lineHeight: 20,
        includeFontPadding: false,
        textAlignVertical: 'center',
        marginBottom: 0,
    },
    averageContainer: {
        backgroundColor: Colors.darkTint,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    averageText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.white,
        marginLeft: 4,
    },
    noScoreText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textHiglight,
        fontStyle: 'italic',
    },
    scoreCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginHorizontal: 4,
        marginBottom: 12,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.darkTint,
        marginRight: 16,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.darkTint,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.darkTint,
    },
    scoreSection: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minWidth: 48,
    },
    scoreText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.darkTint,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyIconContainer: {
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.darkTint,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 18,
        color: Colors.textHiglight,
        textAlign: 'center',
        lineHeight: 24,
    },
    addButtonContainer: {
        paddingHorizontal: 4,
        paddingVertical: 24,
        paddingBottom: Platform.OS === 'android' ? 100 : 32,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: Colors.background,
    },
    addButton: {
        backgroundColor: Colors.darkTint,
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.darkTint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    addButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 12,
    },
});