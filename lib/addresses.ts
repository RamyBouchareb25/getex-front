const mockAddresses = [
  {
    id: "addr1",
    wilaya: "Alger",
    commune: "Alger Centre",
    createdAt: "2024-01-15",
  },
  {
    id: "addr2",
    wilaya: "Oran",
    commune: "Oran Centre",
    createdAt: "2024-01-20",
  },
]

export async function getAddresses() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockAddresses
}

export async function getAddressById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockAddresses.find((address) => address.id === id)
}

export async function createAddress(addressData: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Creating address:", addressData)
  return { id: Date.now().toString(), ...addressData }
}

export async function updateAddress(id: string, addressData: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Updating address:", id, addressData)
  return { id, ...addressData }
}

export async function deleteAddress(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Deleting address:", id)
  return { success: true }
}
