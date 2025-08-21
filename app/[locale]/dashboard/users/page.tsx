import UsersTable from "@/components/tables/users-table";
import { getUsersAction } from "@/lib/actions/users";

interface UsersPageProps {
  searchParams: {
    page?: string;
    search?: string;
    roles?: string | string[];
    dateFilter?: string;
    id?: string;
  };
}

const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const userId = searchParams.id || "";
  const roles = Array.isArray(searchParams.roles)
    ? searchParams.roles
    : searchParams.roles
    ? [searchParams.roles]
    : [];
  const dateFilter = searchParams.dateFilter || "";

  const usersData = await getUsersAction({
    page,
    limit: 10,
    search,
    roles,
    dateFilter,
    userId,
  });
  const searchParamsKey = JSON.stringify({
    page: searchParams.page,
    search: searchParams.search,
    roles: searchParams.roles,
    dateFilter: searchParams.dateFilter,
    usersData: usersData,
  });
  return (
    <UsersTable
      key={searchParamsKey} // This will force a complete re-mount
      initialData={usersData}
      initialPage={page}
      initialSearch={search}
      initialRoles={roles}
      initialDateFilter={dateFilter}
    />
  );
};

export default UsersPage;
