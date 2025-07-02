import { getSubCategoriesAction, getCategoriesAction } from "@/lib/actions/subcategories";
import SubCategoriesTable from "@/components/tables/subcategories-table";

export default async function SubCategoriesPage() {
  const [subCategories, categories] = await Promise.all([
    getSubCategoriesAction(),
    getCategoriesAction(),
  ]);

  return <SubCategoriesTable subCategories={subCategories} categories={categories} />;
}
