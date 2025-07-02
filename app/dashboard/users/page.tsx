import UsersTable from "@/components/tables/users-table";
import { getUsersAction } from "@/lib/actions/companies";

const UsersPage = async () => {
  const [users] = await Promise.all([getUsersAction()]);
  return <UsersTable users={users} />;
};

export default UsersPage;
