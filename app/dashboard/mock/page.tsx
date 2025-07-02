"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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
} from "recharts"

// Mock data for charts
const revenueData = [
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
]

const orderStatusData = [
  { name: "Completed", value: 45, color: "#22c55e" },
  { name: "Pending", value: 25, color: "#f59e0b" },
  { name: "Shipping", value: 20, color: "#3b82f6" },
  { name: "Cancelled", value: 10, color: "#ef4444" },
]

const topProductsData = [
  { name: "Laptop Dell XPS", sales: 145, revenue: 289500 },
  { name: "iPhone 15 Pro", sales: 132, revenue: 131868 },
  { name: "Samsung 4K TV", sales: 98, revenue: 78402 },
  { name: "Wireless Headphones", sales: 87, revenue: 8699 },
  { name: "Gaming Mouse", sales: 76, revenue: 3800 },
  { name: "Mechanical Keyboard", sales: 65, revenue: 9750 },
]

const stockLevelsData = [
  { month: "Jan", inStock: 12500, lowStock: 450, outOfStock: 23 },
  { month: "Feb", inStock: 13200, lowStock: 380, outOfStock: 18 },
  { month: "Mar", inStock: 12800, lowStock: 420, outOfStock: 25 },
  { month: "Apr", inStock: 14100, lowStock: 350, outOfStock: 15 },
  { month: "May", inStock: 13900, lowStock: 390, outOfStock: 20 },
  { month: "Jun", inStock: 15200, lowStock: 320, outOfStock: 12 },
]

const regionalSalesData = [
  { region: "Alger", sales: 45000, orders: 180 },
  { region: "Oran", sales: 38000, orders: 152 },
  { region: "Constantine", sales: 32000, orders: 128 },
  { region: "Annaba", sales: 28000, orders: 112 },
  { region: "Blida", sales: 25000, orders: 100 },
  { region: "Setif", sales: 22000, orders: 88 },
]

const categoryPerformanceData = [
  { category: "Electronics", sales: 125000, growth: 15.2 },
  { category: "Clothing", sales: 89000, growth: 8.7 },
  { category: "Home & Garden", sales: 67000, growth: 12.3 },
  { category: "Sports", sales: 45000, growth: 6.8 },
  { category: "Books", sales: 32000, growth: -2.1 },
]

export default function DashboardPage() {
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
            <div className="text-2xl font-bold">$95,000</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,800</div>
            <p className="text-xs text-muted-foreground">+8.7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,200</div>
            <p className="text-xs text-muted-foreground">+3.2% from last month</p>
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
              {[
                { id: "ORD-001", customer: "John Doe", status: "COMPLETED", amount: "$234.50" },
                { id: "ORD-002", customer: "Jane Smith", status: "PENDING", amount: "$156.75" },
                { id: "ORD-003", customer: "Bob Johnson", status: "SHIPPING", amount: "$89.99" },
                { id: "ORD-004", customer: "Alice Brown", status: "ACCEPTED", amount: "$345.20" },
              ].map((order) => (
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
              <span className="text-sm">Revenue up 12% this month</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">23 products low in stock</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">98% order fulfillment rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm">45 active companies</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Average order value: $187</span>
            </div>
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Inventory turnover: 4.2x</span>
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
  )
}
