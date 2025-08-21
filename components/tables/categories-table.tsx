"use client";

import { useState, useEffect, startTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Upload,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Category } from "@prisma/client";
import { imageUrl } from "@/lib/utils";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/lib/actions/categories";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SalamiLoadingAnimation from "../ui/salami-loading";
import { toast } from "sonner";

interface PaginationData {
  categories: (Category & { _count: { SubCategories: number } })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CategoriesTable({
  categoriesData,
  currentPage,
  limit,
}: {
  categoriesData:
    | PaginationData
    | (Category & { _count: { SubCategories: number } })[];
  currentPage: number;
  limit: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const tCategories = useTranslations("categories");
  const tCategoriesTable = useTranslations("categoriesTable");
  const tCommon = useTranslations("common");
  const tPagination = useTranslations("pagination");

  // Handle both paginated and non-paginated data
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData.categories;
  const totalPages = Array.isArray(categoriesData)
    ? Math.ceil(categories.length / limit)
    : categoriesData.totalPages;
  const total = Array.isArray(categoriesData)
    ? categories.length
    : categoriesData.total;
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");
  const [subCategoryCountFilter, setSubCategoryCountFilter] =
    useState<string>("");

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchParams = useSearchParams();

  // Initialize filters from URL params
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setDateFromFilter(searchParams.get("dateFrom") || "");
    setDateToFilter(searchParams.get("dateTo") || "");
  }, [searchParams]);

  // Handle loading state when URL changes
  useEffect(() => {
    setIsSearching(false);
  }, [categories]);

  // Since we're using server-side pagination, we don't filter on client
  const filteredCategories = categories;

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", newPage.toString());
    searchParams.set("limit", limit.toString());
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  const handleSearch = () => {
    setIsSearching(true);
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());

