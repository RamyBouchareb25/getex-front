import { getProductsAction, getSubCategoriesAction, getCategoriesAction } from "@/lib/actions/products";
import ProductsTable from "@/components/tables/products-table";

interface ProductsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    subCategoryId?: string;
    categoryId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const subCategoryId = searchParams.subCategoryId;
  const categoryId = searchParams.categoryId;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;

  const [productsData, subCategories, categories] = await Promise.all([
    getProductsAction({ 
      page, 
      limit, 
      search, 
      subCategoryId,
      categoryId,
      dateFrom, 
      dateTo 
    }),
    getSubCategoriesAction(),
    getCategoriesAction(),
  ]);

  return <ProductsTable 
    productsData={productsData} 
    subCategories={subCategories} 
    categories={categories}
    currentPage={page} 
    limit={limit} 
  />;
}
