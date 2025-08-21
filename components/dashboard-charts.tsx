"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import { useResponsive } from "@/hooks/use-responsive";
import EmptyState from "@/components/empty-state";
import {
  Building2,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Layers,
  ClipboardList,
  Monitor,
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DashboardChartsProps {
  isLoading?: boolean;
  dashboardStats: {
    totalRevenue: number;
    totalOrders: number;
    activeUsers: number;
    productsInStock: number;
    revenueGrowth: number;
    ordersGrowth: number;
    usersGrowth: number;
    stockGrowth: number;
  };
  revenueData: Array<{
    month: string;
    revenue: number;
    orders: number;
    users: number;
  }>;
  orderStatusData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topProductsData: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  stockLevelsData: Array<{
    month: string;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  }>;
  regionalSalesData: Array<{
    region: string;
    sales: number;
    orders: number;
  }>;
  categoryPerformanceData: Array<{
    category: string;
    sales: number;
    growth: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    status: string;
    amount: string;
  }>;
  quickStats: {
    revenueGrowth: number;
    lowStockProducts: number;
    fulfillmentRate: number;
    activeCompanies: number;
    averageOrderValue: number;
    inventoryTurnover: number;
  };
}

export default function DashboardCharts({
  isLoading = false,
  dashboardStats,
  revenueData,
  orderStatusData,
  topProductsData,
  stockLevelsData,
  regionalSalesData,
  categoryPerformanceData,
  recentOrders,
  quickStats,
}: DashboardChartsProps) {
  console.log("DashboardCharts loaded");
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="px-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-sm md:text-base text-muted-foreground">{t('description')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="min-h-[120px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium truncate">{t('totalRevenue')}</CardTitle>
            <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 md:h-8 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="text-lg md:text-2xl font-bold">{dashboardStats.totalRevenue.toLocaleString('en-US')} DZD</div>
                <p className="text-xs text-muted-foreground">+{dashboardStats.revenueGrowth}% {t('fromLastMonth')}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="min-h-[120px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium truncate">{t('totalOrders')}</CardTitle>
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 md:h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="text-lg md:text-2xl font-bold">{dashboardStats.totalOrders.toLocaleString('en-US')}</div>
                <p className="text-xs text-muted-foreground">+{dashboardStats.ordersGrowth}% {t('fromLastMonth')}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="min-h-[120px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium truncate">{t('activeUsers')}</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 md:h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="text-lg md:text-2xl font-bold">{dashboardStats.activeUsers.toLocaleString('en-US')}</div>
                <p className="text-xs text-muted-foreground">+{dashboardStats.usersGrowth}% {t('fromLastMonth')}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="min-h-[120px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium truncate">{t('productsInStock')}</CardTitle>
            <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 md:h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <div className="text-lg md:text-2xl font-bold">{dashboardStats.productsInStock.toLocaleString('en-US')}</div>
                <p className="text-xs text-muted-foreground">+{dashboardStats.stockGrowth}% {t('fromLastMonth')}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      {!isMobile ? (
        <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Revenue Trend */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">{t('revenueTrend')}</CardTitle>
              <CardDescription className="text-sm">{t('revenueTrendDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
            {isLoading ? (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center">
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-[200px] md:h-[250px] w-full" />
                </div>
              </div>
            ) : revenueData && revenueData.length > 0 ? (
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  orders: {
                    label: "Orders",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[250px] md:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={revenueData}
                    margin={{ 
                      top: 5, 
                      right: isMobile ? 15 : 30, 
                      left: isMobile ? 10 : 20, 
                      bottom: isMobile ? 40 : 5 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      interval="preserveStartEnd"
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 60 : 30}
                    />
                    <YAxis 
                      yAxisId="left" 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      width={isMobile ? 40 : 60}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      width={isMobile ? 40 : 60}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend 
                      wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={isMobile ? 1.5 : 2}
                      name="Revenue (DA)"
                      dot={{ r: isMobile ? 3 : 4 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={isMobile ? 1.5 : 2}
                      name="Orders"
                      dot={{ r: isMobile ? 3 : 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <EmptyState
                title={t('emptyState.noRevenueData')}
                description={t('emptyState.tryAgain')}
                icon={<TrendingUp className="h-8 w-8 text-muted-foreground" />}
                className="h-[250px] md:h-[300px]"
              />
            )}
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">{t('orderStatus')}</CardTitle>
            <CardDescription className="text-sm">{t('orderStatusDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center">
                <div className="w-full space-y-3">
                  <div className="flex justify-center">
                    <Skeleton className="h-32 w-32 rounded-full" />
                  </div>
                  <div className="flex justify-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ) : orderStatusData && orderStatusData.length > 0 ? (
              <ChartContainer
                config={{
                  completed: { label: "Completed", color: "#22c55e" },
                  pending: { label: "Pending", color: "#f59e0b" },
                  shipping: { label: "Shipping", color: "#3b82f6" },
                  cancelled: { label: "Cancelled", color: "#ef4444" },
                }}
                className="h-[250px] md:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 30 : 40}
                      outerRadius={isMobile ? 60 : 80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend 
                      wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <EmptyState
                title={t('emptyState.noOrderData')}
                description={t('emptyState.tryAgain')}
                icon={<PieChartIcon className="h-8 w-8 text-muted-foreground" />}
                className="h-[250px] md:h-[300px]"
              />
            )}
          </CardContent>
        </Card>
      </div>
      ) : null}

      {/* Charts Row 2 */}
      {!isMobile ? (
      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">{t('topProductsTitle')}</CardTitle>
            <CardDescription className="text-sm">{t('topProductsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center">
                <div className="w-full space-y-3">
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : topProductsData && topProductsData.length > 0 ? (
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[250px] md:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={topProductsData} 
                    layout="horizontal"
                    margin={{ 
                      top: 5, 
                      right: isMobile ? 15 : 30, 
                      left: isMobile ? 10 : 20, 
                      bottom: 5 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: isMobile ? 10 : 11 }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={isMobile ? 80 : 100}
                      tick={{ fontSize: isMobile ? 9 : 11 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="sales" 
                      fill="hsl(var(--chart-1))"
                      radius={[0, isMobile ? 2 : 4, isMobile ? 2 : 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <EmptyState
                title={t('emptyState.noProductData')}
                description={t('emptyState.tryAgain')}
                icon={<BarChart3 className="h-8 w-8 text-muted-foreground" />}
                className="h-[250px] md:h-[300px]"
              />
            )}
          </CardContent>
        </Card>

        {/* Regional Sales */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">{t('regionalSales')}</CardTitle>
            <CardDescription className="text-sm">{t('regionalSalesDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center">
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-end gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton className={`w-8 h-${20 + i * 10}`} />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : regionalSalesData && regionalSalesData.length > 0 ? (
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[250px] md:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={regionalSalesData}
                    margin={{ 
                      top: 5, 
                      right: isMobile ? 15 : 30, 
                      left: isMobile ? 10 : 20, 
                      bottom: isMobile ? 60 : 40 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="region" 
                      tick={{ fontSize: isMobile ? 10 : 11 }}
                      interval={0}
                      angle={isMobile ? -45 : -25}
                      textAnchor="end"
                      height={isMobile ? 60 : 40}
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 10 : 11 }}
                      width={isMobile ? 40 : 60}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="sales" 
                      fill="hsl(var(--chart-2))"
                      radius={[isMobile ? 2 : 4, isMobile ? 2 : 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <EmptyState
                title={t('emptyState.noRegionalData')}
                description={t('emptyState.tryAgain')}
                icon={<MapPin className="h-8 w-8 text-muted-foreground" />}
                className="h-[250px] md:h-[300px]"
              />
            )}
          </CardContent>
        </Card>
      </div>
      ) : null}

      {/* Charts Row 3 */}
      {!isMobile ? (
      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        {/* Stock Levels */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">{t('stockLevelsTitle')}</CardTitle>
            <CardDescription className="text-sm">{t('stockLevelsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center">
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-[200px] md:h-[250px] w-full" />
                </div>
              </div>
            ) : stockLevelsData && stockLevelsData.length > 0 ? (
              <ChartContainer
                config={{
                  inStock: {
                    label: "In Stock",
                    color: "hsl(var(--chart-1))",
                  },
                  lowStock: {
                    label: "Low Stock",
                    color: "hsl(var(--chart-3))",
                  },
                  outOfStock: {
                    label: "Out of Stock",
                    color: "hsl(var(--chart-5))",
                  },
                }}
                className="h-[250px] md:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={stockLevelsData}
                    margin={{ 
                      top: 5, 
                      right: isMobile ? 15 : 30, 
                      left: isMobile ? 10 : 20, 
                      bottom: isMobile ? 40 : 5 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: isMobile ? 10 : 11 }}
                      interval="preserveStartEnd"
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 60 : 30}
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 10 : 11 }}
                      width={isMobile ? 40 : 60}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend 
                      wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="inStock"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      name="In Stock"
                      strokeWidth={isMobile ? 1 : 2}
                    />
                    <Area
                      type="monotone"
                      dataKey="lowStock"
                      stackId="1"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      name="Low Stock"
                      strokeWidth={isMobile ? 1 : 2}
                    />
                    <Area
                      type="monotone"
                      dataKey="outOfStock"
                      stackId="1"
                      stroke="hsl(var(--chart-5))"
                      fill="hsl(var(--chart-5))"
                      name="Out of Stock"
                      strokeWidth={isMobile ? 1 : 2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <EmptyState
                title={t('emptyState.noStockData')}
                description={t('emptyState.tryAgain')}
                icon={<Warehouse className="h-8 w-8 text-muted-foreground" />}
                className="h-[250px] md:h-[300px]"
              />
            )}
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">{t('userGrowth')}</CardTitle>
            <CardDescription className="text-sm">{t('userGrowthDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[250px] md:h-[300px] flex items-center justify-center">
                <div className="w-full space-y-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-[200px] md:h-[250px] w-full" />
                </div>
              </div>
            ) : revenueData && revenueData.length > 0 ? (
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[250px] md:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={revenueData}
                    margin={{ 
                      top: 5, 
                      right: isMobile ? 15 : 30, 
                      left: isMobile ? 10 : 20, 
                      bottom: isMobile ? 40 : 5 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: isMobile ? 10 : 11 }}
                      interval="preserveStartEnd"
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 60 : 30}
                    />
                    <YAxis 
                      tick={{ fontSize: isMobile ? 10 : 11 }}
                      width={isMobile ? 40 : 60}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--chart-4))"
                      fill="hsl(var(--chart-4))"
                      fillOpacity={0.6}
                      strokeWidth={isMobile ? 1.5 : 2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <EmptyState
                title={t('emptyState.noData')}
                description={t('emptyState.tryAgain')}
                icon={<Users className="h-8 w-8 text-muted-foreground" />}
                className="h-[250px] md:h-[300px]"
              />
            )}
          </CardContent>
        </Card>
      </div>
      ) : null}

      {/* Recent Activity and Quick Stats */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">{t('recentOrders')}</CardTitle>
            <CardDescription className="text-sm">{t('recentOrdersDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3 md:space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1 min-w-0 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none truncate">{order.id}</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{order.customer}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant={
                          order.status === "COMPLETED"
                            ? "default"
                            : order.status === "PENDING"
                              ? "secondary"
                              : order.status === "SHIPPING"
                                ? "outline"
                                : "default"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                      <span className="font-medium text-sm">{order.amount} DA</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title={t('emptyState.noRecentOrders')}
                description={t('emptyState.tryAgain')}
                icon={<ClipboardList className="h-8 w-8 text-muted-foreground" />}
                className="h-[200px]"
              />
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">{t('quickStats')}</CardTitle>
            <CardDescription className="text-sm">{t('quickStatsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {isLoading ? (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    <Skeleton className="h-3 md:h-4 flex-1" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{t('revenueUp')} {quickStats.revenueGrowth}% {t('thisMonth')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-yellow-600 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{quickStats.lowStockProducts} {t('productsLowStock')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{quickStats.fulfillmentRate}% {t('orderFulfillmentRate')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-3 w-3 md:h-4 md:w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{quickStats.activeCompanies} {t('activeCompanies')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-3 w-3 md:h-4 md:w-4 text-purple-600 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{t('averageOrderValue')}: {quickStats.averageOrderValue} DA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Warehouse className="h-3 w-3 md:h-4 md:w-4 text-orange-600 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{t('inventoryTurnover')}: {quickStats.inventoryTurnover}x</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">{t('categoryPerformance')}</CardTitle>
          <CardDescription className="text-sm">{t('categoryPerformanceDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3 md:space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                  <div className="space-y-1 min-w-0 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : categoryPerformanceData && categoryPerformanceData.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {categoryPerformanceData.map((category) => (
                <div key={category.category} className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{category.category}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {category.sales.toLocaleString('en-US')} DA in sales
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={category.growth > 0 ? "default" : "destructive"} className="text-xs">
                      {category.growth > 0 ? "+" : ""}
                      {category.growth}%
                    </Badge>
                    {category.growth > 0 ? (
                      <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('emptyState.noCategoryData')}
              description={t('emptyState.tryAgain')}
              icon={<Layers className="h-8 w-8 text-muted-foreground" />}
              className="h-[200px]"
            />
          )}
        </CardContent>
      </Card>

      {/* Mobile Notice */}
      {isMobile && (
        <Card className="border-dashed border-muted-foreground/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-3 rounded-full bg-muted/50">
                <Monitor className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">
                  {t('mobile.chartsNotAvailable')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('mobile.viewOnPC')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
