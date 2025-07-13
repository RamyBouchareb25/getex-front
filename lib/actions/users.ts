"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";

export const createUserAction = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    // Company fields
    const raisonSocial = formData.get("raisonSocial") as string;
    const nif = formData.get("nif") as string;
    const nis = formData.get("nis") as string;
    const phone = formData.get("phone") as string;

    // Address fields
    const wilaya = formData.get("wilaya") as string;
    const commune = formData.get("commune") as string;
    const rc = formData.get("rc") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const payload = {
      email,
      name,
      password,
      role,
      raisonSocial,
      nif,
      nis,
      rc,
      phone,
      wilaya,
      commune,
      confirmPassword
    };
    const response = await serverApi.post("/user", payload);
    if (response.status !== 201) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }
    console.log("User created successfully:", response.data);

    revalidatePath("/dashboard/users");
    return { success: true, message: "User created successfully" };
  } catch (error) {
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

    const payload = {
      email,
      name,
      role,
    };

    const response = await serverApi.patch(`/user/${id}`, payload);
    if (response.status !== 200) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }
    console.log("User updated successfully:", response.data);

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
      password: newPassword,
    };

    const response = await serverApi.patch(`/user/${userId}/password`, payload);
    if (response.status !== 200) {
      throw new Error(`Failed to reset password: ${response.statusText}`);
    }
    console.log("Password reset successfully for user:", userId);

    revalidatePath("/dashboard/users");
    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, message: "Failed to reset password" };
  }
};

export const getUsersAction = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  roles?: string[];
  dateFilter?: string;
}) => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.roles && params.roles.length > 0) {
      params.roles.forEach(role => searchParams.append('roles', role));
    }
    if (params?.dateFilter) searchParams.append('dateFilter', params.dateFilter);

    const url = `/user${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await serverApi.get(url);
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return response.data;
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
