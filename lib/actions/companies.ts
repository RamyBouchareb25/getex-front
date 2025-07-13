"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";
import { Pagination } from "@/types";

export const updateCompanyAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const raisonSocial = formData.get("raisonSocial") as string;
    const nif = formData.get("nif") as string;
    const nis = formData.get("nis") as string;
    const phone = formData.get("phone") as string;
    const wilaya = formData.get("wilaya") as string;
    const commune = formData.get("commune") as string;

    if (!id) {
      throw new Error("Company ID is required for update");
    }

    const payload = {
      raisonSocial,
      nif,
      nis,
      phone: +phone,
      address:
        wilaya && commune
          ? {
              wilaya,
              commune,
            }
          : undefined,
    };

    const response = await serverApi.patch(`/company/${id}`, payload);
    if (response.status !== 200) {
      throw new Error(`Failed to update company: ${response.statusText}`);
    }
    console.log("Company updated successfully:", response.data);

    revalidatePath("/dashboard/companies");
    return { success: true, message: "Company updated successfully" };
  } catch (error) {
    console.error("Error updating company:", error);
    return { success: false, message: "Failed to update company" };
  }
};

export const getCompaniesAction = async ({ 
  page, 
  limit, 
  search, 
  wilaya, 
  dateFrom, 
  dateTo 
}: Pagination & { 
  search?: string; 
  wilaya?: string; 
  dateFrom?: string; 
  dateTo?: string; 
}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('search', search);
    if (wilaya) params.append('wilaya', wilaya);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await serverApi.get(`/company?${params.toString()}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch companies: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return { companies: [], total: 0, page: 1, limit: 10, totalPages: 0 };
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
