"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";

export const createSubCategoryAction = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string | undefined;
    const description = formData.get("description") as string | undefined;
    const categoryId = formData.get("categoryId") as string | undefined;
    const image = formData.get("image") as File;

    // Create a new FormData object to send to the API
    const apiFormData = new FormData();

    if (name && name.trim()) {
      apiFormData.append("name", name.trim());
    }

    if (description && description.trim()) {
      apiFormData.append("description", description.trim());
    }

    if (categoryId) {
      apiFormData.append("categoryId", categoryId);
    }

    // Only append image if it's a valid file (not empty)
    if (image && image.size > 0) {
      apiFormData.append("image", image);
    }

    const response = await serverApi.post("/sub-category", apiFormData);
    if (response.status !== 201) {
      throw new Error(`Failed to create sub category: ${response.statusText}`);
    }
    console.log("Sub category created successfully:", response.data);

    revalidatePath("/dashboard/subcategories");
    return { success: true, message: "Sub category created successfully" };
  } catch (error) {
    console.error("Error creating sub category:", error);
    return { success: false, message: "Failed to create sub category" };
  }
};

export const updateSubCategoryAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string | undefined;
    const description = formData.get("description") as string | undefined;
    const categoryId = formData.get("categoryId") as string | undefined;
    const image = formData.get("image") as File;

    if (!id) {
      throw new Error("Sub category ID is required for update");
    }

    // Create a new FormData object to send to the API
    const apiFormData = new FormData();

    if (name && name.trim()) {
      apiFormData.append("name", name.trim());
    }

    if (description && description.trim()) {
      apiFormData.append("description", description.trim());
    }

    if (categoryId) {
      apiFormData.append("categoryId", categoryId);
    }

    // Only append image if it's a valid file (not empty)
    if (image && image.size > 0) {
      apiFormData.append("image", image);
    }

    const response = await serverApi.put(`/sub-category/${id}`, apiFormData);
    if (response.status !== 200) {
      throw new Error(`Failed to update sub category: ${response.statusText}`);
    }
    console.log("Sub category updated successfully:", response.data);

    revalidatePath("/dashboard/subcategories");
    return { success: true, message: "Sub category updated successfully" };
  } catch (error) {
    console.error("Error updating sub category:", error);
    return { success: false, message: "Failed to update sub category" };
  }
};

export const deleteSubCategoryAction = async (subCategoryId: string) => {
  try {
    if (!subCategoryId) {
      throw new Error("Sub category ID is required for deletion");
    }

    const response = await serverApi.delete(`/sub-category/${subCategoryId}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Failed to delete sub category: ${response.statusText}`);
    }
    console.log("Sub category deleted successfully");

    revalidatePath("/dashboard/subcategories");
    return { success: true, message: "Sub category deleted successfully" };
  } catch (error) {
    console.error("Error deleting sub category:", error);
    return { success: false, message: "Failed to delete sub category" };
  }
};

export const getSubCategoriesAction = async () => {
  try {
    const response = await serverApi.get("/sub-category?page=1&limit=100");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch sub categories: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching sub categories:", error);
    return [];
  }
};

export const getCategoriesAction = async () => {
  try {
    const response = await serverApi.get("/category?page=1&limit=100");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
     throw new Error("UNAUTHORIZED");
    }
    return [];
  }
};
