import { Category } from "@prisma/client";
import { serverApi } from "./axios-interceptor";

const mockCategories = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and gadgets",
    image: "/placeholder.svg?height=50&width=50",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Clothing",
    description: "Fashion and apparel",
    image: "/placeholder.svg?height=50&width=50",
    createdAt: "2024-01-20",
  },
];

export async function getCategories() {
  try {
    const response = await serverApi.get("/category?page=1&limit=100");
    if (response.status === 200) {
      return response.data as Category[];
    } else {
      console.error("Failed to fetch categories:", response.statusText);
      return mockCategories;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getCategoryById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCategories.find((category) => category.id === id);
}

export async function createCategory(categoryData: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Creating category:", categoryData);
  return { id: Date.now().toString(), ...categoryData };
}

export async function updateCategory(id: string, categoryData: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Updating category:", id, categoryData);
  return { id, ...categoryData };
}

export async function deleteCategory(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Deleting category:", id);
  return { success: true };
}
