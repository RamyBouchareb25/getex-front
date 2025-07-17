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
    id?: string;
  };
}

export default async function CompaniesPage({
  searchParams,
}: CompaniesPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const wilaya = searchParams.wilaya;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;
  const companyId = searchParams.id;
  const searchParamsKey = JSON.stringify({
    page,
    limit,
    search,
    wilaya,
    dateFrom,
    dateTo,
    companyId,
  });

  const companiesData = await getCompaniesAction({
    page,
    limit,
    search,
    wilaya,
    dateFrom,
    dateTo,
    companyId,
  });

  return (
    <CompaniesTable
      key={searchParamsKey}
      companiesData={companiesData}
      currentPage={page}
      limit={limit}
    />
  );
}
