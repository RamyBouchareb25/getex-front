"use server";
import { serverApi } from "../axios-interceptor";

export const getInvoicesForOrderAction = async (orderId: string, documentType: string) => {
  try {
    const response = await serverApi.get(`/order/${orderId}/document-data/${documentType}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching invoice document:", error);
    return { success: false, message: "Failed to fetch invoice document" };
  }
};
