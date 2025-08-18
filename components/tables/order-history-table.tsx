"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Eye,
  Truck,
  User,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  User2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface Order {
  id: string;
  userId: string;
  user: {
    name?: string;
    email?: string;
    phone?: string;
  };
  chauffeur?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  camion?: {
    name?: string;
    email?: string;
    plate?: string;
  };
  OrderItems?: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  note?: string;
  cancelReason?: string;
  chauffeurId: string;
  camionId: string;
  camionPlate: string;
  itemsCount: number;
  deliveryDate?: string;
}

interface Chauffeur {
  id: string;
  name: string;
}

interface Camion {
  id: string;
  name: string;
  plate: string;
}

interface OrderHistoryTableProps {
  initialData: {
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
  chauffeurs: Chauffeur[];
  camions: Camion[];
  initialPage: number;
  initialSearch: string;
  initialStatus: string;
  initialChauffeurId: string;
  initialCamionId: string;
  initialDateFrom: string;
  initialDateTo: string;
}

export default function OrderHistoryTable({
  initialData,
  chauffeurs,
  camions,
  initialPage,
  initialSearch,
  initialStatus,
  initialChauffeurId,
  initialCamionId,
  initialDateFrom,
  initialDateTo,
}: OrderHistoryTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Translation hooks
  const tCommon = useTranslations("common");
  const tOrders = useTranslations("orders");
  const tOrderHistory = useTranslations("orderHistory");
  const tOrderHistoryTable = useTranslations("orderHistoryTable");

  // Data state
  const [ordersData, setOrdersData] = useState(initialData);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [selectedDriver, setSelectedDriver] = useState(initialChauffeurId);
  const [selectedTruck, setSelectedTruck] = useState(initialCamionId);
  const [dateFromFilter, setDateFromFilter] = useState(initialDateFrom);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Update URL with new filters
  const updateURL = (params: {
    page?: number;
    search?: string;
    status?: string;
    chauffeurId?: string;
    camionId?: string;
    dateFrom?: string;
  }) => {
    const newSearchParams = new URLSearchParams();
    if (params.page && params.page > 1)
      newSearchParams.set("page", params.page.toString());
    if (params.search) newSearchParams.set("search", params.search);
    if (params.status) newSearchParams.set("status", params.status);
    if (params.chauffeurId)
      newSearchParams.set("chauffeurId", params.chauffeurId);
    if (params.camionId) newSearchParams.set("camionId", params.camionId);
    if (params.dateFrom) newSearchParams.set("dateFrom", params.dateFrom);
    const newUrl = `${pathname}${
      newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
    }`;
    startTransition(() => {
      router.push(newUrl);
    });
  };

  // Helper: Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSelectedDriver("");
    setSelectedTruck("");
    setDateFromFilter("");
    setCurrentPage(1);
    applyFilters(1, "", "", "", "", "");
  };

  // Helper: Apply filters (update URL)
  const applyFilters = (
    page = 1,
    search = searchTerm,
    status = statusFilter,
    chauffeurId = selectedDriver,
    camionId = selectedTruck,
    dateFrom = dateFromFilter
  ) => {
    updateURL({
      page,
      search,
      status,
      chauffeurId: chauffeurId === "all" ? undefined : chauffeurId,
      camionId: camionId === "all" ? undefined : camionId,
      dateFrom,
    });
  };

  // Helper: Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    applyFilters(page);
  };

  // Helper: Status color (must match Badge variants)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "RETURNED":
        return "secondary";
      case "CANCELED":
        return "destructive";
      case "SHIPPING":
        return "default";
      default:
        return "secondary";
    }
  };

  // Helper: Pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    for (let i = 1; i <= ordersData.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Render
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">
            View historical orders by driver, truck, or both
          </p>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={resetFilters}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
          <Button variant="default" onClick={() => applyFilters(1)}>
            Apply
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter order history by driver, truck, status, or date
          </CardDescription>
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
                  {chauffeurs.map((driver) => (
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
                  {camions.map((truck) => (
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
              <Input
                id="date-filter"
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />
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
      {/* {(driverStats || truckStats) && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {driverStats && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Driver Orders
                  </CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {driverStats.totalOrders}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {driverStats.completedOrders} completed
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Driver Revenue
                  </CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${driverStats.totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total handled</p>
                </CardContent>
              </Card>
            </>
          )}
          {truckStats && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Truck Orders
                  </CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {truckStats.totalOrders}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {truckStats.completedOrders} completed
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Truck Revenue
                  </CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${truckStats.totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total transported
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )} */}
      {/* Order History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order History ({ordersData.total} orders)</CardTitle>
          <CardDescription>
            Historical order data with driver and truck assignments
          </CardDescription>
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
                {ordersData.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/orders?id=${order.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        #{order.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {" "}
                      <div className="flex items-center gap-2">
                        <User2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {order.user?.name ?? "User Not Found"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.user?.email ?? "N/A"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {order.chauffeur?.name ?? "No Driver Assigned"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.chauffeur?.phone ?? "N/A"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {order.camion?.name ?? "No Truck Assigned"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.camion?.plate ?? "N/A"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.total.toFixed(2)} DZD</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.OrderItems?.length || 0} items</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</div>
                        {order.deliveryDate && (
                          <div className="text-xs text-muted-foreground">
                            Delivered: {new Date(order.deliveryDate).toLocaleDateString("fr-FR")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {ordersData.page} of {ordersData.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={ordersData.page === 1}
                onClick={() => handlePageChange(ordersData.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {generatePaginationNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={ordersData.page === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                disabled={ordersData.page === ordersData.totalPages}
                onClick={() => handlePageChange(ordersData.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Order Details Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details - {viewingOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete order information and delivery details
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Order Information</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span>{viewingOrder!.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span>{viewingOrder!.total.toFixed(2)} DZD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={getStatusColor(viewingOrder!.status)}>
                        {viewingOrder!.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{viewingOrder!.itemsCount}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Delivery Information</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Driver:</span>
                      <span>
                        {viewingOrder!.chauffeur?.name ?? "No Driver Assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Truck:</span>
                      <span>
                        {viewingOrder!.camion?.name ?? "No Truck Assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plate:</span>
                      <span>{viewingOrder!.camion?.plate ?? "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Delivery Date:
                      </span>
                      <span>{viewingOrder!.deliveryDate || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Timeline</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Order Created:
                    </span>
                    <span>{viewingOrder!.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{viewingOrder!.updatedAt}</span>
                  </div>
                </div>
              </div>
              {viewingOrder!.note && (
                <div className="space-y-2">
                  <h4 className="font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {viewingOrder!.note}
                  </p>
                </div>
              )}
              {viewingOrder!.cancelReason && (
                <div className="space-y-2">
                  <h4 className="font-medium">Cancel Reason</h4>
                  <p className="text-sm text-red-600">
                    {viewingOrder!.cancelReason}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
