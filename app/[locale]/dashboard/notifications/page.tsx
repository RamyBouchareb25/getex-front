import NotificationsManager from "@/components/notifications-manager";
import { getTopicsAction, getNotificationHistoryAction } from "@/lib/actions/notifications";
import { getUsersAction } from "@/lib/actions/users";

interface NotificationsPageProps {
  searchParams: {
    tab?: string;
    page?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  };
}

const NotificationsPage = async ({ searchParams }: NotificationsPageProps) => {
  const tab = searchParams.tab || "send";
  const page = parseInt(searchParams.page || "1");
  const type = searchParams.type || "";
  const startDate = searchParams.startDate || "";
  const endDate = searchParams.endDate || "";

  // Fetch required data
  const [users, topics, history] = await Promise.all([
    getUsersAction({ page: 1, limit: 1000 }), // Get all users for selection
    getTopicsAction(),
    tab === "history" ? getNotificationHistoryAction({
      page,
      limit: 10,
      type,
      startDate,
      endDate,
    }) : Promise.resolve(null),
  ]);

  return (
    <NotificationsManager
      initialUsers={users.users || []}
      initialTopics={topics}
      initialHistory={history}
      initialTab={tab}
      initialPage={page}
      initialType={type}
      initialStartDate={startDate}
      initialEndDate={endDate}
    />
  );
};

export default NotificationsPage;
