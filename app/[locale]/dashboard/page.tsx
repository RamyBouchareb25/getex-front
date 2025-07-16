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

export default async function DashboardPage() {
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
  ] = await Promise.all([
    getDashboardStatsAction(),
    getRevenueDataAction(),
    getOrderStatusDataAction(),
    getTopProductsDataAction(),
    getStockLevelsDataAction(),
    getRegionalSalesDataAction(),
    getCategoryPerformanceDataAction(),
    getRecentOrdersAction(),
    getQuickStatsAction(),
  ]);  
  
  return (
    <DashboardCharts
      dashboardStats={dashboardStats}
      revenueData={revenueData}
      orderStatusData={orderStatusData}
      topProductsData={topProductsData}
      stockLevelsData={stockLevelsData}
      regionalSalesData={regionalSalesData}
      categoryPerformanceData={categoryPerformanceData}
      recentOrders={recentOrders}
      quickStats={quickStats}
    />
  );
}
