import CategoriesTable from "@/components/tables/categories-table";
import { getCategoriesAction } from "@/lib/actions/categories";

interface CategoriesPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

const CategoriesPage = async ({ searchParams }: CategoriesPageProps) => {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;

  try {
    const categoriesData = await getCategoriesAction({ 
      page, 
      limit, 
      search, 
      dateFrom, 
      dateTo 
    });

    if (!categoriesData) {
      return <div>Error loading categories</div>;
    }

    return <CategoriesTable categoriesData={categoriesData} currentPage={page} limit={limit} />;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return <div>Error loading categories</div>;
  }
};

export default CategoriesPage;
