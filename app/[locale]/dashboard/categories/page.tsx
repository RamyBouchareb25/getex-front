import CategoriesTable from "@/components/tables/categories-table";
import { getCategoriesAction } from "@/lib/actions/categories";

interface CategoriesPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    id?: string;
    subCategoryCount?: string;
  };
}

const CategoriesPage = async ({ searchParams }: CategoriesPageProps) => {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;
  const id = searchParams.id;
  const subCategoryCount = searchParams.subCategoryCount;
  try {
    const categoriesData = await getCategoriesAction({ 
      page, 
      limit, 
      search, 
      dateFrom, 
      dateTo, 
      id, 
      subCategoryCount
    });

    if (!categoriesData) {
      return <div>Error loading categories</div>;
    }
    const searchParamsKey = JSON.stringify({
      page: searchParams.page,
      limit: searchParams.limit,
      search: searchParams.search,
      dateFrom: searchParams.dateFrom,
      dateTo: searchParams.dateTo,
      id: searchParams.id,
      subCategoryCount: searchParams.subCategoryCount,
    });

    return <CategoriesTable key={searchParamsKey} categoriesData={categoriesData} currentPage={page} limit={limit} />;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return <div>Error loading categories</div>;
  }
};

export default CategoriesPage;
