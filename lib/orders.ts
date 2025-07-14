import { serverApi } from "./axios-interceptor";

interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

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

export async function getOrders(params: GetOrdersParams = {}) {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      userId,
      dateFrom,
      dateTo,
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    queryParams.append("all", "true");

    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);
    if (userId) queryParams.append("userId", userId);
    if (dateFrom) queryParams.append("dateFrom", dateFrom);
    if (dateTo) queryParams.append("dateTo", dateTo);

    const response = await serverApi.get(`/order?${queryParams.toString()}`);
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    // If API returns paginated data, use it; otherwise simulate pagination
    if (response.data.orders && response.data.total !== undefined) {
      return {
        orders: response.data.orders,
        total: response.data.total,
        page: response.data.page || page,
        limit: response.data.limit || limit,
        totalPages: response.data.totalPages || Math.ceil(response.data.total / limit),
      };
    } else {
      // Fallback: simulate pagination on client-side if API doesn't support it
      const orders = Array.isArray(response.data) ? response.data : mockOrders;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = orders.slice(startIndex, endIndex);
      
      return {
        orders: paginatedOrders,
        total: orders.length,
        page,
        limit,
        totalPages: Math.ceil(orders.length / limit),
      };
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    // Fallback to mock data with pagination
    const startIndex = ((params.page || 1) - 1) * (params.limit || 10);
    const endIndex = startIndex + (params.limit || 10);
    const paginatedOrders = mockOrders.slice(startIndex, endIndex);
    
    return {
      orders: paginatedOrders,
      total: mockOrders.length,
      page: params.page || 1,
      limit: params.limit || 10,
      totalPages: Math.ceil(mockOrders.length / (params.limit || 10)),
    };
  }
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
