"use server"

import { revalidatePath } from "next/cache"
import { createStock, updateStock, deleteStock } from "@/lib/stock"

export async function createStockAction(formData: FormData) {
  try {
    const stockData = {
      productId: formData.get("productId") as string,
      quantity: Number.parseInt(formData.get("quantity") as string),
      price: Number.parseFloat(formData.get("price") as string),
      minQuantity: Number.parseInt(formData.get("minQuantity") as string),
      expirationDate: formData.get("expirationDate") as string,
      reductionPercent: Number.parseFloat(formData.get("reductionPercent") as string),
      visible: formData.get("visible") === "true",
      ownerId: formData.get("ownerId") as string,
    }

    await createStock(stockData)

    revalidatePath("/dashboard/stock")
    return { success: true, message: "Stock created successfully" }
  } catch (error) {
    console.error("Error creating stock:", error)
    return { success: false, message: "Failed to create stock" }
  }
}

export async function updateStockAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const stockData = {
      quantity: Number.parseInt(formData.get("quantity") as string),
      price: Number.parseFloat(formData.get("price") as string),
      minQuantity: Number.parseInt(formData.get("minQuantity") as string),
      expirationDate: formData.get("expirationDate") as string,
      reductionPercent: Number.parseFloat(formData.get("reductionPercent") as string),
      visible: formData.get("visible") === "true",
    }

    await updateStock(id, stockData)

    revalidatePath("/dashboard/stock")
    return { success: true, message: "Stock updated successfully" }
  } catch (error) {
    console.error("Error updating stock:", error)
    return { success: false, message: "Failed to update stock" }
  }
}

export async function deleteStockAction(stockId: string) {
  try {
    await deleteStock(stockId)

    revalidatePath("/dashboard/stock")
    return { success: true, message: "Stock deleted successfully" }
  } catch (error) {
    console.error("Error deleting stock:", error)
    return { success: false, message: "Failed to delete stock" }
  }
}
