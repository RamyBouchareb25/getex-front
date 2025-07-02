import React from "react";
import { getAddressesAction, getCompaniesAction } from "@/lib/actions/addresses";
import AddressesTable from "@/components/tables/addresses-table";

export default async function AddressesPage(): Promise<React.JSX.Element> {
  const [addresses, companies] = await Promise.all([
    getAddressesAction(),
    getCompaniesAction(),
  ]);

  return <AddressesTable addresses={addresses} companies={companies} />;
}
