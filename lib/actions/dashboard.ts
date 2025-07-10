"use server";
import { serverApi } from "../axios-interceptor";

export const getDashboardStatsAction = async () => {
  try {
    const response = await serverApi.get("/dashboard/stats");
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch dashboard stats: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return fallback data
    return {
      totalRevenue: 95000,
      totalOrders: 2345,
      activeUsers: 1800,
      productsInStock: 15200,
      revenueGrowth: 20.1,
      ordersGrowth: 15.3,
      usersGrowth: 8.7,
      stockGrowth: 3.2,
    };
  }
};

export const getRevenueDataAction = async () => {
  try {
    const response = await serverApi.get("/dashboard/revenue-trend");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch revenue data: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    // Return fallback data
    return [
      { month: "Jan", revenue: 45000, orders: 120, users: 1100 },
      { month: "Feb", revenue: 52000, orders: 145, users: 1150 },
      { month: "Mar", revenue: 48000, orders: 135, users: 1200 },
      { month: "Apr", revenue: 61000, orders: 165, users: 1280 },
      { month: "May", revenue: 55000, orders: 155, users: 1320 },
      { month: "Jun", revenue: 67000, orders: 180, users: 1400 },
      { month: "Jul", revenue: 72000, orders: 195, users: 1450 },
      { month: "Aug", revenue: 69000, orders: 185, users: 1500 },
      { month: "Sep", revenue: 78000, orders: 210, users: 1580 },
      { month: "Oct", revenue: 82000, orders: 225, users: 1650 },
      { month: "Nov", revenue: 89000, orders: 245, users: 1720 },
      { month: "Dec", revenue: 95000, orders: 260, users: 1800 },
    ];
  }
};

export const getOrderStatusDataAction = async () => {
  try {
    const response = await serverApi.get("/dashboard/order-status");
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch order status data: ${response.statusText}`
      );
    }
    // Transform the response data to match the expected format
    const transformedData = Object.entries(response.data).map(
      ([status, value]) => {
        const statusMap = {
          COMPLETED: { name: "Completed", color: "#22c55e" },
          PENDING: { name: "Pending", color: "#f59e0b" },
          SHIPPING: { name: "Shipping", color: "#3b82f6" },
          CANCELED: { name: "Cancelled", color: "#ef4444" },
          CANCELLED: { name: "Cancelled", color: "#ef4444" },
          REJECTED: { name: "Rejected", color: "#ef4444" },
        };

        return {
          name: statusMap[status as keyof typeof statusMap]?.name || status,
          value: value as number,
          color:
            statusMap[status as keyof typeof statusMap]?.color || "#6b7280",
        };
      }
    );

    return transformedData;
  } catch (error) {
    console.error("Error fetching order status data:", error);
    // Return fallback data
    return [
      { name: "Completed", value: 45, color: "#22c55e" },
      { name: "Pending", value: 25, color: "#f59e0b" },
      { name: "Shipping", value: 20, color: "#3b82f6" },
      { name: "Cancelled", value: 10, color: "#ef4444" },
    ];
  }
};

export const getTopProductsDataAction = async () => {
  try {
    const response = await serverApi.get("/dashboard/top-products");
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch top products data: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching top products data:", error);
    // Return fallback data
    return [
      { name: "Laptop Dell XPS", sales: 145, revenue: 289500 },
      { name: "iPhone 15 Pro", sales: 132, revenue: 131868 },
      { name: "Samsung 4K TV", sales: 98, revenue: 78402 },
      { name: "Wireless Headphones", sales: 87, revenue: 8699 },
      { name: "Gaming Mouse", sales: 76, revenue: 3800 },
      { name: "Mechanical Keyboard", sales: 65, revenue: 9750 },
    ];
  }
};

export const getStockLevelsDataAction = async () => {
  try {
    const response = await serverApi.get("/dashboard/stock-levels");
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch stock levels data: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching stock levels data:", error);
    // Return fallback data
    return [
      { month: "Jan", inStock: 12500, lowStock: 450, outOfStock: 23 },
      { month: "Feb", inStock: 13200, lowStock: 380, outOfStock: 18 },
      { month: "Mar", inStock: 12800, lowStock: 420, outOfStock: 25 },
      { month: "Apr", inStock: 14100, lowStock: 350, outOfStock: 15 },
      { month: "May", inStock: 13900, lowStock: 390, outOfStock: 20 },
      { month: "Jun", inStock: 15200, lowStock: 320, outOfStock: 12 },
    ];
  }
};

export const getRegionalSalesDataAction = async () => {
  try {
    const response = await serverApi.get("/dashboard/regional-sales");
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch regional sales data: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching regional sales data:", error);
    // Return fallback data
    return [
      { region: "Alger", sales: 45000, orders: 180 },
      { region: "Oran", sales: 38000, orders: 152 },
      { region: "Constantine", sales: 32000, orders: 128 },
      { region: "Annaba", sales: 28000, orders: 112 },
      { region: "Blida", sales: 25000, orders: 100 },
      { region: "Setif", sales: 22000, orders: 88 },
    ];
  }
};

export const getCategoryPerformanceDataAction = async () => {
  try {
    const response = await serverApi.get("/dashboard/category-performance");
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch category performance data: ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching category performance data:", error);
    // Return fallback data
    return [
      { category: "Electronics", sales: 125000, growth: 15.2 },
      { category: "Clothing", sales: 89000, growth: 8.7 },
      { category: "Home & Garden", sales: 67000, growth: 12.3 },
      { category: "Sports", sales: 45000, growth: 6.8 },
      { category: "Books", sales: 32000, growth: -2.1 },
    ];
  }
};

export const getRecentOrdersAction = async () => {
  try {
    const response = await serverApi.get("/dashboard/recent-orders-admin");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch recent orders: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    // Return fallback data
    return [
      {
        id: "ORD-001",
        customer: "John Doe",
        status: "COMPLETED",
        amount: "$234.50",
      },
      {
        id: "ORD-002",
        customer: "Jane Smith",
        status: "PENDING",
        amount: "$156.75",
      },
      {
        id: "ORD-003",
        customer: "Bob Johnson",
        status: "SHIPPING",
        amount: "$89.99",
      },
      {
        id: "ORD-004",
        customer: "Alice Brown",
        status: "ACCEPTED",
        amount: "$345.20",
      },
    ];
  }
};

export const getQuickStatsAction = async () => {
  try {
    const response = await serverApi.get("/dashboard/quick-stats");
    if (response.status !== 200) {
      throw new Error(`Failed to fetch quick stats: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    // Return fallback data
    return {
      revenueGrowth: 12,
      lowStockProducts: 23,
      fulfillmentRate: 98,
      activeCompanies: 45,
      averageOrderValue: 187,
      inventoryTurnover: 4.2,
    };
  }
};