    if (searchTerm) params.set("search", searchTerm);
    if (dateFromFilter) params.set("dateFrom", dateFromFilter);
    if (dateToFilter) params.set("dateTo", dateToFilter);
    if (subCategoryCountFilter) params.set("subCategoryCount", subCategoryCountFilter);
    const newUrl = `${pathname}?${params.toString()}`;
    startTransition(() => {
      router.push(newUrl);
      setIsSearching(false);
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDateFromFilter("");
    setDateToFilter("");
    setSubCategoryCountFilter("");

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCreateCategory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsCreating(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await createCategoryAction(formData);
      if (result.success) {
        toast.success(
          result.message || tCategoriesTable("toasts.categoryCreatedSuccess")
        );
        setIsCreateOpen(false);
        router.refresh();
      } else {
        toast.error(
          result.message || tCategoriesTable("toasts.categoryCreatedError")
        );
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(tCategoriesTable("toasts.categoryCreatedUnexpectedError"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCategory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await updateCategoryAction(formData);
      if (result.success) {
        toast.success(
          result.message || tCategoriesTable("toasts.categoryUpdatedSuccess")
        );
        setEditingCategory(null);
        router.refresh();
      } else {
        toast.error(
          result.message || tCategoriesTable("toasts.categoryUpdatedError")
        );
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(tCategoriesTable("toasts.categoryUpdatedUnexpectedError"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsDeleting(categoryId);

    try {
      const result = await deleteCategoryAction(categoryId);
      if (result.success) {
        toast.success(
          result.message || tCategoriesTable("toasts.categoryDeletedSuccess")
        );
        setDeletingCategory(null);
        router.refresh();
      } else {
        toast.error(
          result.message || tCategoriesTable("toasts.categoryDeletedError")
        );
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(tCategoriesTable("toasts.categoryDeletedUnexpectedError"));
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tCategories("title")}
          </h1>
          <p className="text-muted-foreground">
            {tCategoriesTable("manageProductCategories")}
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {tCategories("createCategory")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tCategories("createCategory")}</DialogTitle>
              <DialogDescription>
                {tCategoriesTable("addNewProductCategory")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCategory}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    {tCategoriesTable("categoryName")}
                  </Label>
                  <Input disabled={isCreating} id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">
                    {tCategoriesTable("categoryDescription")}
                  </Label>
                  <Textarea
                    disabled={isCreating}
                    id="description"
                    name="description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">
                    {tCategoriesTable("categoryImage")}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      disabled={isCreating}
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      {tCategoriesTable("creating")}
                    </>
                  ) : (
                    tCategoriesTable("createCategory")
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tCategoriesTable("allCategories")}</CardTitle>
          <CardDescription>
            {tCategoriesTable("allCategoriesDescription")}
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                disabled={isUpdating || isSearching}
                placeholder={tCategoriesTable("searchCategories")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="max-w-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching
                  ? tCategoriesTable("searching")
                  : tCommon("search")}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Filter className="h-4 w-4" />
                    <span>{tCommon("filter")}</span>
                    {(dateFromFilter ||
                      dateToFilter ||
                      subCategoryCountFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        {tCategoriesTable("dateRange")}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">
                            {tCategoriesTable("from")}
                          </label>
                          <Input
                            disabled={isUpdating || isSearching}
                            type="date"
                            value={dateFromFilter}
                            onChange={(e) => setDateFromFilter(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">
                            {tCategoriesTable("to")}
                          </label>
                          <Input
                            disabled={isUpdating || isSearching}
                            type="date"
                            value={dateToFilter}
                            onChange={(e) => setDateToFilter(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        {tCategoriesTable("subCategoriesCount")}
                      </h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={subCategoryCountFilter}
                        onChange={(e) =>
                          setSubCategoryCountFilter(e.target.value)
                        }
                      >
                        <option value="">{tCategoriesTable("any")}</option>
                        <option value="less5">
                          {tCategoriesTable("lessThan5")}
                        </option>
                        <option value="5to10">
                          {tCategoriesTable("5to10")}
                        </option>
                        <option value="more10">
                          {tCategoriesTable("moreThan10")}
                        </option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        disabled={isSearching}
                      >
                        {tCategoriesTable("resetFilters")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSearch}
                        disabled={isSearching}
                      >
                        {isSearching
                          ? tCategoriesTable("applying")
                          : tCategoriesTable("applyFilters")}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={limit}
                onChange={(e) => {
                  const newLimit = parseInt(e.target.value);
                  const searchParams = new URLSearchParams();
                  searchParams.set("page", "1");
                  searchParams.set("limit", newLimit.toString());
                  router.push(`${pathname}?${searchParams.toString()}`);
                }}
              >
                <option value={5}>5 {tCategoriesTable("perPage")}</option>
                <option value={10}>10 {tCategoriesTable("perPage")}</option>
                <option value={20}>20 {tCategoriesTable("perPage")}</option>
                <option value={50}>50 {tCategoriesTable("perPage")}</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tCommon("image")}</TableHead>
                <TableHead>{tCommon("name")}</TableHead>
                <TableHead>{tCommon("description")}</TableHead>
                <TableHead>{tCategoriesTable("subCategories")}</TableHead>
                <TableHead>{tCommon("createdAt")}</TableHead>
                <TableHead>{tCommon("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {tCategoriesTable("noCategoriesFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Image
                        src={imageUrl(category.image) || "/placeholder.svg"}
                        alt={category.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description ?? tCategoriesTable("na")}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/subcategories?categoryId=${category.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {category._count.SubCategories}{" "}
                        {tCategoriesTable("subcategories")}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {category.createdAt
                        ? category.createdAt.toString().split("T")[0]
                        : tCategoriesTable("na")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCategory(category)}
                          disabled={isUpdating || isDeleting === category.id}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingCategory(category)}
                          disabled={isDeleting === category.id || isUpdating}
                        >
                          {isDeleting === category.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {tCategoriesTable("showing", {
            from: (currentPage - 1) * limit + 1,
            to: Math.min(currentPage * limit, total),
            total,
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            {tCategoriesTable("previous")}
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            {tCategoriesTable("next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Category Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={() => setEditingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tCategoriesTable("editCategory")}</DialogTitle>
            <DialogDescription>
              {tCategoriesTable("updateCategoryInfo")}
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <form onSubmit={handleUpdateCategory}>
              <input type="hidden" name="id" value={editingCategory.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">
                    {tCategoriesTable("categoryName")}
                  </Label>
                  <Input
                    disabled={isUpdating}
                    id="edit-name"
                    name="name"
                    defaultValue={editingCategory.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">
                    {tCategoriesTable("categoryDescription")}
                  </Label>
                  <Textarea
                    disabled={isUpdating}
                    id="edit-description"
                    name="description"
                    defaultValue={editingCategory.description}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-image">
                    {tCategoriesTable("categoryImage")}
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <Image
                        src={
                          imageUrl(editingCategory.image) || "/placeholder.svg"
                        }
                        alt={editingCategory.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <Input
                      disabled={isUpdating}
                      id="edit-image"
                      name="image"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      {tCategoriesTable("updating")}
                    </>
                  ) : (
                    tCategoriesTable("updateCategory")
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              {tCategoriesTable("confirmDeletion")}
            </DialogTitle>
            <DialogDescription>
              {tCategoriesTable("deleteCategoryConfirm")}
            </DialogDescription>
          </DialogHeader>
          {deletingCategory && (
            <div className="py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-medium">{deletingCategory.name}</p>
                <p className="text-sm text-muted-foreground">
                  {deletingCategory.description ||
                    tCategoriesTable("categoryDescription")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tCategoriesTable("subCategories")}:{" "}
                  {deletingCategory._count.SubCategories}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingCategory(null)}
              disabled={isDeleting === deletingCategory?.id}
            >
              {tCategoriesTable("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletingCategory && handleDeleteCategory(deletingCategory.id)
              }
              disabled={isDeleting === deletingCategory?.id}
            >
              {isDeleting === deletingCategory?.id
                ? tCategoriesTable("deleting")
                : tCategoriesTable("deleteCategory")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
