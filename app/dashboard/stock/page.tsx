import { getStockAction, getProductsAction, getUsersAction } from "@/lib/actions/stock";
import StockTable from "@/components/tables/stock-table";

export default async function StockPage() {
  const [stock, products, users] = await Promise.all([
    getStockAction(),
    getProductsAction(),
    getUsersAction(),
  ]);

  return <StockTable stock={stock} products={products} users={users} />;
}
