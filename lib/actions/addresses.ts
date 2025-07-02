"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";

export const updateAddressAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const wilaya = formData.get("wilaya") as string;
    const commune = formData.get("commune") as string;

    if (!id) {
      throw new Error("Address ID is required for update");
    }

    const payload = {
      wilaya,
      commune,
    };

    const response = await serverApi.put(`/address/${id}`, payload);
    if (response.status !== 200) {
      throw new Error(`Failed to update address: ${response.statusText}`);
    }
    console.log("Address updated successfully:", response.data);

    revalidatePath("/dashboard/addresses");
    return { success: true, message: "Address updated successfully" };
  } catch (error) {
    console.error("Error updating address:", error);
    return { success: false, message: "Failed to update address" };
  }
};

export const getAddressesAction = async () => {
  try {
    const response = await serverApi.get("/address");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch addresses: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
};

export const getCompaniesAction = async () => {
  try {
    const response = await serverApi.get("/company");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch companies: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};
