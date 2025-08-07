"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";
import { FirebaseAdminPayload, NotificationFormData, NotificationResponse, Topic } from "@/types/notifications";

export const sendNotificationAction = async (formData: NotificationFormData): Promise<NotificationResponse> => {
  try {
    // Transform our form data to Firebase Admin payload format
    const firebasePayload: FirebaseAdminPayload = {
      notification: {
        title: formData.title,
        body: formData.body,
        image: formData.image,
      },
      data: formData.data,
      fcm_options: {
        analytics_label: `notification_${formData.type}_${Date.now()}`,
      },
    };

    // Add Android configuration
    if (formData.android?.enabled) {
      firebasePayload.android = {
        priority: formData.priority || 'normal',
        ttl: formData.ttl ? `${formData.ttl}s` : undefined,
        notification: {
          title: formData.title,
          body: formData.body,
          icon: formData.android.icon,
          color: formData.android.color,
          sound: formData.sound,
          click_action: formData.clickAction,
          channel_id: formData.android.channelId,
          tag: formData.android.tag,
          image: formData.image,
        },
      };
    }

    // Add iOS/APNS configuration
    if (formData.ios?.enabled) {
      firebasePayload.apns = {
        payload: {
          aps: {
            alert: {
              title: formData.title,
              body: formData.body,
            },
            badge: formData.ios.badge,
            sound: formData.ios.sound || 'default',
            category: formData.ios.category,
            'thread-id': formData.ios.threadId,
          },
        },
      };
      
      if (formData.image) {
        firebasePayload.apns.fcm_options = {
          image: formData.image,
        };
      }
    }

    // Add Web/Webpush configuration
    if (formData.web?.enabled) {
      firebasePayload.webpush = {
        notification: {
          title: formData.title,
          body: formData.body,
          icon: formData.image,
          image: formData.image,
          require_interaction: formData.web.requireInteraction,
          silent: formData.web.silent,
        },
        fcm_options: {
          link: formData.web.link,
        },
      };
    }

    let endpoint = '';
    let payload: any = { ...firebasePayload };

    // Determine endpoint and add targeting
    switch (formData.type) {
      case 'users':
        endpoint = '/notification/send-to-users';
        payload.userIds = formData.userIds;
        break;
      case 'topic':
        endpoint = '/notification/send-to-topic';
        payload.topic = formData.topic;
        break;
      case 'broadcast':
        endpoint = '/notification/broadcast';
        break;
      default:
        throw new Error('Invalid notification type');
    }

    const response = await serverApi.post(endpoint, payload);
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }

    console.log("Notification sent successfully:", response.data);
    
    // Revalidate notifications-related pages if they exist
    revalidatePath("/dashboard/notification");
    
    return {
      success: true,
      message: "Notification sent successfully",
      messageId: response.data.messageId,
      successCount: response.data.successCount,
      failureCount: response.data.failureCount,
      responses: response.data.responses,
    };
  } catch (error) {
    console.error("Error sending notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send notification",
    };
  }
};

export const getTopicsAction = async (): Promise<Topic[]> => {
  try {
    const response = await serverApi.get("/notification/topics");
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch topics: ${response.statusText}`);
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
};

export const createTopicAction = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const payload = {
      name: name.trim(),
      description: description?.trim(),
    };

    const response = await serverApi.post("/notification/topic", payload);
    
    if (response.status !== 201) {
      throw new Error(`Failed to create topic: ${response.statusText}`);
    }

    console.log("Topic created successfully:", response.data);
    revalidatePath("/dashboard/notification");
    
    return { success: true, message: "Topic created successfully" };
  } catch (error) {
    console.error("Error creating topic:", error);
    return { success: false, message: "Failed to create topic" };
  }
};

export const subscribeUsersToTopicAction = async (formData: FormData) => {
  try {
    const topicId = formData.get("topicId") as string;
    const userIds = formData.getAll("userIds") as string[];

    const payload = {
      topicId,
      userIds,
    };

    const response = await serverApi.post("/notification/topics/subscribe", payload);
    
    if (response.status !== 200) {
      throw new Error(`Failed to subscribe users to topic: ${response.statusText}`);
    }

    console.log("Users subscribed to topic successfully:", response.data);
    revalidatePath("/dashboard/notification");
    
    return { success: true, message: "Users subscribed to topic successfully" };
  } catch (error) {
    console.error("Error subscribing users to topic:", error);
    return { success: false, message: "Failed to subscribe users to topic" };
  }
};

export const getNotificationHistoryAction = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const response = await serverApi.get(`/notification/history?${queryParams.toString()}`);
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch notification history: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching notification history:", error);
    return {
      notifications: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }
};
