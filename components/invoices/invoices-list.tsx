"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Printer,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getInvoicesAction } from "@/lib/actions/invoices";
import TableEmptyState from "@/components/table-empty-state";
import { Badge } from "@/components/ui/badge";
import SalamiLoadingAnimation from "../ui/salami-loading";

// Define OrderStatus enum to match the backend
enum OrderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
  PREPARING = "PREPARING",
  SHIPPING = "SHIPPING",
  COMPLETED = "COMPLETED",
  RETURNED = "RETURNED",
}

interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  note?: string | null;
  cancelReason?: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

interface InvoicesListProps {
  documentType: string;
  searchTerm?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface PaginatedResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export default function InvoicesList({
  documentType,
  searchTerm = "",
  status = "",
  startDate = "",
  endDate = "",
}: InvoicesListProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [data, setData] = useState<PaginatedResponse>({
    orders: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [documentType, searchTerm, status, startDate, endDate]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getInvoicesAction({
          page: currentPage,
          limit,
          search: searchTerm,
          documentType: documentType,
          status,
          startDate,
          endDate,
        });

        if (response.success) {
          setData({
            orders: response.orders,
            total: response.total,
            page: response.page,
            totalPages: response.totalPages,
          });
        } else {
          setData({
            orders: [],
            total: 0,
            page: 1,
            totalPages: 1,
          });
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setData({
          orders: [],
          total: 0,
          page: 1,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [
    documentType,
    searchTerm,
    status,
    startDate,
    endDate,
    currentPage,
    limit,
  ]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePreview = (orderId: string) => {
    const docType = documentType === "all" ? "bon-livraison" : documentType;
    if (docType === "facture-proforma") {
      router.push(`/dashboard/invoices/proforma/preview/${orderId}`);
      return;
    }
    router.push(`/dashboard/invoices/${docType}/preview/${orderId}`);
  };

  const handlePrint = async (orderId: string) => {
    try {
      const docType = documentType === "all" ? "bon-livraison" : documentType;
      if (docType === "facture-proforma") {
        window.open(`/api/orders/${orderId}/print/proforma`, "_blank");
        return;
      }
    } catch (error) {
      console.error("Error printing document:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "default" as const;
      case OrderStatus.PENDING:
        return "secondary" as const;
      case OrderStatus.ACCEPTED:
        return "outline" as const;
      case OrderStatus.REJECTED:
      case OrderStatus.CANCELED:
        return "destructive" as const;
      case OrderStatus.SHIPPING:
      case OrderStatus.PREPARING:
        return "default" as const;
      case OrderStatus.RETURNED:
        return "secondary" as const;
      default:
        return "secondary" as const;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "Pending";
      case OrderStatus.ACCEPTED:
        return "Accepted";
      case OrderStatus.REJECTED:
        return "Rejected";
      case OrderStatus.CANCELED:
        return "Canceled";
      case OrderStatus.PREPARING:
        return "Preparing";
      case OrderStatus.SHIPPING:
        return "Shipping";
      case OrderStatus.COMPLETED:
        return "Completed";
      case OrderStatus.RETURNED:
        return "Returned";
      default:
        return status;
    }
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = data.totalPages;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const shouldShowDocument = (
    status: OrderStatus,
    docType: string
  ): boolean => {
    switch (docType) {
      case "bon-livraison":
        return (
          status === OrderStatus.COMPLETED ||
          status === OrderStatus.REJECTED ||
          status === OrderStatus.SHIPPING
        );

      case "bon-commande":
        return (
          status === OrderStatus.PENDING ||
          status === OrderStatus.ACCEPTED ||
          status === OrderStatus.COMPLETED ||
          status === OrderStatus.SHIPPING
        );

      case "bon-retour":
        return (
          status === OrderStatus.CANCELED || status === OrderStatus.RETURNED
        );

      case "bon-reception":
        return status === OrderStatus.COMPLETED;

      case "facture":
        return (
          status === OrderStatus.ACCEPTED ||
          status === OrderStatus.COMPLETED ||
          status === OrderStatus.SHIPPING
        );

      case "facture-proforma":
        return (
          status === OrderStatus.PENDING ||
          status === OrderStatus.ACCEPTED ||
          status === OrderStatus.REJECTED ||
          status === OrderStatus.COMPLETED ||
          status === OrderStatus.SHIPPING
        );

      case "facture-avoir":
        return status === OrderStatus.REJECTED;

      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 gap-2">
        <SalamiLoadingAnimation showLoading={false} size="sm" />
        <span className="ml-2">Loading invoices...</span>
      </div>
    );
  }

  if (data.orders.length === 0) {
    const hasFilters = searchTerm || status || startDate || endDate;
    return (
      <div className="flex justify-center items-center w-full py-8">
        <TableEmptyState
          colSpan={6}
          message={
            hasFilters ? "No matching invoices found" : "No invoices found"
          }
          description={
            hasFilters
              ? `No invoices found${
                  searchTerm ? ` matching "${searchTerm}"` : ""
                }${
                  status
                    ? ` with status "${getStatusLabel(status as OrderStatus)}"`
                    : ""
                }${startDate || endDate ? ` in the selected date range` : ""}`
              : "No invoices have been created yet for this document type"
          }
          showAddButton={false}
          onAddClick={() => {}}
          addButtonText=""
        />
      </div>
    );
  }

  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, data.total);

  return (
    <div className="space-y-4">
      {/* Results summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex} to {endIndex} of {data.total} invoices
          {searchTerm && (
            <span className="ml-2">• Searching for "{searchTerm}"</span>
          )}
          {status && (
            <span className="ml-2">
              • Status: {getStatusLabel(status as OrderStatus)}
            </span>
          )}
          {(startDate || endDate) && (
            <span className="ml-2">
              • Date:{" "}
              {startDate && endDate
                ? `${startDate} to ${endDate}`
                : startDate
                ? `From ${startDate}`
                : `Until ${endDate}`}
            </span>
          )}
        </div>

        {documentType === "all" && (
          <div className="text-sm text-muted-foreground">
            Global search across all document types
          </div>
        )}
      </div>

      {/* Orders list */}
      {data.orders.map((order) => (
        <Collapsible
          key={order.id}
          open={openItems[order.id]}
          onOpenChange={() => toggleItem(order.id)}
          className="border rounded-md"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">
            <div className="flex items-center">
              <div className="ml-2 text-left">
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()} -{" "}
                  {order.user.firstName} {order.user.lastName}
                  {order.user.email && (
                    <span className="ml-2 text-xs">({order.user.email})</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusVariant(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
              <span className="text-sm font-medium">
                {order.total.toFixed(2)} DZD
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openItems[order.id] ? "transform rotate-180" : ""
                }`}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Total:</p>
                <p>{order.total.toFixed(2)} DZD</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status:</p>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Customer:</p>
                <p className="text-sm">
                  {order.user.firstName} {order.user.lastName}
                </p>
                {order.user.email && (
                  <p className="text-xs text-muted-foreground">
                    {order.user.email}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Order Date:</p>
                <p className="text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated:</p>
                <p className="text-sm">
                  {new Date(order.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.updatedAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Document Type:</p>
                <p className="text-sm capitalize">
                  {documentType === "all"
                    ? "Multiple"
                    : documentType.replace("-", " ")}
                </p>
              </div>
              {order.note && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Note:</p>
                  <p className="text-sm bg-muted p-2 rounded">{order.note}</p>
                </div>
              )}
              {order.cancelReason && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Cancel Reason:</p>
                  <p className="text-sm bg-destructive/10 p-2 rounded text-destructive">
                    {order.cancelReason}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePreview(order.id)}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={() => handlePrint(order.id)}
                size="sm"
                className="flex items-center"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {data.totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {generatePaginationNumbers().map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= data.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
