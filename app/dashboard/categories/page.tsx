import CategoriesTable from "@/components/tables/categories-table";
import { getCategoriesAction } from "@/lib/actions/subcategories";

const CategoriesPage = async () => {
  try {
    const categories = await getCategoriesAction();
    if (!categories) {
      return <div>Error loading categories</div>;
    }

    return <CategoriesTable categories={categories} />;
  } catch (error) {
    console.error("Error fetching categories:", error);

    return <div>Error loading categories</div>;
  }
};

export default CategoriesPage;
