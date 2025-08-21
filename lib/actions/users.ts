"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";
import { AxiosError } from "axios";

export const createUserAction = async (formData: FormData) => {
  try {
    const form = new FormData();
    const fields = [
      "email",
      "name",
      "password",
      "role",
      "raisonSocial",
      "nif",
      "nis",
      "rc",
      "phone",
      "wilaya",
      "commune",
      "confirmPassword",
      "licence",
      "plate",
      "art",
      "carteGrise",
    ];
    for (const field of fields) {
      const value = formData.get(field);
      if (value !== null && value !== undefined) {
        form.append(field, value);
      }
    }
    console.log("Creating user with form data:", Object.fromEntries(form.entries()));
    const response = await serverApi.post("/user", form);
    if (response.status !== 201) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    revalidatePath("/dashboard/users");
    return { success: true, message: "User created successfully" };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { status, statusText } = error.response;
      return {
        success: false,
        message: `Failed to create user: ${statusText || "Unknown error"}`,
        status,
      };
    }
    console.error("Error creating user:", error);
    return { success: false, message: "Failed to create user" };
  }
};

export const updateUserAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    if (!id) {
      throw new Error("User ID is required for update");
    }

    const payload: any = {
      email,
      name,
      role,
    };

    console.log("Updating user with ID:", id, "and payload:", payload);

    // Handle FOOD_TRUCK specific fields
    if (role === "FOOD_TRUCK") {
      const plate = formData.get("plate") as string;
      const licence = formData.get("licence") as string;
      const carteGrise = formData.get("carteGrise") as File;

      payload.plate = plate;
      payload.licence = licence;

      // If carteGrise is provided, use FormData for file upload
      if (carteGrise && carteGrise.size > 0) {
        const form = new FormData();
        Object.keys(payload).forEach(key => {
          form.append(key, payload[key]);
        });
        form.append("carteGrise", carteGrise);
        
        const response = await serverApi.patch(`/user/${id}`, form);
        if (response.status !== 200) {
          throw new Error(`Failed to update user: ${response.statusText}`);
        }
      } else {
        const response = await serverApi.patch(`/user/${id}`, payload);
        if (response.status !== 200) {
          throw new Error(`Failed to update user: ${response.statusText}`);
        }
      }
    } else {
      const response = await serverApi.patch(`/user/${id}`, payload);
      if (response.status !== 200) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }
    }

    console.log("User updated successfully");
    revalidatePath("/dashboard/users");
    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Failed to update user" };
  }
};

export const deleteUserAction = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("User ID is required for deletion");
    }

    const response = await serverApi.delete(`/user/${userId}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }
    console.log("User deleted successfully");

    revalidatePath("/dashboard/users");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user" };
  }
};

export const resetUserPasswordAction = async (formData: FormData) => {
  try {
    const userId = formData.get("userId") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const oldPassword = formData.get("oldPassword") as string;
    if (!userId) {
      throw new Error("User ID is required for password reset");
    }

    if (newPassword !== confirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long",
      };
    }

    const payload = {
      newPassword,
      oldPassword,
    };

    const response = await serverApi.post(
      `/user/${userId}/reset-password`,
      payload
    );
    if (response.status !== 201) {
      throw new Error(`Failed to reset password: ${response.data.message}`);
    }

    revalidatePath("/dashboard/users");
    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { status, data } = error.response;
      return {
        success: false,
        message: `Failed to reset password: ${data.message || "Unknown error"}`,
        status,
      };
    }
    return { success: false, message: "Failed to reset password" };
  }
};

export const getUsersAction = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  roles?: string[];
  dateFilter?: string;
  userId?: string;
}) => {
  try {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.userId) searchParams.append("userId", params.userId);
    if (params?.roles && params.roles.length > 0) {
      params.roles.forEach((role) => searchParams.append("roles", role));
    }
    if (params?.dateFilter)
      searchParams.append("dateFilter", params.dateFilter);

    const url = `/user${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    console.log("Fetching users from URL:", url);
    const response = await serverApi.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    const filteredUsers =
      response.data.users?.filter((user: any) => user.id) || [];
    return {
      ...response.data,
      users: filteredUsers,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], total: 0, page: 1, totalPages: 0 };
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
