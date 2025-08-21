"use server";
import { serverApi } from "../axios-interceptor";

export const getInvoicesForOrderAction = async (orderId: string, documentType: string) => {
  try {
    const response = await serverApi.get(`/order/${orderId}/document-data`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching invoice document:", error);
    return { success: false, message: "Failed to fetch invoice document" };
  }
};

export const getInvoicesAction = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  documentType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.documentType && params.documentType !== "all") {
      queryParams.append("documentType", params.documentType);
    }
    if (params?.status) queryParams.append("status", params.status);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    
    console.log("Fetching invoices from URL:", `/order/admin?${queryParams.toString()}`);
    const response = await serverApi.get(`/order/admin?${queryParams.toString()}`);
    
    // Apply client-side filtering based on document type rules
    let filteredOrders = response.data.orders || [];
    
    if (params?.documentType && params.documentType !== "all") {
      filteredOrders = filteredOrders.filter((order: any) => {
        return shouldShowDocumentForStatus(order.status, params.documentType!);
      });
    }
    
    // Apply search filter if provided
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredOrders = filteredOrders.filter((order: any) => {
        return (
          order.id.toLowerCase().includes(searchLower) ||
          order.user?.firstName?.toLowerCase().includes(searchLower) ||
          order.user?.lastName?.toLowerCase().includes(searchLower) ||
          order.user?.email?.toLowerCase().includes(searchLower) ||
          order.status.toLowerCase().includes(searchLower) ||
          order.note?.toLowerCase().includes(searchLower) ||
          order.cancelReason?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Apply status filter if provided
    if (params?.status) {
      filteredOrders = filteredOrders.filter((order: any) => order.status === params.status);
    }
    
    // Apply date range filter if provided
    if (params?.startDate || params?.endDate) {
      filteredOrders = filteredOrders.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        const start = params?.startDate ? new Date(params.startDate) : null;
        const end = params?.endDate ? new Date(params.endDate) : null;
        
        if (start && end) {
          return orderDate >= start && orderDate <= end;
        } else if (start) {
          return orderDate >= start;
        } else if (end) {
          return orderDate <= end;
        }
        return true;
      });
    }
    
    // Calculate pagination for filtered results
    const total = filteredOrders.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    return {
      success: true,
      orders: paginatedOrders,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return {
      success: false,
      orders: [],
      total: 0,
      page: 1,
      totalPages: 1,
      message: "Failed to fetch invoices"
    };
  }
};

// Helper function to determine if a document should be shown for a specific status
const shouldShowDocumentForStatus = (status: string, docType: string): boolean => {
  switch (docType) {
    case "bon-livraison":
      return ["COMPLETED", "REJECTED", "SHIPPING"].includes(status);

    case "bon-commande":
      return ["PENDING", "ACCEPTED", "COMPLETED", "SHIPPING"].includes(status);

    case "bon-retour":
      return ["CANCELED", "RETURNED"].includes(status);

    case "bon-reception":
      return ["COMPLETED"].includes(status);

    case "facture":
      return ["ACCEPTED", "COMPLETED", "SHIPPING"].includes(status);

    case "facture-proforma":
      return ["PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "SHIPPING"].includes(status);

    case "facture-avoir":
      return ["REJECTED"].includes(status);

    default:
      return false;
  }
};
