import { getOrdersAction, getUsersAction } from "@/lib/actions/orders";
import OrdersTable from "@/components/tables/orders-table";

interface OrdersPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const status = searchParams.status;
  const userId = searchParams.userId;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;

  const [ordersData, { users }] = await Promise.all([
    getOrdersAction({
      page,
      limit,
      search,
      status,
      userId,
      dateFrom,
      dateTo,
    }),
    getUsersAction(),
  ]);
  const searchParamsKey = JSON.stringify({
    page: searchParams.page,
    limit: searchParams.limit,
    search: searchParams.search,
    status: searchParams.status,
    userId: searchParams.userId,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
  });

  return (
    <OrdersTable
      key={searchParamsKey} // This will force a complete re-mount
      ordersData={ordersData}
      users={users}
      currentPage={page}
      limit={limit}
    />
  );
}
