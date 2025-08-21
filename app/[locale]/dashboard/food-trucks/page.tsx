import FoodTrucksTable from "@/components/tables/food-trucks-table";
import { getFoodTrucksAction, getFoodTruckUsersAction } from "@/lib/actions/food-trucks";

interface FoodTrucksPageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

const FoodTrucksPage = async ({ searchParams }: FoodTrucksPageProps) => {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";

  const [foodTrucksData, availableUsers] = await Promise.all([
    getFoodTrucksAction({
      page,
      limit: 10,
      search,
    }),
    getFoodTruckUsersAction(),
  ]);

  const searchParamsKey = JSON.stringify({
    page: searchParams.page,
    search: searchParams.search,
    foodTrucksData: foodTrucksData,
  });

  return (
    <FoodTrucksTable
      key={searchParamsKey} // This will force a complete re-mount
      initialData={foodTrucksData}
      initialPage={page}
      initialSearch={search}
      availableUsers={availableUsers}
    />
  );
};

export default FoodTrucksPage;