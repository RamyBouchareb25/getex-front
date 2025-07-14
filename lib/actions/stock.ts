"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";
import { Pagination } from "@/types";

export const createStockAction = async (formData: FormData) => {
  try {
    const productId = formData.get("productId") as string;
    const quantity = formData.get("quantity") as string;
    const price = formData.get("price") as string;
    const minQuantity = formData.get("minQuantity") as string;
    const expirationDate = formData.get("expirationDate") as string;
    const reductionPercent = formData.get("reductionPercent") as string;
    const visible = formData.get("visible") as string;
    const ownerId = formData.get("ownerId") as string;

    const payload = {
      productId,
      quantity: quantity ? parseInt(quantity) : undefined,
      price: price ? parseFloat(price) : undefined,
      minQuantity: minQuantity ? parseInt(minQuantity) : undefined,
      expirationDate,
      reductionPercent: reductionPercent ? parseFloat(reductionPercent) : 0,
      visible: visible === "true",
      ownerId,
    };

    const response = await serverApi.post("/stock", payload);
    if (response.status !== 201) {
      throw new Error(`Failed to create stock: ${response.statusText}`);
    }
    console.log("Stock created successfully:", response.data);

    revalidatePath("/dashboard/stock");
    return { success: true, message: "Stock created successfully" };
  } catch (error) {
    console.error("Error creating stock:", error);
    return { success: false, message: "Failed to create stock" };
  }
};

export const updateStockAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const quantity = formData.get("quantity") as string;
    const price = formData.get("price") as string;
    const minQuantity = formData.get("minQuantity") as string;
    const expirationDate = formData.get("expirationDate") as string;
    const reductionPercent = formData.get("reductionPercent") as string;
    const visible = formData.get("visible") as string;

    if (!id) {
      throw new Error("Stock ID is required for update");
    }

    const payload = {
      quantity: quantity ? parseInt(quantity) : undefined,
      price: price ? parseFloat(price) : undefined,
      minQuantity: minQuantity ? parseInt(minQuantity) : undefined,
      expirationDate,
      reductionPercent: reductionPercent ? parseFloat(reductionPercent) : 0,
      visible: visible === "true",
    };

    const response = await serverApi.patch(`/stock/${id}`, payload);
    if (response.status !== 200) {
      throw new Error(`Failed to update stock: ${response.statusText}`);
    }
    console.log("Stock updated successfully:", response.data);

    revalidatePath("/dashboard/stock");
    return { success: true, message: "Stock updated successfully" };
  } catch (error) {
    console.error("Error updating stock:", error);
    return { success: false, message: "Failed to update stock" };
  }
};

export const deleteStockAction = async (stockId: string) => {
  try {
    if (!stockId) {
      throw new Error("Stock ID is required for deletion");
    }

    const response = await serverApi.delete(`/stock/${stockId}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Failed to delete stock: ${response.statusText}`);
    }
    console.log("Stock deleted successfully");

    revalidatePath("/dashboard/stock");
    return { success: true, message: "Stock deleted successfully" };
  } catch (error) {
    console.error("Error deleting stock:", error);
    return { success: false, message: "Failed to delete stock" };
  }
};

export const getStockAction = async ({ 
  page, 
  limit, 
  search, 
  productId,
  ownerId,
  stockStatus,
  visibility,
  dateFrom, 
  dateTo 
}: Pagination & { 
  search?: string; 
  productId?: string;
  ownerId?: string;
  stockStatus?: string;
  visibility?: string;
  dateFrom?: string; 
  dateTo?: string; 
}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('search', search);
    if (productId) params.append('productId', productId);
    if (ownerId) params.append('ownerId', ownerId);
    if (stockStatus) params.append('stockStatus', stockStatus);
    if (visibility) params.append('visibility', visibility);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await serverApi.get(`/stock/admin?${params.toString()}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch stock: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching stock:", error);
    return { stock: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
};

export const getProductsAction = async () => {
  try {
    const response = await serverApi.get("/product?page=1&limit=100");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
     throw new Error("UNAUTHORIZED");
    }
    return [];
  }
};

export const getUsersAction = async () => {
  try {
    const response = await serverApi.get("/user?page=1&limit=100");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
     throw new Error("UNAUTHORIZED");
    }
    return [];
  }
};
