import { getChauffeursAction } from "@/lib/actions/chauffeurs";
import { getCompaniesAction } from "@/lib/actions/companies";
import ChauffeursTable from "@/components/tables/chauffeurs-table";

interface DriversPageProps {
  searchParams: {
    page?: string;
    search?: string;
    companyId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function DriversPage({ searchParams }: DriversPageProps) {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const companyId = searchParams.companyId || "";
  const dateFrom = searchParams.dateFrom || "";
  const dateTo = searchParams.dateTo || "";

  const [chauffeursData, { companies }] = await Promise.all([
    getChauffeursAction({
      page,
      limit: 10,
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

  const searchParamsKey = JSON.stringify({
    page: searchParams.page,
    search: searchParams.search,
    companyId: searchParams.companyId,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
    chauffeursData: chauffeursData,
  });
  return (
    <ChauffeursTable
      key={searchParamsKey} // This will force a complete re-mount
      initialData={chauffeursData}
      companies={companies}
      initialPage={page}
      initialSearch={search}
      initialCompanyId={companyId}
      initialDateFrom={dateFrom}
      initialDateTo={dateTo}
    />
  );
}
