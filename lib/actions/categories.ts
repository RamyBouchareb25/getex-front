"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";

export const createCategoryAction = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string | undefined;
    const description = formData.get("description") as string | undefined;
    const image = formData.get("image") as File;

    // Create a new FormData object to send to the API
    const apiFormData = new FormData();
    
    if (name && name.trim()) {
      apiFormData.append("name", name.trim());
    }
    
    if (description && description.trim()) {
      apiFormData.append("description", description.trim());
    }
    
    // Only append image if it's a valid file (not empty)
    if (image && image.size > 0) {
      apiFormData.append("image", image);
    }

    const response = await serverApi.post("/category", apiFormData);
    if (response.status !== 201) {
      throw new Error(`Failed to create category: ${response.statusText}`);
    }
    console.log("Category created successfully:", response.data);

    revalidatePath("/dashboard/categories");
    return { success: true, message: "Category created successfully" };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, message: "Failed to create category" };
  }
};

export const updateCategoryAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string | undefined;
    const description = formData.get("description") as string | undefined;
    const image = formData.get("image") as File;

    if (!id) {
      throw new Error("Category ID is required for update");
    }

    // Create a new FormData object to send to the API
    const apiFormData = new FormData();
    
    if (name && name.trim()) {
      apiFormData.append("name", name.trim());
    }
    
    if (description && description.trim()) {
      apiFormData.append("description", description.trim());
    }
    
    // Only append image if it's a valid file (not empty)
    if (image && image.size > 0) {
      apiFormData.append("image", image);
    }
    console.log("apiFormData: " + apiFormData.get("image"));
    const response = await serverApi.patch(`/category/${id}`, apiFormData);
    if (response.status !== 201) {
      throw new Error(`Failed to update category: ${response.statusText}`);
    }
    console.log("Category updated successfully:", response.data);

    revalidatePath("/dashboard/categories");
    return { success: true, message: "Category updated successfully" };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, message: "Failed to update category" };
  }
};

export const deleteCategoryAction = async (categoryId: string) => {
  try {
    if (!categoryId) {
      throw new Error("Category ID is required for deletion");
    }

    const response = await serverApi.delete(`/category/${categoryId}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Failed to delete category: ${response.statusText}`);
    }
    console.log("Category deleted successfully");

    revalidatePath("/dashboard/categories");
    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, message: "Failed to delete category" };
  }
};
