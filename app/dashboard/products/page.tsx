import { getProductsAction, getSubCategoriesAction } from "@/lib/actions/products";
import ProductsTable from "@/components/tables/products-table";

export default async function ProductsPage() {
  const [products, subCategories] = await Promise.all([
    getProductsAction(),
    getSubCategoriesAction(),
  ]);

  return <ProductsTable products={products} subCategories={subCategories} />;
}
