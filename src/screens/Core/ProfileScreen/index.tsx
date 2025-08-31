import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView, RefreshControl, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container } from '~/components/BaseScreen';
import { TextTitle } from '~/components/Typography/TextTitle';
import { NormalText } from '~/components/Typography/NormalText';
import theme from '~/theme';
import Colors from '~/theme/colors';
import CachedImage from 'expo-cached-image';
import { PencilSimple, CaretRight, User, Gear, Bell, SignOut } from 'phosphor-react-native';
import Divider from '~/components/Divider';
import { asyncStorage, StorageKeys } from '~/shared/storage_service';
import { useUserContext } from '~/context/UserContext';
import navigationService from '~/services/navigation.service';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile, GetUserProfileResponse } from '~/api/resources/core/get-user-profile';
import constants from '~/config/consts';

const AVATAR_BASE_URL = 'https://ranking-attachments.s3.us-east-1.amazonaws.com/';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { setIsAuthenticated, setUser, user: userContext } = useUserContext();
    const [refreshing, setRefreshing] = React.useState(false);
    const { data: user, isLoading, refetch } = useQuery({
        queryKey: ['user-profile'],
        queryFn: getUserProfile,
    });

    useEffect(() => {
        if (user?.id) {
            setUser(user);
        }
        console.log(userContext);
    }, [user?.id]);

    function handleEditProfile() {
        navigationService.navigate('ProfilePhotoScreen');
    }
    function handleSettings() { }
    function handlePendingInvites() {
        navigationService.navigate('UserPendingInvitesScreen');
    }
    function handleNotificationTest() {
        navigationService.navigate('NotificationTestScreen');
    }
    function handleLogout() {
        Alert.alert(
            'Sair',
            'Tem certeza que deseja sair da sua conta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair', style: 'destructive', onPress: async () => {
                        await asyncStorage.removeItem(StorageKeys.ACCESS_TOKEN);
                        setIsAuthenticated(false);
                    }
                },
            ]
        );
    }

    async function handleRefresh() {
        setRefreshing(true);
        const { data } = await refetch();
        if (data?.id) setUser(data);
        setRefreshing(false);
    }

    if (isLoading) {
        return (
            <Container style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={Colors.darkTint}
                        style={{ marginBottom: 16 }}
                    />
                    <NormalText style={styles.loadingText}>Carregando perfil...</NormalText>
                </View>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <NormalText>Não foi possível carregar o perfil.</NormalText>
            </Container>
        );
    }

    let avatarUrl = '';
    if (userContext?.avatarUrl) {
        avatarUrl = userContext.avatarUrl.startsWith('http')
            ? userContext.avatarUrl
            : `${constants.bucketUrl.replace('http://', 'https://')}/${userContext.avatarUrl}`;
    } else if (userContext?.avatarId) {
        avatarUrl = `${constants.bucketUrl.replace('http://', 'https://')}/${userContext.avatarId}`;
    }

    return (
        <Container>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[Colors.darkTint]}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            {userContext?.avatarId ? (
                                <Image
                                    source={{ uri: avatarUrl }}
                                    style={styles.avatar}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <User size={36} color={Colors.white} weight="bold" />
                                </View>
                            )}
                        </View>

                        <View style={styles.userInfo}>
                            <TextTitle style={styles.userName}>
                                {userContext?.name}
                            </TextTitle>
                            <NormalText style={styles.userEmail} numberOfLines={1} ellipsizeMode="tail">
                                {userContext?.email}
                            </NormalText>
                        </View>

                        <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile} activeOpacity={0.7}>
                            <PencilSimple size={16} color={Colors.darkTint} weight="bold" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.option} onPress={handleSettings} activeOpacity={0.8}>
                            <View style={styles.optionLeft}>
                                <View style={styles.optionIcon}>
                                    <Gear size={20} color={Colors.darkTint} weight="bold" />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <NormalText style={styles.optionTitle}>Configurações da conta</NormalText>
                                    <NormalText style={styles.optionSubtitle}>Gerencie suas preferências</NormalText>
                                </View>
                            </View>
                            <CaretRight size={20} color={Colors.textHiglight} />
                        </TouchableOpacity>

                        <Divider />

                        <TouchableOpacity style={styles.option} onPress={handlePendingInvites} activeOpacity={0.8}>
                            <View style={styles.optionLeft}>
                                <View style={styles.optionIcon}>
                                    <Bell size={20} color={Colors.darkTint} weight="bold" />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <NormalText style={styles.optionTitle}>Convites pendentes</NormalText>
                                    <NormalText style={styles.optionSubtitle}>Veja seus convites aguardando</NormalText>
                                </View>
                            </View>
                            <View style={styles.optionRight}>
                                {userContext?.pendingInvitesCount && userContext?.pendingInvitesCount > 0 && (
                                    <View style={styles.badge}>
                                        <NormalText style={styles.badgeText}>{userContext.pendingInvitesCount}</NormalText>
                                    </View>
                                )}
                                <CaretRight size={20} color={Colors.textHiglight} />
                            </View>
                        </TouchableOpacity>

                        <Divider />

                        <TouchableOpacity style={styles.option} onPress={handleNotificationTest} activeOpacity={0.8}>
                            <View style={styles.optionLeft}>
                                <View style={styles.optionIcon}>
                                    <Bell size={20} color={Colors.darkTint} weight="bold" />
                                </View>
                                <View style={styles.optionTextContainer}>
                                    <NormalText style={styles.optionTitle}>Testar Notificações</NormalText>
                                    <NormalText style={styles.optionSubtitle}>Teste as notificações do app</NormalText>
                                </View>
                            </View>
                            <View style={styles.optionRight}>
                                <CaretRight size={20} color={Colors.textHiglight} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 1 }} />

                <View style={[styles.logoutSection, { paddingBottom: insets.bottom + 100 }]}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                        <SignOut size={18} color={Colors.textHiglight} weight="regular" />
                        <NormalText style={styles.logoutText}>Sair da conta</NormalText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.darkTint,
    },
    avatarPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.darkTint,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.darkTint,
        marginBottom: 4,
    },
    userEmail: {
        color: Colors.textHiglight,
        fontSize: 11,
        lineHeight: 14,
    },
    editProfileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.background,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        overflow: 'hidden',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.darkTint,
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: 14,
        color: Colors.textHiglight,
        lineHeight: 18,
    },
    optionRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: Colors.darkTint,
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        paddingHorizontal: 8,
    },
    badgeText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    logoutSection: {
        paddingHorizontal: 24,
        marginTop: Platform.OS === 'ios' ? 20 : 40, // Reduzido ainda mais
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    logoutText: {
        color: Colors.textHiglight,
        fontSize: 15,
        fontWeight: '500',
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        color: Colors.darkTint,
        fontSize: 16,
        fontWeight: '500',
    },
});

