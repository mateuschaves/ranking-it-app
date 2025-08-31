import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNotifications } from '~/hooks/useNotifications';
import Button from '~/components/Button';
import { NormalText } from '~/components/Typography/NormalText';
import { TextTitle } from '~/components/Typography/TextTitle';
import Colors from '~/theme/colors';
import Loading from '~/components/Loading';

interface NotificationTestProps {
    // Props can be added here if needed
}

export default function NotificationTest({ }: NotificationTestProps) {
    const {
        expoPushToken,
        notification,
        isLoading,
        error,
        sendTestNotification,
        sendRankingInviteNotification,
        sendRankingUpdateNotification,
    } = useNotifications();

    const handleTestNotification = async () => {
        await sendTestNotification();
        Alert.alert('Success', 'Test notification sent!');
    };

    const handleInviteNotification = async () => {
        await sendRankingInviteNotification('Best Restaurants', 'John Doe');
        Alert.alert('Success', 'Ranking invite notification sent!');
    };

    const handleUpdateNotification = async () => {
        await sendRankingUpdateNotification('Best Restaurants', 'New item added');
        Alert.alert('Success', 'Ranking update notification sent!');
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Loading />
                <NormalText style={styles.loadingText}>
                    Setting up notifications...
                </NormalText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextTitle style={styles.title}>Notification Test</TextTitle>

            {error && (
                <NormalText style={styles.errorText}>
                    Error: {error}
                </NormalText>
            )}

            {expoPushToken ? (
                <NormalText style={styles.successText}>
                    ✅ Notifications enabled
                </NormalText>
            ) : (
                <NormalText style={styles.warningText}>
                    ⚠️ Notifications not available
                </NormalText>
            )}

            {notification && (
                <View style={styles.notificationInfo}>
                    <NormalText style={styles.notificationTitle}>
                        Last notification:
                    </NormalText>
                    <NormalText style={styles.notificationText}>
                        {notification.request.content.title}
                    </NormalText>
                    <NormalText style={styles.notificationText}>
                        {notification.request.content.body}
                    </NormalText>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <Button
                    title="Send Test Notification"
                    onPress={handleTestNotification}
                    style={styles.button}
                />

                <Button
                    title="Send Invite Notification"
                    onPress={handleInviteNotification}
                    style={styles.button}
                />

                <Button
                    title="Send Update Notification"
                    onPress={handleUpdateNotification}
                    style={styles.button}
                />
            </View>

            {expoPushToken && (
                <View style={styles.tokenContainer}>
                    <NormalText style={styles.tokenLabel}>
                        Push Token:
                    </NormalText>
                    <NormalText style={styles.tokenText}>
                        {expoPushToken.substring(0, 50)}...
                    </NormalText>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.darkTint,
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 10,
        color: Colors.textHiglight,
    },
    errorText: {
        color: Colors.error,
        textAlign: 'center',
        marginBottom: 10,
    },
    successText: {
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '600',
    },
    warningText: {
        color: '#FF9800',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '600',
    },
    notificationInfo: {
        backgroundColor: Colors.white,
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: Colors.darkTint,
    },
    notificationTitle: {
        fontWeight: '600',
        color: Colors.darkTint,
        marginBottom: 5,
    },
    notificationText: {
        color: Colors.textHiglight,
        marginBottom: 3,
    },
    buttonContainer: {
        gap: 10,
        marginBottom: 20,
    },
    button: {
        marginBottom: 10,
    },
    tokenContainer: {
        backgroundColor: Colors.white,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.tint,
    },
    tokenLabel: {
        fontWeight: '600',
        color: Colors.darkTint,
        marginBottom: 5,
    },
    tokenText: {
        color: Colors.textHiglight,
        fontSize: 12,
        fontFamily: 'monospace',
    },
});
