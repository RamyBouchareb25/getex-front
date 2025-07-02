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

    const response = await serverApi.put(`/order/${id}`, payload);
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

export const getOrdersAction = async () => {
  try {
    const response = await serverApi.get("/order?all=true");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
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
