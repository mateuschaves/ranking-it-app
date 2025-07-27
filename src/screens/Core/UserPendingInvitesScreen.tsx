import React, { useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container } from '~/components/BaseScreen';
import { TextTitle } from '~/components/Typography/TextTitle';
import { NormalText } from '~/components/Typography/NormalText';
import OptimizedCachedImage from '~/components/CachedImage';
import { User, Calendar, Check, X, Users } from 'phosphor-react-native';
import { acceptInvite } from '~/api/resources/core/accept-invite';
import { declineInvite } from '~/api/resources/core/decline-invite';
import { showToast } from '~/utils/feedback';
import { hapticFeedback, HapticsType } from '~/utils/feedback';
import Button from '~/components/Button';
import Colors from '~/theme/colors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUserInvites, UserInvite } from '~/api/resources/core/get-all-user-invites';
import { getImageUrl } from '~/utils/image';
import { QuerieKeys } from '~/api/resources/querie-keys';

export default function UserPendingInvitesScreen() {
    const queryClient = useQueryClient();
    const { data: invites, isLoading, refetch } = useQuery({
        queryKey: ['user-pending-invites'],
        queryFn: getAllUserInvites,
    });

    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [decliningId, setDecliningId] = useState<string | null>(null);

    const acceptInviteMutation = useMutation({
        mutationFn: acceptInvite,
        onSuccess: () => {
            showToast({ type: 'success', title: 'Convite aceito com sucesso!' });
            hapticFeedback(HapticsType.SUCCESS);
            // Invalidar queries para atualizar as telas
            queryClient.invalidateQueries({ queryKey: ['user-pending-invites'] });
            queryClient.invalidateQueries({ queryKey: [QuerieKeys.GetRankingsByUser] });
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        onError: () => {
            showToast({ type: 'error', title: 'Erro ao aceitar convite' });
            hapticFeedback(HapticsType.ERROR);
        },
    });

    const declineInviteMutation = useMutation({
        mutationFn: declineInvite,
        onSuccess: () => {
            showToast({ type: 'success', title: 'Convite recusado' });
            hapticFeedback(HapticsType.SUCCESS);
            // Invalidar queries para atualizar as telas
            queryClient.invalidateQueries({ queryKey: ['user-pending-invites'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        },
        onError: () => {
            showToast({ type: 'error', title: 'Erro ao recusar convite' });
            hapticFeedback(HapticsType.ERROR);
        },
    });

    async function handleAccept(inviteId: string) {
        try {
            setAcceptingId(inviteId);
            await acceptInvite({ inviteId });
            showToast({ type: 'success', title: 'Convite aceito!' });
            hapticFeedback(HapticsType.SUCCESS);
            await refetch();
        } catch (err) {
            showToast({ type: 'error', title: 'Erro ao aceitar convite.' });
            hapticFeedback(HapticsType.ERROR);
        } finally {
            setAcceptingId(null);
        }
    }

    async function handleDecline(inviteId: string) {
        try {
            setDecliningId(inviteId);
            await declineInvite(inviteId);
            showToast({ type: 'success', title: 'Convite recusado!' });
            hapticFeedback(HapticsType.SUCCESS);
            await refetch();
        } catch (err) {
            showToast({ type: 'error', title: 'Erro ao recusar convite.' });
            hapticFeedback(HapticsType.ERROR);
        } finally {
            setDecliningId(null);
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hoje';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Ontem';
        } else {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    };

    if (isLoading) {
        return (
            <Container>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={Colors.darkTint}
                        style={{ marginBottom: 16 }}
                    />
                    <NormalText style={styles.loadingText}>Carregando convites...</NormalText>
                </View>
            </Container>
        );
    }

    if (!invites || invites.length === 0) {
        return (
            <Container>
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Users size={48} color={Colors.textHiglight} weight="light" />
                    </View>
                    <TextTitle style={styles.emptyTitle}>
                        Nenhum convite pendente
                    </TextTitle>
                    <NormalText style={styles.emptySubtitle}>
                        Você não possui convites pendentes no momento
                    </NormalText>
                </View>
            </Container>
        );
    }

    return (
        <Container>
            <View style={styles.header}>
                <TextTitle style={styles.title}>Convites pendentes</TextTitle>
                <NormalText style={styles.subtitle}>
                    {invites.length} convite{invites.length !== 1 ? 's' : ''} pendente{invites.length !== 1 ? 's' : ''}
                </NormalText>
            </View>

            <FlatList
                data={invites}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.userSection}>
                                {item.inviterAvatarPath ? (
                                    <OptimizedCachedImage
                                        uri={getImageUrl(item.inviterAvatarPath)}
                                        style={styles.avatar}
                                        cacheKey={`inviter-avatar-${item.id}`}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <User size={24} color={Colors.white} weight="bold" />
                                    </View>
                                )}

                                <View style={styles.userInfo}>
                                    <NormalText style={styles.inviterName}>
                                        {item.inviterName}
                                    </NormalText>
                                    <View style={styles.dateContainer}>
                                        <Calendar size={14} color={Colors.textHiglight} />
                                        <NormalText style={styles.date}>
                                            {formatDate(item.createdAt)}
                                        </NormalText>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.cardBody}>
                            <View style={styles.rankingBadge}>
                                <Users size={16} color={Colors.darkTint} weight="bold" />
                                <NormalText style={styles.rankingBadgeText}>
                                    Ranking
                                </NormalText>
                            </View>

                            <TextTitle style={styles.rankingName}>
                                {item.rankingName}
                            </TextTitle>

                            <NormalText style={styles.inviteText}>
                                {item.inviterName} convidou você para participar deste ranking
                            </NormalText>
                        </View>

                        <View style={styles.actionSection}>
                            <View style={styles.buttonContainer}>
                                <Button
                                    onPress={() => handleDecline(item.id)}
                                    title="Recusar"
                                    loading={decliningId === item.id}
                                    variant="outlined"
                                    iconLeft={<X size={18} color={Colors.textHiglight} weight="bold" />}
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                <Button
                                    onPress={() => handleAccept(item.id)}
                                    title="Aceitar"
                                    loading={acceptingId === item.id}
                                    iconLeft={<Check size={18} color={Colors.white} weight="bold" />}
                                />
                            </View>
                        </View>
                    </View>
                )}
            />
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 32,
        backgroundColor: Colors.background,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 28,
        fontWeight: '600',
    },
    subtitle: {
        textAlign: 'center',
        color: Colors.textHiglight,
        fontSize: 15,
        lineHeight: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    loadingText: {
        marginTop: 16,
        color: Colors.textHiglight,
        fontSize: 16,
        fontWeight: '500',
    },
    listContainer: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
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
    },
    cardHeader: {
        padding: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.background,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.tint,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.darkTint,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        marginLeft: 16,
        flex: 1,
    },
    inviterName: {
        fontSize: 17,
        color: Colors.darkTint,
        fontWeight: '600',
        marginBottom: 4,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        color: Colors.textHiglight,
        fontSize: 14,
        marginLeft: 6,
        fontWeight: '500',
    },
    cardBody: {
        padding: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    rankingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    rankingBadgeText: {
        fontSize: 12,
        color: Colors.darkTint,
        fontWeight: '600',
        marginLeft: 6,
        textTransform: 'uppercase',
    },
    rankingName: {
        fontSize: 22,
        marginBottom: 8,
        color: Colors.darkTint,
        fontWeight: '600',
        lineHeight: 28,
    },
    inviteText: {
        color: Colors.textHiglight,
        fontSize: 15,
        lineHeight: 22,
    },
    actionSection: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: Colors.tint,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 12,
    },
    buttonContainer: {
        flex: 1,
    },
}); 