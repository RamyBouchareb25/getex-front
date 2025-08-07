// Firebase Admin SDK Message types
export interface AndroidConfig {
  collapse_key?: string;
  priority?: 'normal' | 'high';
  ttl?: string;
  restricted_package_name?: string;
  data?: Record<string, string>;
  notification?: AndroidNotification;
  fcm_options?: AndroidFcmOptions;
}

export interface AndroidNotification {
  title?: string;
  body?: string;
  icon?: string;
  color?: string;
  sound?: string;
  tag?: string;
  click_action?: string;
  body_loc_key?: string;
  body_loc_args?: string[];
  title_loc_key?: string;
  title_loc_args?: string[];
  channel_id?: string;
  ticker?: string;
  sticky?: boolean;
  event_time?: string;
  local_only?: boolean;
  notification_priority?: 'PRIORITY_UNSPECIFIED' | 'PRIORITY_MIN' | 'PRIORITY_LOW' | 'PRIORITY_DEFAULT' | 'PRIORITY_HIGH' | 'PRIORITY_MAX';
  default_sound?: boolean;
  default_vibrate_timings?: boolean;
  default_light_settings?: boolean;
  vibrate_timings?: string[];
  visibility?: 'VISIBILITY_UNSPECIFIED' | 'PRIVATE' | 'PUBLIC' | 'SECRET';
  notification_count?: number;
  light_settings?: LightSettings;
  image?: string;
}

export interface AndroidFcmOptions {
  analytics_label?: string;
}

export interface LightSettings {
  color?: Color;
  light_on_duration?: string;
  light_off_duration?: string;
}

export interface Color {
  red?: number;
  green?: number;
  blue?: number;
  alpha?: number;
}

export interface APNSConfig {
  headers?: Record<string, string>;
  payload?: APNSPayload;
  fcm_options?: APNSFcmOptions;
}

export interface APNSPayload {
  aps?: APS;
  [key: string]: any;
}

export interface APS {
  alert?: string | APSAlert;
  badge?: number;
  sound?: string | APSSound;
  'thread-id'?: string;
  category?: string;
  'content-available'?: number;
  'mutable-content'?: number;
  'target-content-id'?: string;
  'interruption-level'?: 'passive' | 'active' | 'time-sensitive' | 'critical';
  'relevance-score'?: number;
  'filter-criteria'?: string;
  'stale-date'?: number;
}

export interface APSAlert {
  title?: string;
  subtitle?: string;
  body?: string;
  'launch-image'?: string;
  'title-loc-key'?: string;
  'title-loc-args'?: string[];
  'action-loc-key'?: string;
  'loc-key'?: string;
  'loc-args'?: string[];
}

export interface APSSound {
  critical?: number;
  name?: string;
  volume?: number;
}

export interface APNSFcmOptions {
  analytics_label?: string;
  image?: string;
}

export interface WebpushConfig {
  headers?: Record<string, string>;
  data?: Record<string, string>;
  notification?: WebpushNotification;
  fcm_options?: WebpushFcmOptions;
}

export interface WebpushNotification {
  title?: string;
  body?: string;
  icon?: string;
  badge?: string;
  image?: string;
  vibrate?: number[];
  timestamp?: number;
  renotify?: boolean;
  silent?: boolean;
  require_interaction?: boolean;
  tag?: string;
  actions?: NotificationAction[];
  custom_data?: any;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface WebpushFcmOptions {
  link?: string;
  analytics_label?: string;
}

export interface FcmOptions {
  analytics_label?: string;
}

export interface Notification {
  title?: string;
  body?: string;
  image?: string;
}

// Main Firebase Admin Message payload interface
export interface FirebaseAdminPayload {
  data?: Record<string, string>;
  notification?: Notification;
  android?: AndroidConfig;
  webpush?: WebpushConfig;
  apns?: APNSConfig;
  fcm_options?: FcmOptions;
  token?: string;
  topic?: string;
  condition?: string;
}

// Our notification form types
export interface NotificationFormData {
  type: 'users' | 'topic' | 'broadcast';
  userIds?: string[];
  topic?: string;
  title: string;
  body: string;
  image?: string;
  data?: Record<string, string>;
  priority?: 'normal' | 'high';
  ttl?: number;
  sound?: string;
  clickAction?: string;
  android?: {
    enabled: boolean;
    channelId?: string;
    color?: string;
    icon?: string;
    tag?: string;
  };
  ios?: {
    enabled: boolean;
    badge?: number;
    sound?: string;
    category?: string;
    threadId?: string;
  };
  web?: {
    enabled: boolean;
    link?: string;
    requireInteraction?: boolean;
    silent?: boolean;
  };
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  messageId?: string;
  failureCount?: number;
  successCount?: number;
  responses?: {
    success: boolean;
    messageId?: string;
    error?: string;
  }[];
}

// User selection types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: {
    id: string;
    raisonSocial: string;
  };
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  subscriberCount?: number;
}
