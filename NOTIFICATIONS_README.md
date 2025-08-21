# Notifications Management System

This feature provides a comprehensive notification management system for sending push notifications to users through Firebase Cloud Messaging (FCM).

## Features

### 1. Send Notifications
- **Broadcast**: Send to all users
- **Users**: Send to specific selected users  
- **Topic**: Send to users subscribed to a specific topic

### 2. Platform Support
- **Android**: Full Firebase Android configuration support
- **iOS**: Apple Push Notification service (APNS) configuration
- **Web**: Web push notifications through service workers

### 3. Advanced Configuration
- Custom notification data
- Platform-specific settings (sounds, colors, icons, etc.)
- Priority levels (normal/high)
- Time-to-live (TTL) settings
- Click actions and deep linking

### 4. Topic Management
- Create notification topics
- Subscribe users to topics
- View subscriber counts

### 5. Notification History
- View sent notification history
- Success/failure statistics
- Filter by type and date range

## API Endpoints

The system expects the following backend endpoints:

### Send Notifications
- `POST /notification/send-to-users` - Send to specific users
- `POST /notification/send-to-topic` - Send to topic subscribers  
- `POST /notification/broadcast` - Send to all users

### Topic Management
- `GET /notification/topics` - Get all topics
- `POST /notification/topics` - Create new topic
- `POST /notification/topics/subscribe` - Subscribe users to topic

### History
- `GET /notification/history` - Get notification history with pagination

## Payload Structure

The system uses Firebase Admin SDK payload format:

```typescript
interface FirebaseAdminPayload {
  data?: Record<string, string>;
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
  android?: AndroidConfig;
  webpush?: WebpushConfig;
  apns?: APNSConfig;
  fcm_options?: FcmOptions;
  token?: string;      // For single user
  topic?: string;      // For topic
  condition?: string;  // For complex conditions
}
```

## Usage

1. **Navigate to Notifications**: Access via sidebar menu
2. **Choose Target**: Select broadcast, users, or topic
3. **Configure Message**: Set title, body, and optional image
4. **Platform Settings**: Configure Android/iOS/Web specific options
5. **Custom Data**: Add key-value pairs for app-specific data
6. **Send**: Click send to dispatch notifications

## Translations

The feature supports multiple languages (English, French, Arabic) with comprehensive translations for all UI elements.

## File Structure

```
app/[locale]/dashboard/notification/
├── page.tsx          # Main notifications page
└── loading.tsx       # Loading state

components/
└── notifications-manager.tsx  # Main component

lib/actions/
└── notifications.ts  # Server actions

types/
└── notifications.ts  # TypeScript definitions

messages/
├── en.json          # English translations
├── fr.json          # French translations  
└── ar.json          # Arabic translations
```

## Dependencies

- Firebase Admin SDK (backend)
- React Hook Form patterns
- Lucide React icons
- Shadcn/ui components
- Next-intl for translations
