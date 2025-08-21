import { getSubCategoriesAction, getCategoriesAction } from "@/lib/actions/subcategories";
import SubCategoriesTable from "@/components/tables/subcategories-table";

interface SubCategoriesPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    categoryId?: string;
    dateFrom?: string;
    dateTo?: string;
    productCount?: string;
  };
}

export default async function SubCategoriesPage({ searchParams }: SubCategoriesPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const categoryId = searchParams.categoryId;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;
  const productCount = searchParams.productCount;

  const [subCategoriesData, categories] = await Promise.all([
    getSubCategoriesAction({ 
      page, 
      limit, 
      search, 
      categoryId,
      dateFrom, 
      dateTo,
      productCount 
    }),
    getCategoriesAction(),
  ]);
  const searchParamsKey = JSON.stringify({
    page: searchParams.page,
    limit: searchParams.limit,
    search: searchParams.search,
    categoryId: searchParams.categoryId,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
    productCount: searchParams.productCount,
  });
  return <SubCategoriesTable 
    key={searchParamsKey} // This will force a complete re-mount
    subCategoriesData={subCategoriesData} 
    categories={categories} 
    currentPage={page} 
    limit={limit} 
  />;
}
