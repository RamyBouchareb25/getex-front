const mockCompanies = [
  {
    id: "comp1",
    raisonSocial: "Admin Corp",
    nif: "123456789012",
    nis: "987654321098",
    phone: "0123456789",
    userId: "1",
    addressId: "addr1",
    createdAt: "2024-01-15",
    address: {
      id: "addr1",
      wilaya: "Alger",
      commune: "Alger Centre",
    },
  },
  {
    id: "comp2",
    raisonSocial: "Wholesale Inc",
    nif: "234567890123",
    nis: "876543210987",
    phone: "0234567890",
    userId: "2",
    addressId: "addr2",
    createdAt: "2024-01-20",
    address: {
      id: "addr2",
      wilaya: "Oran",
      commune: "Oran Centre",
    },
  },
]

export async function getCompanies() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockCompanies
}

export async function getCompanyById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockCompanies.find((company) => company.id === id)
}

export async function createCompany(companyData: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Creating company:", companyData)
  return { id: Date.now().toString(), ...companyData }
}

export async function updateCompany(id: string, companyData: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Updating company:", id, companyData)
  return { id, ...companyData }
}

export async function deleteCompany(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Deleting company:", id)
  return { success: true }
}
