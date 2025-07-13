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
  };
}

export default async function SubCategoriesPage({ searchParams }: SubCategoriesPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const categoryId = searchParams.categoryId;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;

  const [subCategoriesData, categories] = await Promise.all([
    getSubCategoriesAction({ 
      page, 
      limit, 
      search, 
      categoryId,
      dateFrom, 
      dateTo 
    }),
    getCategoriesAction(),
  ]);

  return <SubCategoriesTable 
    subCategoriesData={subCategoriesData} 
    categories={categories} 
    currentPage={page} 
    limit={limit} 
  />;
}
