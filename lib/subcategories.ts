const mockSubCategories = [
  {
    id: "1",
    name: "Laptops",
    description: "Portable computers",
    image: "/placeholder.svg?height=50&width=50",
    categoryId: "1",
    createdAt: "2024-01-15",
    category: {
      id: "1",
      name: "Electronics",
    },
  },
  {
    id: "2",
    name: "Smartphones",
    description: "Mobile phones",
    image: "/placeholder.svg?height=50&width=50",
    categoryId: "1",
    createdAt: "2024-01-20",
    category: {
      id: "1",
      name: "Electronics",
    },
  },
]

export async function getSubCategories() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockSubCategories
}

export async function getSubCategoryById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockSubCategories.find((subCategory) => subCategory.id === id)
}

export async function createSubCategory(subCategoryData: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Creating sub category:", subCategoryData)
  return { id: Date.now().toString(), ...subCategoryData }
}

export async function updateSubCategory(id: string, subCategoryData: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Updating sub category:", id, subCategoryData)
  return { id, ...subCategoryData }
}

export async function deleteSubCategory(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Deleting sub category:", id)
  return { success: true }
}
