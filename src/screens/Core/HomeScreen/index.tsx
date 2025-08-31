import React, { useMemo, useRef } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, Platform, RefreshControl } from "react-native";
import { PlusCircle, Users, User, Star } from 'phosphor-react-native'
import { Container, Content } from "~/components/BaseScreen";
import { TextTitle } from "~/components/Typography/TextTitle";
import { NormalText } from '~/components/Typography/NormalText';
import { useQuery } from '@tanstack/react-query';
import { QuerieKeys } from '~/api/resources/querie-keys';
import { GetRankingsByUser, GetRankingsByUserResponse } from '~/api/resources/core/get-ranking-by-user';
import navigationService from '~/services/navigation.service';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import { useUserContext } from '~/context/UserContext';
import Colors from '~/theme/colors';
import CachedImage from 'expo-cached-image';
import constants from '~/config/consts';
import Loading from '~/components/Loading';

interface Props {
    // Define your props here
}

export default function HomeScreen() {
    const { user } = useUserContext();
    const { data: rankings, refetch, isLoading } = useQuery({
        queryKey: [QuerieKeys.GetRankingsByUser],
        queryFn: GetRankingsByUser,
        networkMode: 'online',
        retry: 2,
    });

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const bottomSheetRef = useRef<BottomSheetMethods>(null);

    function handleCreateRanking() {
        navigationService.navigate('CreateRankingScreen');
    }

    function handleDetailRanking(item: GetRankingsByUserResponse) {
        navigationService.navigate('RankingDetailScreen', {
            item,
        });
    }

    return (
        <Container>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Content style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.greetingSection}>
                            <TextTitle style={styles.greeting}>
                                Oi{user?.name ? ' ' + user.name : ''} 👋
                            </TextTitle>
                            <NormalText style={styles.subtitle}>
                                Aqui estão seus rankings
                            </NormalText>
                        </View>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={handleCreateRanking}
                            activeOpacity={0.8}
                        >
                            <PlusCircle
                                size={24}
                                color={Colors.white}
                                weight="bold"
                            />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <Loading size={50} color={Colors.darkTint} />
                    ) : (
                        <FlatList
                            data={rankings}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={[Colors.darkTint]}
                                    tintColor={Colors.darkTint}
                                    progressBackgroundColor={Colors.background}
                                />
                            }
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.card}
                                    onPress={() => handleDetailRanking(item)}
                                    activeOpacity={0.9}
                                >
                                    <View style={styles.cardHeader}>
                                        {item.banner ? (
                                            <CachedImage
                                                source={{ uri: item.banner, expiresIn: 10 }}
                                                style={styles.banner}
                                                cacheKey={`ranking-banner-${item.banner}`}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View style={styles.bannerPlaceholder}>
                                                <Users size={32} color={Colors.white} weight="bold" />
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.cardBody}>
                                        <View style={styles.creatorInfo}>
                                            {item.createdBy?.avatar?.url ? (
                                                <CachedImage
                                                    source={{ uri: item.createdBy.avatar.url }}
                                                    style={styles.creatorAvatar}
                                                    cacheKey={`creator-avatar-${item.createdBy.id}`}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View style={styles.creatorAvatarPlaceholder}>
                                                    <User size={8} color={Colors.white} weight="bold" />
                                                </View>
                                            )}
                                            <NormalText style={styles.creatorName}>
                                                {item.createdBy?.name}
                                            </NormalText>
                                        </View>

                                        <TextTitle style={styles.rankingName}>
                                            {item.name}
                                        </TextTitle>

                                        {item.description && (
                                            <NormalText style={styles.description}>
                                                {item.description}
                                            </NormalText>
                                        )}

                                        {item.criteria && item.criteria.length > 0 && (
                                            <View style={styles.criteriaSection}>
                                                <View style={styles.criteriaList}>
                                                    {item.criteria.slice(0, 3).map((criterion, index) => (
                                                        <View key={index} style={styles.criterionBadge}>
                                                            <NormalText style={styles.criterionText}>
                                                                {criterion}
                                                            </NormalText>
                                                        </View>
                                                    ))}
                                                    {item.criteria.length > 3 && (
                                                        <View style={styles.moreCriteriaBadge}>
                                                            <NormalText style={styles.moreCriteriaText}>
                                                                +{item.criteria.length - 3}
                                                            </NormalText>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <View style={styles.emptyIconContainer}>
                                        <Users size={48} color={Colors.textHiglight} weight="light" />
                                    </View>
                                    <TextTitle style={styles.emptyTitle}>
                                        Nenhum ranking encontrado
                                    </TextTitle>
                                    <NormalText style={styles.emptySubtitle}>
                                        Crie seu primeiro ranking usando o botão + acima!
                                    </NormalText>
                                </View>
                            }
                        />
                    )}

                    <BottomSheet ref={bottomSheetRef} containerHeight={300} >
                        <TouchableOpacity onPress={() => { }}>
                            <NormalText >Excluir</NormalText>
                        </TouchableOpacity>
                    </BottomSheet>
                </Content>
            </GestureHandlerRootView>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 4,
        paddingTop: Platform.OS === 'android' ? 40 : 8, // Padding extra apenas para Android
        paddingBottom: 32,
    },
    greetingSection: {
        flex: 1,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 4,
        color: Colors.darkTint,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textHiglight,
        lineHeight: 22,
    },
    createButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.darkTint,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.darkTint,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    listContainer: {
        paddingHorizontal: 4,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        overflow: 'hidden',
        marginHorizontal: 0,
    },
    cardHeader: {
        height: 140,
    },
    banner: {
        width: '100%',
        height: '100%',
    },
    bannerPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.tint,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBody: {
        padding: 20,
    },
    creatorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    creatorAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.darkTint,
        marginRight: 8,
    },
    creatorAvatarPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.darkTint,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    creatorName: {
        color: Colors.textHiglight,
        fontSize: 14,
        fontWeight: '500',
    },
    rankingName: {
        fontSize: 22,
        marginBottom: 8,
        color: Colors.darkTint,
        fontWeight: '600',
        lineHeight: 28,
    },
    description: {
        color: Colors.textHiglight,
        fontSize: 14,
        lineHeight: 18,
        marginTop: 8,
        marginBottom: 12,
    },
    criteriaSection: {
        marginTop: 12,
    },
    criteriaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    criteriaTitle: {
        color: Colors.darkTint,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    criteriaList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    criterionBadge: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: Colors.background,
    },
    criterionText: {
        color: Colors.darkTint,
        fontSize: 10,
        fontWeight: '500',
    },
    moreCriteriaBadge: {
        backgroundColor: Colors.darkTint,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    moreCriteriaText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 48,
        marginTop: 60,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.tint,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.darkTint,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        color: Colors.textHiglight,
        textAlign: 'center',
        lineHeight: 22,
    },
});
