"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";
import { Pagination } from "@/types";

export const createCamionAction = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const plate = formData.get("plate") as string;
    const companyId = formData.get("companyId") as string;

    const payload = {
      name,
      plate,
      companyId,
    };

    const response = await serverApi.post("/camion", payload);
    if (response.status !== 201) {
      throw new Error(`Failed to create truck: ${response.statusText}`);
    }
    console.log("Truck created successfully:", response.data);

    revalidatePath("/dashboard/camions");
    return { success: true, message: "Truck created successfully" };
  } catch (error) {
    console.error("Error creating truck:", error);
    return { success: false, message: "Failed to create truck" };
  }
};

export const updateCamionAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const plate = formData.get("plate") as string;
    const companyId = formData.get("companyId") as string;

    if (!id) {
      throw new Error("Truck ID is required for update");
    }

    const payload = {
      name,
      plate,
      companyId
    };

    const response = await serverApi.patch(`/camion/${id}`, payload);
    if (response.status !== 200) {
      throw new Error(`Failed to update truck: ${response.statusText}`);
    }
    console.log("Truck updated successfully:", response.data);

    revalidatePath("/dashboard/camions");
    return { success: true, message: "Truck updated successfully" };
  } catch (error) {
    console.error("Error updating truck:", error);
    return { success: false, message: "Failed to update truck" };
  }
};

export const deleteCamionAction = async (camionId: string) => {
  try {
    if (!camionId) {
      throw new Error("Truck ID is required for deletion");
    }

    const response = await serverApi.delete(`/camion/${camionId}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Failed to delete truck: ${response.statusText}`);
    }
    console.log("Truck deleted successfully");

    revalidatePath("/dashboard/camions");
    return { success: true, message: "Truck deleted successfully" };
  } catch (error) {
    console.error("Error deleting truck:", error);
    return { success: false, message: "Failed to delete truck" };
  }
};

export const getCamionsAction = async ({ 
  page, 
  limit, 
  search, 
  companyId,
  dateFrom, 
  dateTo
}: Pagination & { 
  search?: string; 
  companyId?: string;
  dateFrom?: string; 
  dateTo?: string; 
}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('search', search);
    if (companyId) params.append('companyId', companyId);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await serverApi.get(`/camion/admin?${params.toString()}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch trucks: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching trucks:", error);
    return { camions: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
};

export const getCompaniesAction = async () => {
  try {
    const response = await serverApi.get("/company?page=1&limit=100");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch companies: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};
