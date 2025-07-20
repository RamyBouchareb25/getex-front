"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";

export const getInvoicesForOrderAction = async (orderId: string, documentType: string) => {
  try {
    const response = await serverApi.get(`/order/${orderId}/print/${documentType}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching invoice document:", error);
    return { success: false, message: "Failed to fetch invoice document" };
  }
};
