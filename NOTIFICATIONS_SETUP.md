# Expo Notifications Setup Guide

This guide explains how to use the Expo notifications system that has been configured in your Ranking It app.

## 🚀 What's Been Configured

### 1. **Dependencies Installed**
- `expo-notifications` - Core notification functionality
- `expo-device` - Device information for push tokens
- `expo-constants` - Project configuration access

### 2. **App Configuration (app.json)**
```json
{
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/icon.png",
        "color": "#EDEAE4",
        "defaultChannel": "default"
      }
    ]
  ]
}
```

### 3. **Services Created**
- `src/services/notification.service.ts` - Main notification service
- `src/hooks/useNotifications.ts` - React hook for easy integration
- `src/components/NotificationTest/` - Test component for notifications

## 📱 How to Use

### **Basic Usage with Hook**
```tsx
import { useNotifications } from '~/hooks/useNotifications';

function MyComponent() {
  const {
    expoPushToken,
    notification,
    isLoading,
    error,
    sendTestNotification,
    sendRankingInviteNotification,
    sendRankingUpdateNotification,
  } = useNotifications();

  // Your component logic here
}
```

### **Direct Service Usage**
```tsx
import notificationService from '~/services/notification.service';

// Send a test notification
await notificationService.sendTestNotification();

// Send a ranking invite notification
await notificationService.sendRankingInviteNotification(
  'Best Restaurants',
  'John Doe'
);

// Send a ranking update notification
await notificationService.sendRankingUpdateNotification(
  'Best Restaurants',
  'New item added'
);
```

## 🧪 Testing Notifications

### **Option 1: Use the Test Screen**
1. Open the app
2. Go to Profile tab
3. Tap "Testar Notificações"
4. Use the test buttons to send different types of notifications

### **Option 2: Test in Your Code**
```tsx
// In any component
const { sendTestNotification } = useNotifications();

const handleTest = async () => {
  await sendTestNotification();
};
```

## 🔧 Available Methods

### **NotificationService Methods**
- `registerForPushNotificationsAsync()` - Register for push notifications
- `scheduleLocalNotification()` - Schedule a local notification
- `cancelNotification()` - Cancel a specific notification
- `cancelAllNotifications()` - Cancel all scheduled notifications
- `sendTestNotification()` - Send a test notification
- `sendRankingInviteNotification()` - Send ranking invite notification
- `sendRankingUpdateNotification()` - Send ranking update notification

### **Hook Methods**
- `sendTestNotification()` - Send test notification
- `sendRankingInviteNotification(rankingName, inviterName)` - Send invite notification
- `sendRankingUpdateNotification(rankingName, updateType)` - Send update notification

## 📋 Notification Types

### **1. Test Notifications**
- Simple test notifications for development
- Title: "Test Notification"
- Body: "This is a test notification from Ranking It!"

### **2. Ranking Invite Notifications**
- Sent when someone invites a user to a ranking
- Title: "New Ranking Invitation! 🏆"
- Body: "{inviterName} invited you to join \"{rankingName}\""

### **3. Ranking Update Notifications**
- Sent when a ranking is updated
- Title: "Ranking Updated! 📊"
- Body: "\"{rankingName}\" has been updated: {updateType}"

## 🔐 Permissions

The app will automatically request notification permissions when:
1. The `useNotifications` hook is first used
2. `registerForPushNotificationsAsync()` is called

### **Permission States**
- `granted` - Notifications are enabled
- `denied` - User denied notifications
- `undetermined` - Permission not yet requested

## 📱 Platform Differences

### **iOS**
- Uses APNs (Apple Push Notification service)
- Requires physical device for testing
- Supports rich notifications with images and actions

### **Android**
- Uses FCM (Firebase Cloud Messaging)
- Supports notification channels
- Can test on emulator (limited functionality)

## 🚨 Important Notes

### **Development vs Production**
- **Development**: Use Expo Go app for testing
- **Production**: Requires EAS Build for push notifications

### **Physical Device Required**
- Push notifications only work on physical devices
- Simulators/emulators have limited notification support

### **EAS Build Required for Production**
- Push notifications require a development build or production build
- Cannot be tested in Expo Go for production features

## 🔄 Integration Examples

### **In Ranking Invitation**
```tsx
// Already integrated in RankingDetailScreen
async function handleInviteUser(email: string) {
  await inviteUserToRankingFn({ email, rankingId: item.id });
  
  // Send notification
  await notificationService.sendRankingInviteNotification(
    item.name,
    'You'
  );
}
```

### **In Ranking Updates**
```tsx
// Example: When a new item is added
const handleAddItem = async () => {
  await addItemFn(itemData);
  
  // Send notification
  await notificationService.sendRankingUpdateNotification(
    rankingName,
    'New item added'
  );
};
```

## 🐛 Troubleshooting

### **Common Issues**

1. **"Must use physical device for Push Notifications"**
   - Solution: Test on a real device, not simulator

2. **"Project ID not found"**
   - Solution: Ensure EAS project is properly configured

3. **Notifications not showing**
   - Check device notification settings
   - Verify app has notification permissions
   - Check if notifications are enabled in device settings

### **Debug Steps**
1. Check console logs for error messages
2. Verify notification permissions in device settings
3. Test with the NotificationTest screen
4. Check if the app is in foreground/background when testing

## 📚 Next Steps

1. **Test the current setup** using the NotificationTest screen
2. **Integrate notifications** into your existing features
3. **Set up push notifications** for production (requires EAS Build)
4. **Customize notification content** based on your app's needs

## 🔗 Useful Links

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
