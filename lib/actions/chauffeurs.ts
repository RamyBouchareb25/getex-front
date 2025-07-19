"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";
import { Pagination } from "@/types";

export const createChauffeurAction = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const companyId = formData.get("companyId") as string;

    const payload = {
      name,
      phone: parseInt(phone),
      companyId,
    };

    const response = await serverApi.post("/chauffeur", payload);
    if (response.status !== 201) {
      throw new Error(`Failed to create driver: ${response.statusText}`);
    }
    console.log("Driver created successfully:", response.data);

    revalidatePath("/dashboard/chauffeurs");
    return { success: true, message: "Driver created successfully" };
  } catch (error) {
    console.error("Error creating driver:", error);
    return { success: false, message: "Failed to create driver" };
  }
};

export const updateChauffeurAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const companyId = formData.get("companyId") as string;

    if (!id) {
      throw new Error("Driver ID is required for update");
    }

    const payload = {
      name,
      phone: parseInt(phone),
      companyId
    };

    const response = await serverApi.patch(`/chauffeur/${id}`, payload);
    if (response.status !== 200) {
      throw new Error(`Failed to update driver: ${response.statusText}`);
    }
    console.log("Driver updated successfully:", response.data);

    revalidatePath("/dashboard/chauffeurs");
    return { success: true, message: "Driver updated successfully" };
  } catch (error) {
    console.error("Error updating driver:", error);
    return { success: false, message: "Failed to update driver" };
  }
};

export const deleteChauffeurAction = async (chauffeurId: string) => {
  try {
    if (!chauffeurId) {
      throw new Error("Driver ID is required for deletion");
    }

    const response = await serverApi.delete(`/chauffeur/${chauffeurId}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Failed to delete driver: ${response.statusText}`);
    }
    console.log("Driver deleted successfully");

    revalidatePath("/dashboard/chauffeurs");
    return { success: true, message: "Driver deleted successfully" };
  } catch (error) {
    console.error("Error deleting driver:", error);
    return { success: false, message: "Failed to delete driver" };
  }
};

export const getChauffeursAction = async ({ 
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

    const response = await serverApi.get(`/chauffeur/admin?${params.toString()}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch drivers: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return { chauffeurs: [], total: 0, page: 1, limit: 10, totalPages: 0 };
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
