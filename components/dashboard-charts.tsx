"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard. Here's an overview of your business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{dashboardStats.revenueGrowth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{dashboardStats.ordersGrowth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{dashboardStats.usersGrowth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.productsInStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{dashboardStats.stockGrowth}% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Trend */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and order trends</CardDescription>
          </CardHeader>
          <CardContent>
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
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="var(--color-orders)"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: { label: "Completed", color: "#22c55e" },
                pending: { label: "Pending", color: "#f59e0b" },
                shipping: { label: "Shipping", color: "#3b82f6" },
                cancelled: { label: "Cancelled", color: "#ef4444" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Regional Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Sales</CardTitle>
            <CardDescription>Sales performance by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Stock Levels */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels Overview</CardTitle>
            <CardDescription>Inventory levels over time</CardDescription>
          </CardHeader>
          <CardContent>
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
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockLevelsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="inStock"
                    stackId="1"
                    stroke="var(--color-inStock)"
                    fill="var(--color-inStock)"
                    name="In Stock"
                  />
                  <Area
                    type="monotone"
                    dataKey="lowStock"
                    stackId="1"
                    stroke="var(--color-lowStock)"
                    fill="var(--color-lowStock)"
                    name="Low Stock"
                  />
                  <Area
                    type="monotone"
                    dataKey="outOfStock"
                    stackId="1"
                    stroke="var(--color-outOfStock)"
                    fill="var(--color-outOfStock)"
                    name="Out of Stock"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: {
                  label: "Users",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-users)"
                    fill="var(--color-users)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="flex items-center gap-2">
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
                    >
                      {order.status}
                    </Badge>
                    <span className="font-medium">{order.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm">Revenue up {quickStats.revenueGrowth}% this month</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">{quickStats.lowStockProducts} products low in stock</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">{quickStats.fulfillmentRate}% order fulfillment rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{quickStats.activeCompanies} active companies</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Average order value: ${quickStats.averageOrderValue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Inventory turnover: {quickStats.inventoryTurnover}x</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Sales performance and growth by product category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryPerformanceData.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{category.category}</p>
                  <p className="text-sm text-muted-foreground">${category.sales.toLocaleString()} in sales</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={category.growth > 0 ? "default" : "destructive"}>
                    {category.growth > 0 ? "+" : ""}
                    {category.growth}%
                  </Badge>
                  {category.growth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
