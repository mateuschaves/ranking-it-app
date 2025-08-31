import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import notificationService from '~/services/notification.service';

export interface UseNotificationsReturn {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  isLoading: boolean;
  error: string | null;
  sendTestNotification: () => Promise<void>;
  sendRankingInviteNotification: (rankingName: string, inviterName: string) => Promise<void>;
  sendRankingUpdateNotification: (rankingName: string, updateType: string) => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Register for push notifications
    const registerForNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = await notificationService.registerForPushNotificationsAsync();
        setExpoPushToken(token);
      } catch (err) {
        console.error('Error registering for notifications:', err);
        setError('Failed to register for notifications');
      } finally {
        setIsLoading(false);
      }
    };

    registerForNotifications();

    // Listen for notifications received while the app is running
    const notificationListener = notificationService.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // Listen for user interactions with notifications
    const responseListener = notificationService.addNotificationResponseListener(
      (response) => {
        console.log('Notification response:', response);
        // Handle notification tap here
        // You can navigate to specific screens based on the notification data
      }
    );

    return () => {
      notificationService.removeNotificationSubscription(notificationListener);
      notificationService.removeNotificationSubscription(responseListener);
    };
  }, []);

  const sendTestNotification = async () => {
    try {
      await notificationService.sendTestNotification();
    } catch (err) {
      console.error('Error sending test notification:', err);
      setError('Failed to send test notification');
    }
  };

  const sendRankingInviteNotification = async (rankingName: string, inviterName: string) => {
    try {
      await notificationService.sendRankingInviteNotification(rankingName, inviterName);
    } catch (err) {
      console.error('Error sending ranking invite notification:', err);
      setError('Failed to send ranking invite notification');
    }
  };

  const sendRankingUpdateNotification = async (rankingName: string, updateType: string) => {
    try {
      await notificationService.sendRankingUpdateNotification(rankingName, updateType);
    } catch (err) {
      console.error('Error sending ranking update notification:', err);
      setError('Failed to send ranking update notification');
    }
  };

  return {
    expoPushToken,
    notification,
    isLoading,
    error,
    sendTestNotification,
    sendRankingInviteNotification,
    sendRankingUpdateNotification,
  };
};
