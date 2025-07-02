import CategoriesTable from "@/components/tables/categories-table";
import { getCategoriesAction } from "@/lib/actions/subcategories";

const CategoriesPage = async () => {
  const categories = await getCategoriesAction();
  if (!categories) {
    return <div>Error loading categories</div>;
  }

  return <CategoriesTable categories={categories} />;
};

export default CategoriesPage;
