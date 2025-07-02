"use server"

import { revalidatePath } from "next/cache"
import { createCompany } from "@/lib/companies"
import { createAddress } from "@/lib/addresses"


export async function createUserAction(formData: FormData) {
  try {

    const userData = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
    }

    // Create address if provided
    let addressId = null
    const wilaya = formData.get("wilaya") as string
    const commune = formData.get("commune") as string

    if (wilaya && commune) {
      const address = await createAddress({ wilaya, commune })
      addressId = address.id
    }

    // Create company if provided
    let companyId = null
    const raisonSocial = formData.get("raisonSocial") as string
    const nif = formData.get("nif") as string
    const nis = formData.get("nis") as string
    const phone = formData.get("phone") as string

    if (raisonSocial && nif && nis && phone) {
      const company = await createCompany({
        raisonSocial,
        nif,
        nis,
        phone,
        addressId,
      })
      companyId = company.id
    }

    // Create user
    await createUser({
      ...userData,
      companyId,
    })

    revalidatePath("/dashboard/users")
    return { success: true, message: "User created successfully" }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, message: "Failed to create user" }
  }
}

export async function updateUserAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const userData = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
    }

    await updateUser(id, userData)

    revalidatePath("/dashboard/users")
    return { success: true, message: "User updated successfully" }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, message: "Failed to update user" }
  }
}

export async function deleteUserAction(userId: string) {
  try {
    await deleteUser(userId)

    revalidatePath("/dashboard/users")
    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, message: "Failed to delete user" }
  }
}

export async function resetUserPasswordAction(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (newPassword !== confirmPassword) {
      return { success: false, message: "Passwords do not match" }
    }

    // TODO: Implement password reset logic
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Resetting password for user:", userId)

    return { success: true, message: "Password reset successfully" }
  } catch (error) {
    console.error("Error resetting password:", error)
    return { success: false, message: "Failed to reset password" }
  }
}
