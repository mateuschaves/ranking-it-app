# Server-Side Push Notifications Guide

This guide shows you how to send push notifications from your server to specific users in your Ranking It app.

## 🏗️ **Backend Setup Required**

### **1. Database Schema**
You'll need to store user push tokens in your database:

```sql
-- Add to your users table
ALTER TABLE users ADD COLUMN push_token VARCHAR(255);
ALTER TABLE users ADD COLUMN push_token_updated_at TIMESTAMP;

-- Or create a separate table for push tokens
CREATE TABLE user_push_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  push_token VARCHAR(255) NOT NULL,
  device_type VARCHAR(50), -- 'ios' or 'android'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **2. API Endpoint to Store Push Tokens**
Create an endpoint to receive push tokens from the app:

```javascript
// Node.js/Express example
app.post('/user/push-token', authenticateUser, async (req, res) => {
  try {
    const { pushToken } = req.body;
    const userId = req.user.id;

    // Store or update the push token
    await db.query(
      'UPDATE users SET push_token = $1, push_token_updated_at = NOW() WHERE id = $2',
      [pushToken, userId]
    );

    res.json({ success: true, message: 'Push token updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update push token' });
  }
});
```

## 📱 **Sending Notifications from Server**

### **Option 1: Using Expo Push API (Recommended)**

#### **Install Dependencies**
```bash
npm install expo-server-sdk
```

#### **Node.js/Express Example**
```javascript
const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

async function sendPushNotification(userId, title, body, data = {}) {
  try {
    // Get user's push token from database
    const user = await db.query('SELECT push_token FROM users WHERE id = $1', [userId]);
    
    if (!user.rows[0]?.push_token) {
      console.log('No push token found for user:', userId);
      return;
    }

    const pushToken = user.rows[0].push_token;

    // Check that the push token is valid
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return;
    }

    // Create the message
    const message = {
      to: pushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      badge: 1, // iOS only
    };

    // Send the notification
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    }

    console.log('Push notification sent successfully');
    return tickets;
  } catch (error) {
    console.error('Error in sendPushNotification:', error);
  }
}

// Usage examples
async function sendRankingInviteNotification(inviterId, inviteeId, rankingName) {
  await sendPushNotification(
    inviteeId,
    'New Ranking Invitation! 🏆',
    `You've been invited to join "${rankingName}"`,
    { 
      type: 'ranking_invite', 
      rankingId: 'ranking_id_here',
      inviterId: inviterId 
    }
  );
}

async function sendRankingUpdateNotification(userId, rankingName, updateType) {
  await sendPushNotification(
    userId,
    'Ranking Updated! 📊',
    `"${rankingName}" has been updated: ${updateType}`,
    { 
      type: 'ranking_update', 
      rankingId: 'ranking_id_here',
      updateType: updateType 
    }
  );
}
```

#### **Python/Flask Example**
```python
import requests
import json

def send_push_notification(user_id, title, body, data=None):
    # Get user's push token from database
    user = db.execute('SELECT push_token FROM users WHERE id = ?', (user_id,)).fetchone()
    
    if not user or not user['push_token']:
        print(f'No push token found for user: {user_id}')
        return

    push_token = user['push_token']
    
    # Expo Push API endpoint
    url = 'https://exp.host/--/api/v2/push/send'
    
    # Create the message
    message = {
        'to': push_token,
        'sound': 'default',
        'title': title,
        'body': body,
        'data': data or {},
        'badge': 1
    }
    
    # Send the notification
    headers = {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
    }
    
    response = requests.post(url, data=json.dumps(message), headers=headers)
    
    if response.status_code == 200:
        print('Push notification sent successfully')
    else:
        print(f'Error sending push notification: {response.text}')

# Usage
def send_ranking_invite_notification(inviter_id, invitee_id, ranking_name):
    send_push_notification(
        invitee_id,
        'New Ranking Invitation! 🏆',
        f'You\'ve been invited to join "{ranking_name}"',
        {
            'type': 'ranking_invite',
            'rankingId': 'ranking_id_here',
            'inviterId': inviter_id
        }
    )
```

#### **PHP Example**
```php
<?php
function sendPushNotification($userId, $title, $body, $data = []) {
    // Get user's push token from database
    $stmt = $pdo->prepare('SELECT push_token FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user || !$user['push_token']) {
        echo "No push token found for user: $userId\n";
        return;
    }
    
    $pushToken = $user['push_token'];
    
    // Create the message
    $message = [
        'to' => $pushToken,
        'sound' => 'default',
        'title' => $title,
        'body' => $body,
        'data' => $data,
        'badge' => 1
    ];
    
    // Send the notification
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://exp.host/--/api/v2/push/send');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($message));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Accept-encoding: gzip, deflate',
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo "Push notification sent successfully\n";
    } else {
        echo "Error sending push notification: $response\n";
    }
}

