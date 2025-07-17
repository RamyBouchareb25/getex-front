import {
  getChauffeursAction
} from "@/lib/actions/chauffeurs";
import { getCompaniesAction } from "@/lib/actions/companies";
import ChauffeursTable from "@/components/tables/chauffeurs-table";

interface DriversPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    companyId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function DriversPage({
  searchParams,
}: DriversPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search;
  const companyId = searchParams.companyId;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;

  const [chauffeursData, {companies}] = await Promise.all([
    getChauffeursAction({
      page,
      limit,
      search,
      companyId,
      dateFrom,
      dateTo,
    }),
    getCompaniesAction({
      page: 1,
      limit: 100
    })
  ]);
  
  const searchParamsKey = JSON.stringify({
    page: searchParams.page,
    limit: searchParams.limit,
    search: searchParams.search,
    companyId: searchParams.companyId,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
  });

  return (
    <ChauffeursTable
      key={searchParamsKey} // This will force a complete re-mount
      chauffeursData={chauffeursData}
      companies={companies}
      currentPage={page}
      limit={limit}
    />
  );
}
