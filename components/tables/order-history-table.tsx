"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Truck, User, RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data based on the new schema
const mockDrivers = [
  { id: "chauffeur1", name: "Ahmed Benali", phone: "0555123456", companyId: "comp1" },
  { id: "chauffeur2", name: "Mohamed Kaci", phone: "0666789012", companyId: "comp2" },
  { id: "chauffeur3", name: "Karim Ouali", phone: "0777345678", companyId: "comp1" },
  { id: "chauffeur4", name: "Yacine Brahim", phone: "0888901234", companyId: "comp3" },
]

const mockTrucks = [
  { id: "camion1", name: "Truck Alpha", plate: "16-123-45", companyId: "comp1" },
  { id: "camion2", name: "Truck Beta", plate: "31-678-90", companyId: "comp2" },
  { id: "camion3", name: "Truck Gamma", plate: "16-234-56", companyId: "comp1" },
  { id: "camion4", name: "Truck Delta", plate: "25-789-01", companyId: "comp3" },
]

const mockOrderHistory = [
  {
    id: "ORD-2024-001",
    userId: "user1",
    userEmail: "john@example.com",
    total: 1250.75,
    status: "COMPLETED",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
    note: "Urgent delivery requested",
    chauffeurId: "chauffeur1",
    chauffeurName: "Ahmed Benali",
    camionId: "camion1",
    camionName: "Truck Alpha",
    camionPlate: "16-123-45",
    itemsCount: 5,
    deliveryDate: "2024-01-18",
  },
  {
    id: "ORD-2024-002",
    userId: "user2",
    userEmail: "jane@example.com",
    total: 890.5,
    status: "COMPLETED",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-22",
    note: "Standard delivery",
    chauffeurId: "chauffeur2",
    chauffeurName: "Mohamed Kaci",
    camionId: "camion2",
    camionName: "Truck Beta",
    camionPlate: "31-678-90",
    itemsCount: 3,
    deliveryDate: "2024-01-22",
  },
  {
    id: "ORD-2024-003",
    userId: "user3",
    userEmail: "bob@example.com",
    total: 2150.25,
    status: "COMPLETED",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-03",
    note: "Fragile items - handle with care",
    chauffeurId: "chauffeur1",
    chauffeurName: "Ahmed Benali",
    camionId: "camion3",
    camionName: "Truck Gamma",
    camionPlate: "16-234-56",
    itemsCount: 8,
    deliveryDate: "2024-02-03",
  },
  {
    id: "ORD-2024-004",
    userId: "user4",
    userEmail: "alice@example.com",
    total: 675.8,
    status: "RETURNED",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-15",
    note: "Customer requested return",
    cancelReason: "Product quality issues",
    chauffeurId: "chauffeur3",
    chauffeurName: "Karim Ouali",
    camionId: "camion1",
    camionName: "Truck Alpha",
    camionPlate: "16-123-45",
    itemsCount: 2,
    deliveryDate: "2024-02-12",
  },
  {
    id: "ORD-2024-005",
    userId: "user1",
    userEmail: "john@example.com",
    total: 1890.4,
    status: "COMPLETED",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-22",
    note: "Bulk order",
    chauffeurId: "chauffeur4",
    chauffeurName: "Yacine Brahim",
    camionId: "camion4",
    camionName: "Truck Delta",
    camionPlate: "25-789-01",
    itemsCount: 12,
    deliveryDate: "2024-02-22",
  },
  {
    id: "ORD-2024-006",
    userId: "user2",
    userEmail: "jane@example.com",
    total: 445.6,
    status: "COMPLETED",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-03",
    note: "Express delivery",
    chauffeurId: "chauffeur2",
    chauffeurName: "Mohamed Kaci",
    camionId: "camion2",
    camionName: "Truck Beta",
    camionPlate: "31-678-90",
    itemsCount: 4,
    deliveryDate: "2024-03-03",
  },
]

