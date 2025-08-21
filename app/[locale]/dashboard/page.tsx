import {
  getDashboardStatsAction,
  getRevenueDataAction,
  getOrderStatusDataAction,
  getTopProductsDataAction,
  getStockLevelsDataAction,
  getRegionalSalesDataAction,
  getCategoryPerformanceDataAction,
  getRecentOrdersAction,
  getQuickStatsAction,
} from "@/lib/actions/dashboard";
import DashboardCharts from "@/components/dashboard-charts";

// Helper function to safely execute dashboard actions
async function safeDashboardAction<T>(
  actionName: string,
  action: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    const result = await action();
    console.log(`✅ ${actionName} completed successfully`);
    return result;
  } catch (error) {
    console.error(`❌ ${actionName} failed:`, error);
    return fallback;
  }
}

export default async function DashboardPage() {
  console.log('🏁 Starting dashboard page render...');

  const [
    dashboardStats,
    revenueData,
    orderStatusData,
    topProductsData,
    stockLevelsData,
    regionalSalesData,
    categoryPerformanceData,
    recentOrders,
    quickStats,
  ] = await Promise.allSettled([
    safeDashboardAction(
      'getDashboardStatsAction',
      getDashboardStatsAction,
      {
        totalRevenue: 0,
        totalOrders: 0,
        activeUsers: 0,
        productsInStock: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        usersGrowth: 0,
        stockGrowth: 0,
      }
    ),
    safeDashboardAction('getRevenueDataAction', getRevenueDataAction, []),
    safeDashboardAction('getOrderStatusDataAction', getOrderStatusDataAction, []),
    safeDashboardAction('getTopProductsDataAction', getTopProductsDataAction, []),
    safeDashboardAction('getStockLevelsDataAction', getStockLevelsDataAction, []),
    safeDashboardAction('getRegionalSalesDataAction', getRegionalSalesDataAction, []),
    safeDashboardAction('getCategoryPerformanceDataAction', getCategoryPerformanceDataAction, []),
    safeDashboardAction('getRecentOrdersAction', getRecentOrdersAction, []),
    safeDashboardAction(
      'getQuickStatsAction',
      getQuickStatsAction,
      {
        revenueGrowth: 0,
        lowStockProducts: 0,
        fulfillmentRate: 0,
        activeCompanies: 0,
        averageOrderValue: 0,
        inventoryTurnover: 0,
      }
    ),
  ]);

  // Extract resolved values, using fallback if any promise was rejected
  const resolvedData = [
    dashboardStats,
    revenueData,
    orderStatusData,
    topProductsData,
    stockLevelsData,
    regionalSalesData,
    categoryPerformanceData,
    recentOrders,
    quickStats,
  ].map((result) => result.status === 'fulfilled' ? result.value : null);

  console.log('🎯 Dashboard data collection completed');
  console.log('📊 Data summary:', {
    dashboardStats: resolvedData[0] ? 'loaded' : 'failed',
    revenueData: Array.isArray(resolvedData[1]) ? `${resolvedData[1].length} items` : 'failed',
    orderStatusData: Array.isArray(resolvedData[2]) ? `${resolvedData[2].length} items` : 'failed',
    topProductsData: Array.isArray(resolvedData[3]) ? `${resolvedData[3].length} items` : 'failed',
    stockLevelsData: Array.isArray(resolvedData[4]) ? `${resolvedData[4].length} items` : 'failed',
    regionalSalesData: Array.isArray(resolvedData[5]) ? `${resolvedData[5].length} items` : 'failed',
    categoryPerformanceData: Array.isArray(resolvedData[6]) ? `${resolvedData[6].length} items` : 'failed',
    recentOrders: Array.isArray(resolvedData[7]) ? `${resolvedData[7].length} items` : 'failed',
    quickStats: resolvedData[8] ? 'loaded' : 'failed',
  });
  
  return (
    <DashboardCharts
      dashboardStats={resolvedData[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        activeUsers: 0,
        productsInStock: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        usersGrowth: 0,
        stockGrowth: 0,
      }}
      revenueData={resolvedData[1] || []}
      orderStatusData={resolvedData[2] || []}
      topProductsData={resolvedData[3] || []}
      stockLevelsData={resolvedData[4] || []}
      regionalSalesData={resolvedData[5] || []}
      categoryPerformanceData={resolvedData[6] || []}
      recentOrders={resolvedData[7] || []}
      quickStats={resolvedData[8] || {
        revenueGrowth: 0,
        lowStockProducts: 0,
        fulfillmentRate: 0,
        activeCompanies: 0,
        averageOrderValue: 0,
        inventoryTurnover: 0,
      }}
    />
  );
}
