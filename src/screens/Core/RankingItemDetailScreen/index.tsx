import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Platform, Modal, Dimensions } from 'react-native'
import React from 'react'
import { Container, Content } from '~/components/BaseScreen'
import Colors from '~/theme/colors'
import theme from '~/theme'
import { useQuery } from '@tanstack/react-query'
import { GetRankingItemScores, GetRankingItemScoresResponse } from '~/api/resources/core/get-ranking-item-votes'
import { GetRankingItems, GetRankingItemsResponse } from '~/api/resources/core/get-ranking-items'
import { QuerieKeys } from '~/api/resources/querie-keys'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '~/navigation/navigation.type'
import { getImageUrl } from '~/utils/image'
import { captalizeFirstLetter } from '~/utils/general'
import { PlusCircle, User, Star, PencilSimple } from 'phosphor-react-native'
import navigationService from '~/services/navigation.service'
import { Image } from 'react-native'
import { TextTitle } from '~/components/Typography/TextTitle'
import { NormalText } from '~/components/Typography/NormalText'

export default function RankingItemDetailScreen() {
    const { params } = useRoute<RouteProp<RootStackParamList, 'RankingItemDetailScreen'>>();
    const navigation = useNavigation();
    const {
        data: rankingItemScores,
    } = useQuery({
        queryKey: [QuerieKeys.GetRankingItemsScores, params.rankingItemId, params.rankingId],
        queryFn: () => GetRankingItemScores({ rankingItemId: params.rankingItemId, rankingId: params.rankingId }),
        networkMode: 'online',
        retry: 2,
    })

    // Fetch ranking items to extract this item's photos for gallery
    const { data: rankingItemsForPhotos } = useQuery({
        queryKey: [QuerieKeys.GetRankingItems, params.rankingId, 'PHOTOS'],
        queryFn: () => GetRankingItems({ id: params.rankingId }),
        networkMode: 'online',
        retry: 2,
    })

    const currentItemPhotos: string[] = React.useMemo(() => {
        const found = (rankingItemsForPhotos as GetRankingItemsResponse[] | undefined)?.find(i => i.id === params.rankingItemId)
        if (!found) return []
        return (found.rankingItemUserPhoto || [])
            .map(p => p.photo?.uri)
            .filter((uri): uri is string => Boolean(uri))
    }, [rankingItemsForPhotos, params.rankingItemId])

    const currentItemName: string | undefined = React.useMemo(() => {
        const found = (rankingItemsForPhotos as GetRankingItemsResponse[] | undefined)?.find(i => i.id === params.rankingItemId)
        return found?.name
    }, [rankingItemsForPhotos, params.rankingItemId])

    React.useLayoutEffect(() => {
        if (currentItemName) {
            // @ts-ignore - navigation type generic not specified here
            navigation.setOptions({ title: currentItemName, headerTitle: currentItemName })
        }
    }, [currentItemName, navigation])

    const [galleryIndex, setGalleryIndex] = React.useState(0)
    const [viewerOpen, setViewerOpen] = React.useState(false)
    const [viewerIndex, setViewerIndex] = React.useState(0)

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

    function handleEditItem() {
        navigationService.navigate('EditRankingItemScreen', {
            rankingItemId: params.rankingItemId,
            rankingId: params.rankingId,
        })
    }

    return (
        <Container>
            <Content>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                    {currentItemPhotos.length > 0 && (
                        <View style={styles.galleryContainer}>
                            <ScrollView
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.galleryScroll}
                                onMomentumScrollEnd={(e) => {
                                    const width = Dimensions.get('window').width - 8
                                    const idx = Math.round(e.nativeEvent.contentOffset.x / width)
                                    setGalleryIndex(idx)
                                }}
                            >
                                {currentItemPhotos.map((uri, idx) => (
                                    <TouchableOpacity key={uri} activeOpacity={0.9} onPress={() => { setViewerIndex(idx); setViewerOpen(true) }}>
                                        <Image source={{ uri }} style={styles.galleryImage} resizeMode="cover" />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <View style={styles.dotsContainer}>
                                {currentItemPhotos.map((_, idx) => (
                                    <View key={idx} style={[styles.dot, idx === galleryIndex && styles.dotActive]} />
                                ))}
                            </View>
                        </View>
                    )}
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
                                            <NormalText style={styles.averageText}>
                                                {(rankingItemsScoresGroupedByCriteria[criteriaId].reduce((sum, item) => sum + item.score, 0) / rankingItemsScoresGroupedByCriteria[criteriaId].length).toFixed(1)}
                                            </NormalText>
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
                        <PlusCircle size={20} color={Colors.white} weight="bold" />
                        <NormalText style={styles.addButtonText}>
                            Avaliar este item
                        </NormalText>
                    </TouchableOpacity>
                </View>
            </Content>
            {/* Fullscreen viewer */}
            <Modal visible={viewerOpen} transparent animationType="fade" onRequestClose={() => setViewerOpen(false)}>
                <View style={styles.viewerBackdrop}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        contentOffset={{ x: (Dimensions.get('window').width) * viewerIndex, y: 0 }}
                        style={{ flex: 1 }}
                    >
                        {currentItemPhotos.map((uri) => (
                            <Image key={uri} source={{ uri }} style={styles.viewerImage} resizeMode="contain" />
                        ))}
                    </ScrollView>
                    <TouchableOpacity style={styles.viewerClose} onPress={() => setViewerOpen(false)}>
                        <NormalText style={{ color: Colors.white, fontWeight: '700' }}>Fechar</NormalText>
                    </TouchableOpacity>
                </View>
            </Modal>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
    },
    galleryContainer: {
        height: 200,
        marginHorizontal: 4,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: Colors.background,
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        height: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    dotActive: {
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
    galleryScroll: {
        height: '100%',
    },
    galleryImage: {
        width: Dimensions.get('window').width - 8,
        height: '100%',
    },
    criteriaSection: {
        marginBottom: 16,
    },
    criteriaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
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
        borderRadius: 10,
        paddingHorizontal: 8,
        height: 24,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    averageText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.white,
        lineHeight: 14,
        marginLeft: 0,
    },
    noScoreText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textHiglight,
        fontStyle: 'italic',
    },
    scoreCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginHorizontal: 4,
        marginBottom: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.darkTint,
        marginRight: 12,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.darkTint,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.darkTint,
    },
    scoreSection: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        minWidth: 40,
    },
    scoreText: {
        fontSize: 14,
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
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.darkTint,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    addButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    },
    viewerBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewerImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    viewerClose: {
        position: 'absolute',
        top: 40,
        right: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 8,
    },
    fabEdit: {
        position: 'absolute',
        right: 20,
        bottom: 90,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.darkTint,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.darkTint,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
});