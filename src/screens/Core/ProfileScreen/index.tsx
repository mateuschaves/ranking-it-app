import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container } from '~/components/BaseScreen';
import { TextTitle } from '~/components/Typography/TextTitle';
import { NormalText } from '~/components/Typography/NormalText';
import theme from '~/theme';
import Colors from '~/theme/colors';
import CachedImage from 'expo-cached-image';
import { PencilSimple, CaretRight } from 'phosphor-react-native';
import Divider from '~/components/Divider';
import { asyncStorage, StorageKeys } from '~/shared/storage_service';
import { useUserContext } from '~/context/UserContext';
import navigationService from '~/services/navigation.service';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile, GetUserProfileResponse } from '~/api/resources/core/get-user-profile';

const AVATAR_BASE_URL = 'https://ranking-attachments.s3.us-east-1.amazonaws.com/';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { setIsAuthenticated, setUser, user: userContext } = useUserContext();
    const { data: user, isLoading } = useQuery<GetUserProfileResponse>({
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
    function handlePendingInvites() { }
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

    if (isLoading) {
        return (
            <Container style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.darkTint} />
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

    const avatarUrl = userContext?.avatarId ? `${AVATAR_BASE_URL}${userContext.avatarId}` : undefined;

    return (
        <Container style={[styles.container, { flex: 1 }]}>
            <View style={styles.header}>
                <View style={styles.avatarWrapper}>
                    {avatarUrl ? (
                        <Image
                            source={{ uri: avatarUrl }}
                            style={styles.avatar}
                        />
                    ) : (
                        <CachedImage
                            source={{ uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userContext?.name || '') + '&background=0D8ABC&color=fff' }}
                            style={styles.avatar}
                            resizeMode="cover"
                            cacheKey={`profile-avatar-${userContext?.name}`}
                        />
                    )}
                    <TouchableOpacity style={styles.editIcon} onPress={handleEditProfile} activeOpacity={0.7}>
                        <PencilSimple size={18} color={Colors.white} weight="bold" />
                    </TouchableOpacity>
                </View>
                <TextTitle fontWeight={theme.weights.lg} style={styles.name}>
                    {userContext?.name}
                </TextTitle>
                <NormalText style={styles.email}>{userContext?.email}</NormalText>
            </View>

            <View style={styles.sectionList}>
                <TouchableOpacity style={styles.option} onPress={handleSettings} activeOpacity={0.7}>
                    <NormalText style={styles.optionText}>Configurações da conta</NormalText>
                    <CaretRight size={20} color={Colors.darkTint} />
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity style={styles.option} onPress={handlePendingInvites} activeOpacity={0.7}>
                    <NormalText style={styles.optionText}>Convites pendentes</NormalText>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                        <CaretRight size={20} color={Colors.darkTint} />
                        {userContext?.pendingInvitesCount && userContext?.pendingInvitesCount > 0 && (
                            <View style={styles.badge}>
                                <NormalText style={styles.badgeText}>{userContext.pendingInvitesCount}</NormalText>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }} />

            <View style={[styles.logoutWrapper, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity style={styles.logout} onPress={handleLogout} activeOpacity={0.7}>
                    <NormalText style={styles.logoutText}>Sair</NormalText>
                </TouchableOpacity>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.darkTint,
    },
    editIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: Colors.darkTint,
        borderRadius: 16,
        padding: 4,
        borderWidth: 2,
        borderColor: Colors.background,
        elevation: 2,
    },
    name: {
        marginBottom: 4,
        textAlign: 'center',
    },
    email: {
        color: Colors.textHiglight,
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionList: {
        marginBottom: 24,
        backgroundColor: Colors.background,
        borderRadius: 12,
        paddingVertical: 4,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.background,
    },
    optionText: {
        fontSize: 16,
        color: Colors.darkTint,
    },
    logout: {
        marginTop: 'auto',
        marginBottom: 8,
        alignItems: 'center',
        paddingVertical: 16,
    },
    logoutText: {
        color: Colors.error,
        fontSize: 16,
    },
    logoutWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 24,
    },
    badge: {
        backgroundColor: Colors.darkTint,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 6,
    },
    badgeText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
