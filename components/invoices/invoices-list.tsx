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
import { ChevronDown, Printer, Eye, FileText } from "lucide-react";
import { getOrdersAction } from "@/lib/actions/orders";
import EmptyState from "@/components/empty-state";

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
  user: { id: string; firstName: string; lastName: string };
}

interface InvoicesListProps {
  documentType: string;
}

export default function InvoicesList({ documentType }: InvoicesListProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getOrdersAction();
        if (response.orders && response.orders.length > 0) {
          // Filter orders based on document type and status logic
          const filteredOrders = response.orders.filter((order: Order) => {
            return shouldShowDocument(
              order.status as OrderStatus,
              documentType
            );
          });
          setOrders(filteredOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [documentType]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePreview = (orderId: string) => {
    router.push(`/dashboard/invoices/${documentType}/preview/${orderId}`);
  };

  const handlePrint = async (orderId: string) => {
    try {
      // Open in a new tab
      window.open(`/api/orders/${orderId}/print/${documentType}`, "_blank");
    } catch (error) {
      console.error("Error printing document:", error);
    }
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
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title={t("noInvoicesFound")}
        description={t("noInvoicesDescription")}
        icon={<FileText />}
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
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
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                Status:{" "}
                <span
                  className={`capitalize ${
                    order.status === OrderStatus.COMPLETED
                      ? "text-green-500"
                      : order.status === OrderStatus.CANCELED
                      ? "text-red-500"
                      : "text-blue-500"
                  }`}
                >
                  {order.status.toLowerCase()}
                </span>
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
                <p>${order.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status:</p>
                <p className="capitalize">{order.status.toLowerCase()}</p>
              </div>
              {order.note && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Note:</p>
                  <p className="text-sm">{order.note}</p>
                </div>
              )}
              {order.cancelReason && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Cancel Reason:</p>
                  <p className="text-sm">{order.cancelReason}</p>
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
    </div>
  );
}
