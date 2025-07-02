import { getCompaniesAction } from "@/lib/actions/companies";
import CompaniesTable from "@/components/tables/companies-table";

export default async function CompaniesPage() {
  const [companies] = await Promise.all([
    getCompaniesAction(),
  ]);

  return <CompaniesTable companies={companies}  />;
}
 