
import { serverApi } from "../axios-interceptor";
import { Pagination } from "@/types";

export const getOrderHistoryAction = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  chauffeurId = "",
  camionId = "",
  dateFrom = "",
  dateTo = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  chauffeurId?: string;
  camionId?: string;
  dateFrom?: string;
  dateTo?: string;
} = {}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);
    if (chauffeurId) queryParams.append("chauffeurId", chauffeurId);
    if (camionId) queryParams.append("camionId", camionId);
    if (dateFrom) queryParams.append("dateFrom", dateFrom);
    if (dateTo) queryParams.append("dateTo", dateTo);

    const response = await serverApi.get(`/order/admin?${queryParams.toString()}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch order history: ${response.statusText}`);
    }
    // Expecting { orders, total, page, limit, totalPages }
    return response.data;
  } catch (error) {
    console.error("Error fetching order history:", error);
    return { orders: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
};
