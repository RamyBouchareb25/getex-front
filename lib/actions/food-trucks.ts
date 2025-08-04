"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";
import { AxiosError } from "axios";

export const createFoodTruckAction = async (formData: FormData) => {
  try {
    const form = new FormData();
    const fields = [
      "userId",
      "plate", 
      "licence",
      "carteGrise",
    ];
    
    for (const field of fields) {
      const value = formData.get(field);
      if (value !== null && value !== undefined) {
        form.append(field, value);
      }
    }

    console.log("Creating food truck with form data:", Object.fromEntries(form.entries()));
    const response = await serverApi.post("/food-truck", form);
    
    if (response.status !== 201) {
      throw new Error(`Failed to create food truck: ${response.statusText}`);
    }

    revalidatePath("/dashboard/food-trucks");
    return { success: true, message: "Food truck created successfully" };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { status, data } = error.response;
      return {
        success: false,
        message: `Failed to create food truck: ${data.message || "Unknown error"}`,
        status,
      };
    }
    console.error("Error creating food truck:", error);
    return { success: false, message: "Failed to create food truck" };
  }
};

export const updateFoodTruckAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const userId = formData.get("userId") as string;
    const plate = formData.get("plate") as string;
    const licence = formData.get("licence") as string;

    if (!id) {
      throw new Error("Food truck ID is required for update");
    }

    const payload: any = {
      userId,
      plate,
      licence,
    };

    // Handle file upload for carteGrise if provided
    const carteGrise = formData.get("carteGrise") as File;
    if (carteGrise && carteGrise.size > 0) {
      const form = new FormData();
      Object.keys(payload).forEach(key => {
        form.append(key, payload[key]);
      });
      form.append("carteGrise", carteGrise);
      
      const response = await serverApi.patch(`/food-truck/${id}`, form);
      if (response.status !== 200) {
        throw new Error(`Failed to update food truck: ${response.statusText}`);
      }
    } else {
      const response = await serverApi.patch(`/food-truck/${id}`, payload);
      if (response.status !== 200) {
        throw new Error(`Failed to update food truck: ${response.statusText}`);
      }
    }

    console.log("Food truck updated successfully");
    revalidatePath("/dashboard/food-trucks");
    return { success: true, message: "Food truck updated successfully" };
  } catch (error) {
    console.error("Error updating food truck:", error);
    return { success: false, message: "Failed to update food truck" };
  }
};

export const deleteFoodTruckAction = async (foodTruckId: string) => {
  try {
    if (!foodTruckId) {
      throw new Error("Food truck ID is required for deletion");
    }

    const response = await serverApi.delete(`/food-truck/${foodTruckId}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Failed to delete food truck: ${response.statusText}`);
    }
    
    console.log("Food truck deleted successfully");
    revalidatePath("/dashboard/food-trucks");
    return { success: true, message: "Food truck deleted successfully" };
  } catch (error) {
    console.error("Error deleting food truck:", error);
    return { success: false, message: "Failed to delete food truck" };
  }
};

export const getFoodTrucksAction = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);

    const url = `/food-truck${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    
    console.log("Fetching food trucks from URL:", url);
    const response = await serverApi.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch food trucks: ${response.statusText}`);
    }
    
    const filteredFoodTrucks = response.data.foodTrucks?.filter((foodTruck: any) => foodTruck.id) || [];
    return {
      ...response.data,
      foodTrucks: filteredFoodTrucks,
    };
  } catch (error) {
    console.error("Error fetching food trucks:", error);
    return { foodTrucks: [], total: 0, page: 1, totalPages: 0 };
  }
};

export const getFoodTruckUsersAction = async () => {
  try {
    const response = await serverApi.get("/user?roles=FOOD_TRUCK");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch food truck users: ${response.statusText}`);
    }
    return response.data.users || [];
  } catch (error) {
    console.error("Error fetching food truck users:", error);
    return [];
  }
};
