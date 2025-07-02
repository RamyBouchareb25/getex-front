import { getOrdersAction, getUsersAction } from "@/lib/actions/orders";
import OrdersTable from "@/components/tables/orders-table";

export default async function OrdersPage() {
  const [orders, users] = await Promise.all([
    getOrdersAction(),
    getUsersAction(),
  ]);

  return <OrdersTable orders={orders} users={users} />;
}
