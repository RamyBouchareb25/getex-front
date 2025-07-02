"use server"

import { revalidatePath } from "next/cache"
import { createProduct, updateProduct, deleteProduct } from "@/lib/products"
import { createSubCategory } from "@/lib/subcategories"
import { createCategory } from "@/lib/categories"

export async function createProductAction(formData: FormData) {
  try {
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
    }

    // Create category if provided
    let categoryId = formData.get("categoryId") as string
    const categoryName = formData.get("categoryName") as string
    const categoryDescription = formData.get("categoryDescription") as string

    if (!categoryId && categoryName) {
      const category = await createCategory({
        name: categoryName,
        description: categoryDescription,
      })
      categoryId = category.id
    }

    // Create subcategory if provided
    let subCategoryId = formData.get("subCategoryId") as string
    const subCategoryName = formData.get("subCategoryName") as string
    const subCategoryDescription = formData.get("subCategoryDescription") as string

    if (!subCategoryId && subCategoryName && categoryId) {
      const subCategory = await createSubCategory({
        name: subCategoryName,
        description: subCategoryDescription,
        categoryId,
      })
      subCategoryId = subCategory.id
    }

    // Create product
    await createProduct({
      ...productData,
      subCategoryId,
    })

    revalidatePath("/dashboard/products")
    return { success: true, message: "Product created successfully" }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, message: "Failed to create product" }
  }
}

export async function updateProductAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      subCategoryId: formData.get("subCategoryId") as string,
    }

    await updateProduct(id, productData)

    revalidatePath("/dashboard/products")
    return { success: true, message: "Product updated successfully" }
  } catch (error) {
    console.error("Error updating product:", error)
    return { success: false, message: "Failed to update product" }
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await deleteProduct(productId)

    revalidatePath("/dashboard/products")
    return { success: true, message: "Product deleted successfully" }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, message: "Failed to delete product" }
  }
}
