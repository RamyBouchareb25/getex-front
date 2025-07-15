import { getCompaniesAction } from "@/lib/actions/companies";
import CompaniesTable from "@/components/tables/companies-table";

interface CompaniesPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    wilaya?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const wilaya = searchParams.wilaya;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;
  const searchParamsKey = JSON.stringify({
    page: searchParams.page,
    limit: searchParams.limit,
    search: searchParams.search,
    wilaya: searchParams.wilaya,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
  });

  const companiesData = await getCompaniesAction({ 
    page, 
    limit, 
    search, 
    wilaya, 
    dateFrom, 
    dateTo 
  });

  return <CompaniesTable key={searchParamsKey} companiesData={companiesData} currentPage={page} limit={limit} />;
}
 