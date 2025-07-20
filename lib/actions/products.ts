"use server";
import { revalidatePath } from "next/cache";
import { serverApi } from "../axios-interceptor";
import { Pagination } from "@/types";

export const createProductAction = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string | undefined;
    const reference = formData.get("reference") as string | undefined;
    const description = formData.get("description") as string | undefined;
    const subCategoryId = formData.get("subCategoryId") as string | undefined;
    const image = formData.get("image") as File;
    const includeNutritionalInfo = formData.get("includeNutritionalInfo") === "true";

    // Create a new FormData object to send to the API
    const apiFormData = new FormData();
    
    if (name && name.trim()) {
      apiFormData.append("name", name.trim());
    }
    
    if (reference && reference.trim()) {
      apiFormData.append("reference", reference.trim());
    }
    
    if (description && description.trim()) {
      apiFormData.append("description", description.trim());
    }
    
    if (subCategoryId) {
      apiFormData.append("subCategoryId", subCategoryId);
    }
    
    // Only append image if it's a valid file (not empty)
    if (image && image.size > 0) {
      apiFormData.append("image", image);
    }
    
    // Handle nutritional information if included
    if (includeNutritionalInfo) {
      const nutritionalData = {
        type: (formData.get("nutritionalType") as string) || "N/A",
        graisse: (formData.get("graisse") as string) || "N/A",
        acide: (formData.get("acide") as string) || "N/A", 
        glucide: (formData.get("glucide") as string) || "N/A",
        sucre: (formData.get("sucre") as string) || "N/A",
        proteine: (formData.get("proteine") as string) || "N/A",
        sel: (formData.get("sel") as string) || "N/A",
        fibre: (formData.get("fibre") as string) || "N/A",
        energie: (formData.get("energie") as string) || "N/A"
      };
      
      apiFormData.append("nutritionalInfo", JSON.stringify(nutritionalData));
    }

    const response = await serverApi.post("/product", apiFormData);
    if (response.status !== 201) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }
    console.log("Product created successfully:", response.data);

    revalidatePath("/dashboard/products");
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, message: "Failed to create product" };
  }
};

export const updateProductAction = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string | undefined;
    const description = formData.get("description") as string | undefined;
    const subCategoryId = formData.get("subCategoryId") as string | undefined;
    const image = formData.get("image") as File;

    if (!id) {
      throw new Error("Product ID is required for update");
    }

    // Create a new FormData object to send to the API
    const apiFormData = new FormData();
    
    if (name && name.trim()) {
      apiFormData.append("name", name.trim());
    }
    
    if (description && description.trim()) {
      apiFormData.append("description", description.trim());
    }
    
    if (subCategoryId) {
      apiFormData.append("subCategoryId", subCategoryId);
    }
    
    // Only append image if it's a valid file (not empty)
    if (image && image.size > 0) {
      apiFormData.append("image", image);
    }

    const response = await serverApi.patch(`/product/${id}`, apiFormData);
    if (response.status !== 200) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }
    console.log("Product updated successfully:", response.data);

    revalidatePath("/dashboard/products");
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, message: "Failed to update product" };
  }
};

export const deleteProductAction = async (productId: string) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required for deletion");
    }

    const response = await serverApi.delete(`/product/${productId}`);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }
    console.log("Product deleted successfully");

    revalidatePath("/dashboard/products");
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Failed to delete product" };
  }
};

export const getProductsAction = async ({ 
  page, 
  limit, 
  search, 
  subCategoryId,
  categoryId,
  dateFrom, 
  dateTo 
}: Pagination & { 
  search?: string; 
  subCategoryId?: string;
  categoryId?: string;
  dateFrom?: string; 
  dateTo?: string; 
}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('search', search);
    if (subCategoryId) params.append('subCategoryId', subCategoryId);
    if (categoryId) params.append('categoryId', categoryId);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);

    const response = await serverApi.get(`/product/admin?${params.toString()}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0, page: 1, limit: 10, totalPages: 0 };
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
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
     throw new Error("UNAUTHORIZED");
    }
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
