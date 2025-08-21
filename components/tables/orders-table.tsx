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
  const tOrdersTable = useTranslations("ordersTable");
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
        setSuccess(tOrdersTable("orderDeletedSuccess"));
      } else {
        setError(result.message || tOrdersTable("failedToDeleteOrder"));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setError(tOrdersTable("toasts.orderDeletedUnexpectedError"));
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
        setSuccess(tOrdersTable("documentPrintedSuccess"));
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || tOrdersTable("failedToFetchPdf"));
      }
    } catch (error) {
      console.error("Error printing document:", error);
      setError(tOrdersTable("unexpectedPrintError"));
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
        setSuccess(tOrdersTable("orderAcceptedSuccess"));
        setEditingOrder(null);
      } else {
        setError(result.message || tOrdersTable("failedToAcceptOrder"));
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      setError(tOrdersTable("toasts.orderAcceptedUnexpectedError"));
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
        setSuccess(tOrdersTable("orderRejectedSuccess"));
        setEditingOrder(null);
        setCancelReason("");
      } else {
        setError(result.message || tOrdersTable("failedToRejectOrder"));
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      setError(tOrdersTable("toasts.orderRejectedUnexpectedError"));
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
          <h1 className="text-3xl font-bold tracking-tight">{tOrdersTable("ordersTitle")}</h1>
          <p className="text-muted-foreground">
            {tOrdersTable("manageCustomerOrders")}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tOrders("title")}</CardTitle>
          <CardDescription>
            {tOrdersTable("ordersDescription")}
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                disabled={isUpdating || isSearching}
                placeholder={tOrdersTable("searchOrders")}
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
                {isSearching ? tOrdersTable("searching") : tOrdersTable("search")}
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
                    <span>{tOrdersTable("filter")}</span>
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
                      <h4 className="font-medium">{tOrdersTable("status")}</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">{tOrdersTable("allStatuses")}</option>
                        <option value="PENDING">{tOrdersTable("pending")}</option>
                        <option value="ACCEPTED">{tOrdersTable("accepted")}</option>
                        <option value="REJECTED">{tOrdersTable("rejected")}</option>
                        <option value="SHIPPING">{tOrdersTable("shipping")}</option>
                        <option value="COMPLETED">{tOrdersTable("completed")}</option>
                        <option value="CANCELED">{tOrdersTable("canceled")}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">{tOrdersTable("customer")}</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                      >
                        <option value="">{tOrdersTable("allCustomers")}</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">{tOrdersTable("dateRange")}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">
                            {tOrdersTable("from")}
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
                            {tOrdersTable("to")}
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
                        {tOrdersTable("resetFilters")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSearch}
                        disabled={isSearching}
                      >
                        {isSearching ? tOrdersTable("applying") : tOrdersTable("applyFilters")}
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
                <option value={5}>5 {tOrdersTable("perPage")}</option>
                <option value={10}>10 {tOrdersTable("perPage")}</option>
                <option value={20}>20 {tOrdersTable("perPage")}</option>
                <option value={50}>50 {tOrdersTable("perPage")}</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-b-transparent"></div>
              <span className="ml-2">{tOrdersTable("loadingOrders")}</span>
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
                          : tOrdersTable("noOrdersFound")
                      }
                      description={
                        searchTerm
                          ? tCommon("emptyState.tryDifferentSearch")
                          : tOrdersTable("ordersWillAppear")
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
                                tOrdersTable("unknownCompany")}
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
                                ?.raisonSocial || tOrdersTable("unknownCompany")}
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
                                    ? tOrdersTable("printing")
                                    : tOrdersTable("bonLivraison")}
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
                                    ? tOrdersTable("printing")
                                    : tOrdersTable("bonCommande")}
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
                                    ? tOrdersTable("printing")
                                    : tOrdersTable("bonRetour")}
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
                                    ? tOrdersTable("printing")
                                    : tOrdersTable("facture")}
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
                                    ? tOrdersTable("printing")
                                    : tOrdersTable("proformaInvoice")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={isDeleting === order.id}
                            >
                              {isDeleting === order.id ? (
                                tOrdersTable("deleting")
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
          {tOrdersTable("showing", { 
            from: Math.min((currentPage - 1) * limit + 1, total),
            to: Math.min(currentPage * limit, total),
            total: total
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isSearching}
          >
            <ChevronLeft className="h-4 w-4" />
            {tOrdersTable("previous")}
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
            {tOrdersTable("next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tOrdersTable("updateOrderStatus")}</DialogTitle>
            <DialogDescription>
              {tOrdersTable("acceptOrDenyOrder")}
            </DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label>{tOrdersTable("currentStatus")}</Label>
                <Badge variant={getStatusColor(editingOrder.status)}>
                  {editingOrder.status}
                </Badge>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cancel-reason">
                  {tOrdersTable("cancelReason")}
                </Label>
                <Input
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder={tOrdersTable("enterCancelReason")}
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
                  {isUpdating ? tOrdersTable("processing") : tOrdersTable("acceptOrder")}
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
                  {isUpdating ? tOrdersTable("processing") : tOrdersTable("denyOrder")}
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
              <span>{tOrdersTable("orderNumber", { id: viewingOrder?.id || "" })}</span>
            </DialogTitle>
            <DialogDescription>{tOrdersTable("orderDetailsDescription")}</DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="py-4">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">{tOrdersTable("details")}</TabsTrigger>
                  <TabsTrigger value="driver-and-truck">
                    {tOrdersTable("driverAndTruck")}
                  </TabsTrigger>
                  <TabsTrigger value="items">{tOrdersTable("items")}</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">{tOrdersTable("orderInformation")}</h3>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">{tCommon("status")}:</span>
                        <Badge variant={getStatusColor(viewingOrder.status)}>
                          {viewingOrder.status}
                        </Badge>
                        <span className="text-muted-foreground">{tOrdersTable("date")}:</span>
                        <span>
                          {viewingOrder.createdAt instanceof Date
                            ? viewingOrder.createdAt.toISOString().split("T")[0]
                            : new Date(viewingOrder.createdAt)
                                .toISOString()
                                .split("T")[0]}
                        </span>
                        <span className="text-muted-foreground">{tOrdersTable("total")}:</span>
                        <span>{viewingOrder.total.toFixed(2)} DA</span>
                        <span className="text-muted-foreground">{tOrdersTable("items")}:</span>
                        <span>{viewingOrder.OrderItems?.length || 0}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">{tOrdersTable("parties")}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex-1">
                          <p className="font-medium">
                            {viewingOrder.user?.name || "Unknown"}
                          </p>
                          <p className="text-muted-foreground">
                            {viewingOrder.user?.CompanyData?.raisonSocial ||
                              tOrdersTable("unknownCompany")}
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
                              .CompanyData?.raisonSocial || tOrdersTable("unknownCompany")}
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
                      <h3 className="font-medium">{tOrdersTable("driverInformation")}</h3>
                      <p className="text-sm">
                        {viewingOrder.chauffeur?.name || tOrdersTable("noDriverAssigned")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {viewingOrder.chauffeur?.phone || tOrdersTable("noPhoneNumber")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">{tOrdersTable("truckInformation")}</h3>
                      <p className="text-sm">
                        {viewingOrder.camion?.plate || tOrdersTable("noTruckAssigned")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {viewingOrder.camion?.name || tOrdersTable("noModelSpecified")}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="items" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{tOrdersTable("item")}</TableHead>
                        <TableHead>{tOrdersTable("quantity")}</TableHead>
                        <TableHead>{tOrdersTable("price")}</TableHead>
                        <TableHead>{tOrdersTable("total")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(viewingOrder.OrderItems || []).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.stock.product?.name || tOrdersTable("unknownProduct")}
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
                      <div className="text-sm text-muted-foreground">{tOrdersTable("note")}</div>
                      <div className="text-xl font-bold">
                        {viewingOrder.note || tOrdersTable("noNoteProvided")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {tOrdersTable("totalHT")}
                      </div>
                      <div className="text-xl font-bold">
                        {viewingOrder.total.toFixed(2)} DA
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex justify-${
                      viewingOrder.status === "REJECTED" ||
                      viewingOrder.status === "CANCELLED"
                        ? "between"
                        : "end"
                    } mt-4`}
                  >
                    {(viewingOrder.status === "REJECTED" ||
                      viewingOrder.status === "CANCELLED") && (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {tOrdersTable("cancelReasonLabel")}
                        </div>
                        <div className="text-xl font-bold">
                          {viewingOrder.cancelReason || tOrdersTable("noReasonProvided")}
                        </div>
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {tOrdersTable("totalTTC")}
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
