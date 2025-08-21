
import { getOrderHistoryAction } from "@/lib/actions/order-history";
import { getChauffeursAction } from "@/lib/actions/chauffeurs";
import { getCamionsAction } from "@/lib/actions/camions";
import OrderHistoryTable from "@/components/tables/order-history-table";

interface OrderHistoryPageProps {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    chauffeurId?: string;
    camionId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default async function OrderHistoryPage({ searchParams }: OrderHistoryPageProps) {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const status = searchParams.status || "";
  const chauffeurId = searchParams.chauffeurId || "";
  const camionId = searchParams.camionId || "";
  const dateFrom = searchParams.dateFrom || "";
  const dateTo = searchParams.dateTo || "";

  const [orderHistoryData, chauffeursData, camionsData] = await Promise.all([
    getOrderHistoryAction({ page, limit: 10, search, status, chauffeurId, camionId, dateFrom, dateTo }),
    getChauffeursAction({ page: 1, limit: 100 }),
    getCamionsAction({ page: 1, limit: 100 }),
  ]);

  return (
    <OrderHistoryTable
      initialData={orderHistoryData}
      chauffeurs={chauffeursData.chauffeurs || []}
      camions={camionsData.camions || []}
      initialPage={page}
      initialSearch={search}
      initialStatus={status}
      initialChauffeurId={chauffeurId}
      initialCamionId={camionId}
      initialDateFrom={dateFrom}
      initialDateTo={dateTo}
    />
  );
}
