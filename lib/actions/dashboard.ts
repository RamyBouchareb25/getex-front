"use server";
import { serverApi } from "../axios-interceptor";

export const getDashboardStatsAction = async () => {
  try {
    console.log('🔍 Fetching dashboard stats...');
    console.log('BACKEND_URL:', process.env.BACKEND_URL);
    
    const response = await serverApi.get("/dashboard/stats");
    
    console.log('✅ Dashboard stats response:', {
      status: response.status,
      statusText: response.statusText,
      dataKeys: Object.keys(response.data || {}),
    });
    
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch dashboard stats: ${response.status} ${response.statusText}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      ...(error && typeof error === 'object' ? error : {}),
    });
    
    // Return fallback data
    return {
      totalRevenue: 0,
      totalOrders: 0,
      activeUsers: 0,
      productsInStock: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      usersGrowth: 0,
      stockGrowth: 0,
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
    return [];
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
    return [];
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
    return [];
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
    return [];
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
    return [];
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
    return [];
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
    return [];
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
      revenueGrowth: 0,
      lowStockProducts: 0,
      fulfillmentRate: 0,
      activeCompanies: 0,
      averageOrderValue: 0,
      inventoryTurnover: 0,
    };
  }
};
