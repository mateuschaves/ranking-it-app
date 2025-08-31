import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { UpdateUserPushToken } from '~/api/resources/core/update-user-push-token';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}

class NotificationService {
  private expoPushToken: string | null = null;

  /**
   * Register for push notifications and get the Expo push token
   */
  async registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#EDEAE4',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        this.expoPushToken = token;
        console.log('Expo push token:', token);
        
        // Send the push token to your server
        try {
          await UpdateUserPushToken({ pushToken: token });
          console.log('Push token sent to server successfully');
        } catch (error) {
          console.error('Failed to send push token to server:', error);
        }
      } catch (error) {
        console.error('Error getting Expo push token:', error);
        return null;
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  }

  /**
   * Get the current Expo push token
   */
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Schedule a local notification
   */
  async scheduleLocalNotification(notification: NotificationData, trigger?: Notifications.NotificationTriggerInput): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: 'default',
      },
      trigger: trigger || null, // null means show immediately
    });

    return notificationId;
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Add a notification response listener
   */
  addNotificationResponseListener(listener: (response: Notifications.NotificationResponse) => void): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  /**
   * Add a notification received listener (when app is in foreground)
   */
  addNotificationReceivedListener(listener: (notification: Notifications.Notification) => void): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  /**
   * Remove a notification listener
   */
  removeNotificationSubscription(subscription: Notifications.Subscription): void {
    Notifications.removeNotificationSubscription(subscription);
  }

  /**
   * Get notification permissions status
   */
  async getPermissionsStatus(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.requestPermissionsAsync();
  }

  /**
   * Send a test notification
   */
  async sendTestNotification(): Promise<string> {
    return await this.scheduleLocalNotification({
      title: 'Test Notification',
      body: 'This is a test notification from Ranking It!',
      data: { test: true }
    });
  }

  /**
   * Send a ranking invitation notification
   */
  async sendRankingInviteNotification(rankingName: string, inviterName: string): Promise<string> {
    return await this.scheduleLocalNotification({
      title: 'New Ranking Invitation! 🏆',
      body: `${inviterName} invited you to join "${rankingName}"`,
      data: { type: 'ranking_invite', rankingName, inviterName }
    });
  }

  /**
   * Send a ranking update notification
   */
  async sendRankingUpdateNotification(rankingName: string, updateType: string): Promise<string> {
    return await this.scheduleLocalNotification({
      title: 'Ranking Updated! 📊',
      body: `"${rankingName}" has been updated: ${updateType}`,
      data: { type: 'ranking_update', rankingName, updateType }
    });
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();
export default notificationService;
