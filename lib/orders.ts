const mockOrders = [
  {
    id: "1",
    userId: "1",
    total: 234.5,
    status: "COMPLETED",
    createdAt: "2024-01-15",
    user: {
      id: "1",
      email: "admin@example.com",
      name: "Admin User",
      company: {
        raisonSocial: "Admin Corp",
      },
    },
    orderItems: [
      {
        id: "item1",
        productId: "1",
        quantity: 1,
        price: 199.99,
        product: {
          id: "1",
          name: "Laptop Dell XPS 13",
        },
      },
    ],
  },
]

export async function getOrders() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockOrders
}

export async function getOrderById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockOrders.find((order) => order.id === id)
}

export async function createOrder(orderData: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Creating order:", orderData)
  return { id: Date.now().toString(), ...orderData }
}

export async function updateOrder(id: string, orderData: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Updating order:", id, orderData)
  return { id, ...orderData }
}

export async function deleteOrder(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Deleting order:", id)
  return { success: true }
}
