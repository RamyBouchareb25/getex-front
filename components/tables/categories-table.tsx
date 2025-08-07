"use client";

import { useState, useEffect } from "react";
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

    router.push(`${pathname}?${params.toString()}`);
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
        toast.success(result.message || "Category created successfully!");
        setIsCreateOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("An unexpected error occurred while creating the category");
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
        toast.success(result.message || "Category updated successfully!");
        setEditingCategory(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("An unexpected error occurred while updating the category");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsDeleting(categoryId);

    try {
      const result = await deleteCategoryAction(categoryId);
      if (result.success) {
        toast.success(result.message || "Category deleted successfully!");
        setDeletingCategory(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("An unexpected error occurred while deleting the category");
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
          <p className="text-muted-foreground">Manage product categories</p>
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
              <DialogDescription>Add a new product category</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCategory}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{tCategories("categoryName")}</Label>
                  <Input disabled={isCreating} id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">
                    {tCategories("categoryDescription")}
                  </Label>
                  <Textarea
                    disabled={isCreating}
                    id="description"
                    name="description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Category Image</Label>
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
                  {isUpdating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>A list of all product categories</CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                disabled={isUpdating || isSearching}
                placeholder="Search categories..."
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
                {isSearching ? "Searching..." : "Search"}
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
                    <span>Filter</span>
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
                      <h4 className="font-medium">Date Range</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">
                            From
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
                            To
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
                      <h4 className="font-medium">Sub Categories Count</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={subCategoryCountFilter}
                        onChange={(e) =>
                          setSubCategoryCountFilter(e.target.value)
                        }
                      >
                        <option value="">Any</option>
                        <option value="less5">Less than 5</option>
                        <option value="5to10">5 to 10</option>
                        <option value="more10">More than 10</option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        disabled={isSearching}
                      >
                        Reset Filters
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSearch}
                        disabled={isSearching}
                      >
                        {isSearching ? "Applying..." : "Apply Filters"}
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
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>{tCommon("name")}</TableHead>
                <TableHead>{tCommon("description")}</TableHead>
                <TableHead>Sub Categories</TableHead>
                <TableHead>Created At</TableHead>
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
                    No categories found
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
                      {category.description ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/subcategories?categoryId=${category.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {category._count.SubCategories} subcategories
                      </Link>
                    </TableCell>
                    <TableCell>
                      {category.createdAt
                        ? category.createdAt.toString().split("T")[0]
                        : "N/A"}
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
          Showing {(currentPage - 1) * limit + 1} to{" "}
          {Math.min(currentPage * limit, total)} of {total} categories
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
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
            Next
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
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <form onSubmit={handleUpdateCategory}>
              <input type="hidden" name="id" value={editingCategory.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Category Name</Label>
                  <Input
                    disabled={isUpdating}
                    id="edit-name"
                    name="name"
                    defaultValue={editingCategory.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    disabled={isUpdating}
                    id="edit-description"
                    name="description"
                    defaultValue={editingCategory.description}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-image">Category Image</Label>
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
                      Updating...
                    </>
                  ) : (
                    "Update Category"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be
              undone and will also delete all associated subcategories.
            </DialogDescription>
          </DialogHeader>
          {deletingCategory && (
            <div className="py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-medium">{deletingCategory.name}</p>
                <p className="text-sm text-muted-foreground">
                  {deletingCategory.description || "No description"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Subcategories: {deletingCategory._count.SubCategories}
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
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingCategory && handleDeleteCategory(deletingCategory.id)}
              disabled={isDeleting === deletingCategory?.id}
            >
              {isDeleting === deletingCategory?.id ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