// Usage
function sendRankingInviteNotification($inviterId, $inviteeId, $rankingName) {
    sendPushNotification(
        $inviteeId,
        'New Ranking Invitation! 🏆',
        "You've been invited to join \"$rankingName\"",
        [
            'type' => 'ranking_invite',
            'rankingId' => 'ranking_id_here',
            'inviterId' => $inviterId
        ]
    );
}
?>
```

## 🔧 **Integration Examples**

### **1. When User Accepts Ranking Invitation**
```javascript
// In your ranking invitation acceptance endpoint
app.post('/ranking/:id/accept-invite', authenticateUser, async (req, res) => {
  try {
    const rankingId = req.params.id;
    const userId = req.user.id;
    
    // Accept the invitation logic here...
    
    // Send notification to ranking creator
    const ranking = await getRankingById(rankingId);
    await sendPushNotification(
      ranking.createdBy,
      'Invitation Accepted! ✅',
      `${req.user.name} accepted your invitation to "${ranking.name}"`,
      { type: 'invitation_accepted', rankingId, userId }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### **2. When New Item is Added to Ranking**
```javascript
// In your add ranking item endpoint
app.post('/ranking/:id/items', authenticateUser, async (req, res) => {
  try {
    const rankingId = req.params.id;
    const { name, description } = req.body;
    
    // Add item logic here...
    
    // Get all users in this ranking
    const rankingUsers = await getRankingUsers(rankingId);
    const ranking = await getRankingById(rankingId);
    
    // Send notification to all ranking participants
    for (const user of rankingUsers) {
      if (user.id !== req.user.id) { // Don't notify the person who added the item
        await sendPushNotification(
          user.id,
          'New Item Added! 📝',
          `"${name}" was added to "${ranking.name}"`,
          { type: 'new_item', rankingId, itemName: name }
        );
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### **3. When User Votes on Ranking Item**
```javascript
// In your vote endpoint
app.post('/ranking/:id/items/:itemId/vote', authenticateUser, async (req, res) => {
  try {
    const { rankingId, itemId } = req.params;
    const { score } = req.body;
    
    // Vote logic here...
    
    // Get item and ranking info
    const item = await getRankingItem(itemId);
    const ranking = await getRankingById(rankingId);
    
    // Send notification to item creator (if different from voter)
    if (item.createdBy !== req.user.id) {
      await sendPushNotification(
        item.createdBy,
        'New Vote! ⭐',
        `Your item "${item.name}" received a new vote in "${ranking.name}"`,
        { type: 'new_vote', rankingId, itemId, score }
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 📊 **Advanced Features**

### **1. Batch Notifications**
```javascript
async function sendBatchNotifications(userIds, title, body, data = {}) {
  const messages = [];
  
  for (const userId of userIds) {
    const user = await db.query('SELECT push_token FROM users WHERE id = $1', [userId]);
    if (user.rows[0]?.push_token) {
      messages.push({
        to: user.rows[0].push_token,
        sound: 'default',
        title: title,
        body: body,
        data: { ...data, userId }
      });
    }
  }
  
  if (messages.length > 0) {
    const chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
  }
}
```

### **2. Scheduled Notifications**
```javascript
// Using node-cron for scheduled notifications
const cron = require('node-cron');

// Send daily ranking reminders
cron.schedule('0 9 * * *', async () => {
  const activeRankings = await getActiveRankings();
  
  for (const ranking of activeRankings) {
    const users = await getRankingUsers(ranking.id);
    await sendBatchNotifications(
      users.map(u => u.id),
      'Daily Ranking Reminder! 📊',
      `Don't forget to vote on "${ranking.name}"`,
      { type: 'daily_reminder', rankingId: ranking.id }
    );
  }
});
```

### **3. Notification Preferences**
```javascript
// Add notification preferences to user table
ALTER TABLE users ADD COLUMN notification_preferences JSONB DEFAULT '{"invites": true, "votes": true, "updates": true, "reminders": false}';

async function sendPushNotificationWithPreferences(userId, type, title, body, data = {}) {
  const user = await db.query(
    'SELECT push_token, notification_preferences FROM users WHERE id = $1', 
    [userId]
  );
  
  if (!user.rows[0]?.push_token) return;
  
  const preferences = user.rows[0].notification_preferences;
  
  // Check if user wants this type of notification
  if (preferences[type] === false) {
    console.log(`User ${userId} has disabled ${type} notifications`);
    return;
  }
  
  // Send the notification
  await sendPushNotification(userId, title, body, data);
}
```

## 🚨 **Important Notes**

### **1. Rate Limits**
- Expo Push API has rate limits
- Use batch sending for multiple notifications
- Implement retry logic for failed sends

### **2. Error Handling**
```javascript
async function sendPushNotificationWithRetry(userId, title, body, data = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await sendPushNotification(userId, title, body, data);
      return; // Success
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error('Failed to send notification after retries:', error);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Wait before retry
      }
    }
  }
}
```

### **3. Token Management**
- Push tokens can expire or change
- Implement token validation and cleanup
- Handle invalid tokens gracefully

```javascript
// Clean up invalid tokens
async function cleanupInvalidTokens() {
  const users = await db.query('SELECT id, push_token FROM users WHERE push_token IS NOT NULL');
  
  for (const user of users.rows) {
    try {
      // Try to send a test notification
      await expo.sendPushNotificationsAsync([{
        to: user.push_token,
        title: 'Test',
        body: 'Test'
      }]);
    } catch (error) {
      if (error.message.includes('DeviceNotRegistered')) {
        // Remove invalid token
        await db.query('UPDATE users SET push_token = NULL WHERE id = $1', [user.id]);
        console.log(`Removed invalid token for user ${user.id}`);
      }
    }
  }
}
```

## 🔗 **Useful Links**

- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [Expo Server SDK](https://github.com/expo/expo-server-sdk-node)
- [Expo Push API](https://docs.expo.dev/push-notifications/sending-notifications/)

This setup will allow you to send targeted push notifications to specific users from your server!