export default function OrderHistoryTable() {
  const [orders, setOrders] = useState(mockOrderHistory)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDriver, setSelectedDriver] = useState<string>("all")
  const [selectedTruck, setSelectedTruck] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [viewingOrder, setViewingOrder] = useState<any>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.chauffeurName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.camionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.camionPlate.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDriver = selectedDriver === "all" || order.chauffeurId === selectedDriver
    const matchesTruck = selectedTruck === "all" || order.camionId === selectedTruck
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesDate = !dateFilter || order.createdAt.includes(dateFilter)

    return matchesSearch && matchesDriver && matchesTruck && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default"
      case "RETURNED":
        return "destructive"
      case "CANCELED":
        return "destructive"
      case "SHIPPING":
        return "outline"
      default:
        return "secondary"
    }
  }

  const resetFilters = () => {
    setSelectedDriver("all")
    setSelectedTruck("all")
    setStatusFilter("all")
    setDateFilter("")
    setSearchTerm("")
  }

  const getDriverStats = () => {
    if (selectedDriver === "all") return null
    const driverOrders = orders.filter((order) => order.chauffeurId === selectedDriver)
    const completedOrders = driverOrders.filter((order) => order.status === "COMPLETED").length
    const totalRevenue = driverOrders.reduce((sum, order) => sum + order.total, 0)
    return { totalOrders: driverOrders.length, completedOrders, totalRevenue }
  }

  const getTruckStats = () => {
    if (selectedTruck === "all") return null
    const truckOrders = orders.filter((order) => order.camionId === selectedTruck)
    const completedOrders = truckOrders.filter((order) => order.status === "COMPLETED").length
    const totalRevenue = truckOrders.reduce((sum, order) => sum + order.total, 0)
    return { totalOrders: truckOrders.length, completedOrders, totalRevenue }
  }

  const driverStats = getDriverStats()
  const truckStats = getTruckStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">View historical orders by driver, truck, or both</p>
        </div>
        <Button variant="outline" onClick={resetFilters}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter order history by driver, truck, status, or date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="driver-select">Driver</Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {mockDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="truck-select">Truck</Label>
              <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                <SelectTrigger>
                  <SelectValue placeholder="Select truck" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trucks</SelectItem>
                  {mockTrucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>
                      {truck.name} ({truck.plate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-select">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="RETURNED">Returned</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                  <SelectItem value="SHIPPING">Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-filter">Date</Label>
              <Input id="date-filter" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {(driverStats || truckStats) && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {driverStats && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Driver Orders</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{driverStats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">{driverStats.completedOrders} completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Driver Revenue</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${driverStats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total handled</p>
                </CardContent>
              </Card>
            </>
          )}
          {truckStats && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Truck Orders</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{truckStats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">{truckStats.completedOrders} completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Truck Revenue</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${truckStats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total transported</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Order History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order History ({filteredOrders.length} orders)</CardTitle>
          <CardDescription>Historical order data with driver and truck assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Truck</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.userEmail}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{order.chauffeurName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{order.camionName}</div>
                          <div className="text-xs text-muted-foreground">{order.camionPlate}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>{order.itemsCount} items</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.createdAt}</div>
                        {order.deliveryDate && (
                          <div className="text-xs text-muted-foreground">Delivered: {order.deliveryDate}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setViewingOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details - {viewingOrder?.id}</DialogTitle>
            <DialogDescription>Complete order information and delivery details</DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Order Information</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span>{viewingOrder.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span>${viewingOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={getStatusColor(viewingOrder.status)}>{viewingOrder.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{viewingOrder.itemsCount}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Delivery Information</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Driver:</span>
                      <span>{viewingOrder.chauffeurName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Truck:</span>
                      <span>{viewingOrder.camionName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plate:</span>
                      <span>{viewingOrder.camionPlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Date:</span>
                      <span>{viewingOrder.deliveryDate || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Timeline</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Created:</span>
                    <span>{viewingOrder.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{viewingOrder.updatedAt}</span>
                  </div>
                </div>
              </div>
              {viewingOrder.note && (
                <div className="space-y-2">
                  <h4 className="font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground">{viewingOrder.note}</p>
                </div>
              )}
              {viewingOrder.cancelReason && (
                <div className="space-y-2">
                  <h4 className="font-medium">Cancel Reason</h4>
                  <p className="text-sm text-red-600">{viewingOrder.cancelReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
