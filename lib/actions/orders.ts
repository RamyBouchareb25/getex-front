"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";

export const createOrderAction = async (formData: FormData) => {
  try {
    const userId = formData.get("userId") as string;
    const receiverId = formData.get("receiverId") as string;
    const shippingAddress = formData.get("shippingAddress") as string;
    const total = formData.get("total") as string;
    const status = formData.get("status") as string;

    const payload = {
      userId,
      receiverId,
      shippingAddress,
      total: total ? parseFloat(total) : undefined,
      status,
    };

    const response = await serverApi.post("/order", payload);
    if (response.status !== 201) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }
    console.log("Order created successfully:", response.data);

    revalidatePath("/dashboard/orders");
    return { success: true, message: "Order created successfully" };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, message: "Failed to create order" };
  }
};

export const acceptOrderAction = async (orderId: string) => {
  try {
    if (!orderId) {
      throw new Error("Order ID is required for acceptance");
    }
    const response = await serverApi.patch(`/order/${orderId}/status`, {
      status: "ACCEPTED",
    });
    if (response.status !== 200) {
      throw new Error(`Failed to accept order: ${response.statusText}`);
    }
    console.log("Order accepted successfully:", response.data);
    revalidatePath("/dashboard/orders");
    return { success: true, message: "Order accepted successfully" };
  } catch (error) {
    console.error("Error accepting order:", error);
    return { success: false, message: "Failed to accept order" };
  }
};

export const rejectOrderAction = async (orderId: string) => {
  try {
    if (!orderId) {
      throw new Error("Order ID is required for rejection");
    }
    const response = await serverApi.patch(`/order/${orderId}/status`, {
      status: "REJECTED",
    });
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Failed to reject order: ${response.statusText}`);
    }
    console.log("Order rejected successfully:", response.data);
    revalidatePath("/dashboard/orders");
    return { success: true, message: "Order rejected successfully" };
  } catch (error) {
    console.error("Error rejecting order:", error);
    return { success: false, message: "Failed to reject order" };
  }
};

export const updateOrderAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const total = formData.get("total") as string;
    const status = formData.get("status") as string;
    const shippingAddress = formData.get("shippingAddress") as string;

    if (!id) {
      throw new Error("Order ID is required for update");
    }

    const payload = {
      total: total ? parseFloat(total) : undefined,
      status,
      shippingAddress,
    };

    const response = await serverApi.patch(`/order/${id}`, payload);
    if (response.status !== 200) {
      throw new Error(`Failed to update order: ${response.statusText}`);
    }
    console.log("Order updated successfully:", response.data);

    revalidatePath("/dashboard/orders");
    return { success: true, message: "Order updated successfully" };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, message: "Failed to update order" };
  }
};

export const deleteOrderAction = async (orderId: string) => {
  try {
    if (!orderId) {
      throw new Error("Order ID is required for deletion");
    }

    const response = await serverApi.delete(`/order/${orderId}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Failed to delete order: ${response.statusText}`);
    }
    console.log("Order deleted successfully");

    revalidatePath("/dashboard/orders");
    return { success: true, message: "Order deleted successfully" };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, message: "Failed to delete order" };
  }
};

export const getOrdersAction = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
} = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      userId,
      dateFrom,
      dateTo,
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    queryParams.append("all", "true");

    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);
    if (userId) queryParams.append("userId", userId);
    if (dateFrom) queryParams.append("dateFrom", dateFrom);
    if (dateTo) queryParams.append("dateTo", dateTo);

    const response = await serverApi.get(`/order/admin?${queryParams.toString()}`);
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    // If API returns paginated data, use it; otherwise return as is
    if (response.data.orders && response.data.total !== undefined) {
      return {
        orders: response.data.orders,
        total: response.data.total,
        page: response.data.page || page,
        limit: response.data.limit || limit,
        totalPages: response.data.totalPages || Math.ceil(response.data.total / limit),
      };
    } else {
      // Fallback: treat response data as orders array
      const orders = Array.isArray(response.data) ? response.data : [response.data];
      return {
        orders,
        total: orders.length,
        page,
        limit,
        totalPages: Math.ceil(orders.length / limit),
      };
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      orders: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  }
};

export const getUsersAction = async () => {
  try {
    const response = await serverApi.get("/user");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
