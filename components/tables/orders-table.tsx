"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import TableEmptyState from "@/components/table-empty-state";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Printer,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteOrderAction,
  acceptOrderAction,
  rejectOrderAction,
} from "@/lib/actions/orders";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  note?: string | null;
  cancelReason?: string | null;
  chauffeur?: {
    id: string;
    name?: string;
    phone?: string;
  };
  camion?: {
    id: string;
    plate?: string;
    name?: string;
  };
  user?: {
    id: string;
    email: string;
    name?: string;
    CompanyData?: {
      raisonSocial: string;
    };
  };
  OrderItems?: Array<{
    id: string;
    quantity: number;
    stock: {
      price: number;
      expirationDate: string;
      reductionPercent: number;
      owner: {
        id: string;
        email: string;
        name?: string;
        CompanyData?: {
          raisonSocial: string;
        };
      };
      product: {
        name: string;
        description: string;
        image: string;
      };
    };
  }>;
}

interface User {
  id: string;
  email: string;
  name?: string;
  company?: {
    raisonSocial: string;
  };
}

interface PaginationData {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function OrdersTable({
  ordersData,
  users,
  currentPage,
  limit,
}: {
  ordersData: PaginationData | Order[];
  users: User[];
  currentPage: number;
  limit: number;
}) {
  const tCommon = useTranslations("common");
  const tOrders = useTranslations("orders");
  const router = useRouter();
  const pathname = usePathname();

  // Handle both paginated and non-paginated data
  const orders = Array.isArray(ordersData) ? ordersData : ordersData.orders;
  const totalPages = Array.isArray(ordersData)
    ? Math.ceil(orders.length / limit)
    : ordersData.totalPages;
  const total = Array.isArray(ordersData) ? orders.length : ordersData.total;

  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");

  // Loading states
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [isPrinting, setIsPrinting] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Initialize filters from URL params
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setStatusFilter(searchParams.get("status") || "");
    setUserFilter(searchParams.get("userId") || "");
    setDateFromFilter(searchParams.get("dateFrom") || "");
    setDateToFilter(searchParams.get("dateTo") || "");
  }, [searchParams]);

  // Handle loading state when URL changes
  useEffect(() => {
    setIsSearching(false);
  }, [orders]);

  // Since we're using server-side pagination, we don't filter on client
  const filteredOrders = orders;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());

    // Preserve existing filters
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (statusFilter) params.set("status", statusFilter);
    if (userFilter) params.set("userId", userFilter);
    if (dateFromFilter) params.set("dateFrom", dateFromFilter);
    if (dateToFilter) params.set("dateTo", dateToFilter);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = () => {
    setIsSearching(true);
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());

    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (statusFilter) params.set("status", statusFilter);
    if (userFilter) params.set("userId", userFilter);
    if (dateFromFilter) params.set("dateFrom", dateFromFilter);
    if (dateToFilter) params.set("dateTo", dateToFilter);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setIsSearching(true);
    setSearchTerm("");
    setStatusFilter("");
    setUserFilter("");
    setDateFromFilter("");
    setDateToFilter("");

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "PENDING":
        return "secondary";
      case "ACCEPTED":
        return "outline";
      case "SHIPPING":
        return "outline";
      case "REJECTED":
        return "destructive";
      case "CANCELED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setIsDeleting(orderId);
    setError(null);
    setSuccess(null);

    try {
      const result = await deleteOrderAction(orderId);
      if (result.success) {
        setSuccess("Order deleted successfully!");
      } else {
        setError(result.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("An unexpected error occurred while deleting the order");
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePrintDocument = async (orderId: string, documentType: string) => {
    setIsPrinting(`${orderId}-${documentType}`);
    setError(null);

    try {
      const response = await fetch(
        `/api/orders/${orderId}/print/${documentType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.ok &&
        response.headers.get("content-type")?.includes("application/pdf")
      ) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
        setSuccess("Document printed successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to fetch PDF document");
      }
    } catch (error) {
      console.error("Error printing document:", error);
      setError("An unexpected error occurred while printing the document");
    } finally {
      setIsPrinting(null);
    }
  };

  const handlePrint = () => {
    if (!viewingOrder) return;
  };
  const handleAcceptOrder = async (editingOrderId: string) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await acceptOrderAction(editingOrderId);
      if (result.success) {
        setSuccess("Order accepted successfully!");
        setEditingOrder(null);
      } else {
        setError(result.message || "Failed to accept order");
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      setError("An unexpected error occurred while accepting the order");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRejectOrder = async (editingOrderId: string) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await rejectOrderAction(editingOrderId, cancelReason);
      if (result.success) {
        setSuccess("Order rejected successfully!");
        setEditingOrder(null);
        setCancelReason("");
      } else {
        setError(result.message || "Failed to reject order");
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      setError("An unexpected error occurred while rejecting the order");
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Error and Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage customer orders and their status
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tOrders("title")}</CardTitle>
          <CardDescription>
            {tOrders("description") || "A list of all customer orders"}
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                disabled={isUpdating || isSearching}
                placeholder={
                  tCommon("search") +
                  " " +
                  tOrders("title").toLowerCase() +
                  "..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="max-w-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    {(statusFilter ||
                      userFilter ||
                      dateFromFilter ||
                      dateToFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Status</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="SHIPPING">Shipping</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELED">Canceled</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Customer</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                      >
                        <option value="">All Customers</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Date Range</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">
                            From
                          </label>
                          <Input
                            disabled={isUpdating || isSearching}
                            type="date"
                            value={dateFromFilter}
                            onChange={(e) => setDateFromFilter(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">
                            To
                          </label>
                          <Input
                            disabled={isUpdating || isSearching}
                            type="date"
                            value={dateToFilter}
                            onChange={(e) => setDateToFilter(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        disabled={isSearching}
                      >
                        Reset Filters
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSearch}
                        disabled={isSearching}
                      >
                        {isSearching ? "Applying..." : "Apply Filters"}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={limit}
                onChange={(e) => {
                  const newLimit = parseInt(e.target.value);
                  const params = new URLSearchParams();
                  params.set("page", "1");
                  params.set("limit", newLimit.toString());

                  // Preserve existing filters
                  if (searchTerm.trim())
                    params.set("search", searchTerm.trim());
                  if (statusFilter) params.set("status", statusFilter);
                  if (userFilter) params.set("userId", userFilter);
                  if (dateFromFilter) params.set("dateFrom", dateFromFilter);
                  if (dateToFilter) params.set("dateTo", dateToFilter);

                  router.push(`${pathname}?${params.toString()}`);
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-b-transparent"></div>
              <span className="ml-2">Loading orders...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{tOrders("orderID") || "Order ID"}</TableHead>
                    <TableHead>{tOrders("from") || "From"}</TableHead>
                    <TableHead>{tOrders("to") || "To"}</TableHead>
                    <TableHead>{tOrders("totalHT") || "Total H.T"}</TableHead>
                    <TableHead>
                      {tOrders("totalTTC") || "Total T.T.C"}
                    </TableHead>
                    <TableHead>{tCommon("status")}</TableHead>
                    <TableHead>{tOrders("items") || "Items"}</TableHead>
                    <TableHead>
                      {tOrders("createdAt") || "Created At"}
                    </TableHead>
                    <TableHead>{tCommon("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableEmptyState
                      colSpan={8}
                      message={
                        searchTerm
                          ? tCommon("emptyState.noItemsFound")
                          : "No orders found"
                      }
                      description={
                        searchTerm
                          ? tCommon("emptyState.tryDifferentSearch")
                          : "Orders will appear here when customers place them"
                      }
                    />
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {order.user?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {order.user?.CompanyData?.raisonSocial ||
                                "Unknown Company"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {order.OrderItems?.at(0)?.stock.owner.name ||
                                "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {order.OrderItems?.at(0)?.stock.owner.CompanyData
                                ?.raisonSocial || "Unknown Company"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{order.total.toFixed(2)} DA</TableCell>
                        <TableCell>
                          {((order.total * 119) / 100).toFixed(2)} DA
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.OrderItems?.length || 0} items
                        </TableCell>
                        <TableCell>
                          {order.createdAt instanceof Date
                            ? order.createdAt.toISOString().split("T")[0]
                            : order.createdAt.split("T")[0]}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {order.status === "PENDING" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingOrder(order)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isPrinting?.startsWith(order.id)}
                                >
                                  <Printer className="h-4 w-4 mr-1" />
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePrintDocument(
                                      order.id,
                                      "bon-livraison"
                                    )
                                  }
                                  disabled={
                                    isPrinting === `${order.id}-bon-livraison`
                                  }
                                >
                                  {isPrinting === `${order.id}-bon-livraison`
                                    ? "Printing..."
                                    : "Bon de Livraison"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePrintDocument(
                                      order.id,
                                      "bon-commande"
                                    )
                                  }
                                  disabled={
                                    isPrinting === `${order.id}-bon-commande`
                                  }
                                >
                                  {isPrinting === `${order.id}-bon-commande`
                                    ? "Printing..."
                                    : "Bon de Commande"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePrintDocument(order.id, "bon-retour")
                                  }
                                  disabled={
                                    isPrinting === `${order.id}-bon-retour`
                                  }
                                >
                                  {isPrinting === `${order.id}-bon-retour`
                                    ? "Printing..."
                                    : "Bon de Retour"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePrintDocument(order.id, "facture")
                                  }
                                  disabled={
                                    isPrinting === `${order.id}-facture`
                                  }
                                >
                                  {isPrinting === `${order.id}-facture`
                                    ? "Printing..."
                                    : "Facture"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePrintDocument(order.id, "proforma")
                                  }
                                  disabled={
                                    isPrinting === `${order.id}-proforma`
                                  }
                                >
                                  {isPrinting === `${order.id}-proforma`
                                    ? "Printing..."
                                    : "Facture Proforma"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingOrder(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button> */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={isDeleting === order.id}
                            >
                              {isDeleting === order.id ? (
                                "Deleting..."
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * limit + 1, total)} to{" "}
          {Math.min(currentPage * limit, total)} of {total} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isSearching}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isSearching}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isSearching}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Edit Order Dialog
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update order information</DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <form action={handleUpdateOrder}>
              <input type="hidden" name="id" value={editingOrder.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-total">Total Amount</Label>
                  <Input
                    id="edit-total"
                    name="total"
                    type="number"
                    step="0.01"
                    defaultValue={editingOrder.total}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={editingOrder.status} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="SHIPPING">Shipping</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELED">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-shippingAddress">Shipping Address</Label>
                  <Input
                    id="edit-shippingAddress"
                    name="shippingAddress"
                    defaultValue={editingOrder.shippingAddress}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Order</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog> */}
      {/* Edit Order Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Accept or deny this order with a message
            </DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>Current Status</Label>
                <Badge variant={getStatusColor(editingOrder.status)}>
                  {editingOrder.status}
                </Badge>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cancel-reason">
                  Cancel Reason (required to deny)
                </Label>
                <Input
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for cancellation"
                  disabled={isUpdating}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => {
                    handleAcceptOrder(editingOrder.id);
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Processing..." : "Accept Order"}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    if (!cancelReason.trim()) return;
                    handleRejectOrder(editingOrder.id);
                  }}
                  disabled={isUpdating || !cancelReason.trim()}
                >
                  {isUpdating ? "Processing..." : "Deny Order"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* View Order Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="sm:max-w-[60vw]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Order #{viewingOrder?.id}</span>
            </DialogTitle>
            <DialogDescription>Order details</DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="py-4">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="driver-and-truck">
                    Driver and Truck
                  </TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Order Information</h3>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={getStatusColor(viewingOrder.status)}>
                          {viewingOrder.status}
                        </Badge>
                        <span className="text-muted-foreground">Date:</span>
                        <span>
                          {viewingOrder.createdAt instanceof Date
                            ? viewingOrder.createdAt.toISOString().split("T")[0]
                            : new Date(viewingOrder.createdAt)
                                .toISOString()
                                .split("T")[0]}
                        </span>
                        <span className="text-muted-foreground">Total:</span>
                        <span>{viewingOrder.total.toFixed(2)} DA</span>
                        <span className="text-muted-foreground">Items:</span>
                        <span>{viewingOrder.OrderItems?.length || 0}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Parties</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex-1">
                          <p className="font-medium">
                            {viewingOrder.user?.name || "Unknown"}
                          </p>
                          <p className="text-muted-foreground">
                            {viewingOrder.user?.CompanyData?.raisonSocial ||
                              "Unknown Company"}
                          </p>
                          <p className="text-muted-foreground">
                            {viewingOrder.user?.email}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium">
                            {viewingOrder.OrderItems?.at(0)?.stock.owner.name ||
                              "Unknown"}
                          </p>
                          <p className="text-muted-foreground">
                            {viewingOrder.OrderItems?.at(0)?.stock.owner
                              .CompanyData?.raisonSocial || "Unknown Company"}
                          </p>
                          <p className="text-muted-foreground">
                            {viewingOrder.OrderItems?.at(0)?.stock.owner.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="driver-and-truck" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Driver Information</h3>
                      <p className="text-sm">
                        {viewingOrder.chauffeur?.name || "No driver assigned"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {viewingOrder.chauffeur?.phone || "No phone number"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Truck Information</h3>
                      <p className="text-sm">
                        {viewingOrder.camion?.plate || "No truck assigned"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {viewingOrder.camion?.name || "No model specified"}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="items" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(viewingOrder.OrderItems || []).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.stock.product?.name || "Unknown Product"}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {item.stock.price.toFixed(2)} DA
                          </TableCell>
                          <TableCell>
                            {(item.quantity * item.stock.price).toFixed(2)} DA
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-between mt-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Note
                      </div>
                      <div className="text-xl font-bold">
                        {viewingOrder.note || "No note provided"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Total H.T
                      </div>
                      <div className="text-xl font-bold">
                        {viewingOrder.total.toFixed(2)} DA
                      </div>
                    </div>
                  </div>

                  <div className={`flex justify-${viewingOrder.status === "REJECTED" || viewingOrder.status === "CANCELLED" ? "between" : "end"} mt-4`}>
                    {(viewingOrder.status === "REJECTED" || viewingOrder.status === "CANCELLED") && <div>
                      <div className="text-sm text-muted-foreground">
                        Cancel reason
                      </div>
                      <div className="text-xl font-bold">
                        {viewingOrder.cancelReason || "No reason provided"}
                      </div>
                    </div>}
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">T.V.A</div>
                      <div className="text-xl font-bold">19%</div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Total T.T.C
                      </div>
                      <div className="text-xl font-bold">
                        {((viewingOrder.total * 119) / 100).toFixed(2)} DA
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
