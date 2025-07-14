import {
  getStockAction,
  getProductsAction,
  getUsersAction,
} from "@/lib/actions/stock";
import StockTable from "@/components/tables/stock-table";

interface StockPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    productId?: string;
    ownerId?: string;
    stockStatus?: string;
    visibility?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function StockPage({ searchParams }: StockPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const productId = searchParams.productId;
  const ownerId = searchParams.ownerId;
  const stockStatus = searchParams.stockStatus;
  const visibility = searchParams.visibility;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;

  const [stockData, products, { users }] = await Promise.all([
    getStockAction({
      page,
      limit,
      search,
      productId,
      ownerId,
      stockStatus,
      visibility,
      dateFrom,
      dateTo,
    }),
    getProductsAction(),
    getUsersAction(),
  ]);
  return (
    <StockTable
      stockData={stockData}
      products={products}
      users={users}
      currentPage={page}
      limit={limit}
    />
  );
}
