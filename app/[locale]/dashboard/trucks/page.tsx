import { getCamionsAction } from "@/lib/actions/camions";
import { getCompaniesAction } from "@/lib/actions/companies";
import CamionsTable from "@/components/tables/camions-table";

interface TrucksPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    companyId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function TrucksPage({ searchParams }: TrucksPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const companyId = searchParams.companyId;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;

  const [camionsData, companiesData] = await Promise.all([
    getCamionsAction({
      page,
      limit,
      search,
      companyId,
      dateFrom,
      dateTo,
    }),
    getCompaniesAction({
      page: 1,
      limit: 100,
    }),
  ]);
  
  const { companies } = companiesData;

  const searchParamsKey = JSON.stringify({
    page: searchParams.page,
    limit: searchParams.limit,
    search: searchParams.search,
    companyId: searchParams.companyId,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
  });
  return (
    <CamionsTable
      key={searchParamsKey} // This will force a complete re-mount
      camionsData={camionsData}
      companies={companies}
      currentPage={page}
      limit={limit}
    />
  );
}
