"use client";

import { useState, useEffect } from "react";
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
import { Plus, Search, Edit, Trash2, Filter, Upload, Tag } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import {
  createSubCategoryAction,
  updateSubCategoryAction,
  deleteSubCategoryAction,
} from "@/lib/actions/subcategories";
import { imageUrl } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  categoryId: string;
  createdAt: Date | string;
  category?: {
    id: string;
    name: string;
  };
  productsCount?: number;
}

interface Category {
  id: string;
  name: string;
}

export default function SubCategoriesTable({
  subCategories,
  categories,
}: {
  subCategories: SubCategory[];
  categories: Category[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [productCountFilter, setProductCountFilter] = useState<string>("");

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const subCategoryId = searchParams.get("id");

  useEffect(() => {
    if (categoryId) {
      setSelectedCategories([categoryId]);
    }
    if (subCategoryId) {
      const subCategory = subCategories.find((sc) => sc.id === subCategoryId);
      if (subCategory) {
        setSearchTerm(subCategory.name);
      }
    }
  }, [categoryId, subCategoryId, subCategories]);

  const filteredSubCategories = subCategories.filter((subCategory) => {
    const matchesSearch =
      subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subCategory.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(subCategory.categoryId);

    const dateString =
      subCategory.createdAt instanceof Date
        ? subCategory.createdAt.toISOString().split("T")[0]
        : subCategory.createdAt;
    const matchesDate = !dateFilter || dateString.includes(dateFilter);

    const matchesProductCount =
      !productCountFilter ||
      (productCountFilter === "less10" &&
        (subCategory.productsCount || 0) < 10) ||
      (productCountFilter === "10to25" &&
        (subCategory.productsCount || 0) >= 10 &&
        (subCategory.productsCount || 0) <= 25) ||
      (productCountFilter === "more25" &&
        (subCategory.productsCount || 0) > 25);

    return (
      matchesSearch && matchesCategory && matchesDate && matchesProductCount
    );
  });

  const toggleCategoryFilter = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateSubCategory = async (formData: FormData) => {
    setIsCreating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await createSubCategoryAction(formData);
      if (result.success) {
        setSuccess("Subcategory created successfully!");
        setIsCreateOpen(false);
      } else {
        setError(result.message || "Failed to create subcategory");
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);
      setError("An unexpected error occurred while creating the subcategory");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSubCategory = async (formData: FormData) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await updateSubCategoryAction(formData);
      if (result.success) {
        setSuccess("Subcategory updated successfully!");
        setEditingSubCategory(null);
      } else {
        setError(result.message || "Failed to update subcategory");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      setError("An unexpected error occurred while updating the subcategory");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    setIsDeleting(subCategoryId);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await deleteSubCategoryAction(subCategoryId);
      if (result.success) {
        setSuccess("Subcategory deleted successfully!");
      } else {
        setError(result.message || "Failed to delete subcategory");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      setError("An unexpected error occurred while deleting the subcategory");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error and Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sub Categories</h1>
          <p className="text-muted-foreground">Manage product sub categories</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Sub Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Sub Category</DialogTitle>
              <DialogDescription>
                Add a new product sub category
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateSubCategory}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Sub Category Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Sub Category Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Sub Category</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sub Categories</CardTitle>
          <CardDescription>
            A list of all product sub categories
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sub categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
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
                    {(selectedCategories.length > 0 ||
                      dateFilter ||
                      productCountFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Categories</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`cat-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() =>
                                toggleCategoryFilter(category.id)
                              }
                            />
                            <Label htmlFor={`cat-${category.id}`}>
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Products Count</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={productCountFilter}
                        onChange={(e) => setProductCountFilter(e.target.value)}
                      >
                        <option value="">Any</option>
                        <option value="less10">Less than 10</option>
                        <option value="10to25">10 to 25</option>
                        <option value="more25">More than 25</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Date Created</h4>
                      <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategories([]);
                          setDateFilter("");
                          setProductCountFilter("");
                        }}
                      >
                        Reset Filters
                      </Button>
                      <Button size="sm">Apply Filters</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubCategories.map((subCategory) => (
                <TableRow key={subCategory.id}>
                  <TableCell>
                    <Image
                      src={
                        imageUrl(subCategory.image ?? "") || "/placeholder.svg"
                      }
                      alt={subCategory.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {subCategory.name}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {subCategory.description}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/categories?id=${subCategory.categoryId}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {subCategory.category?.name || "Unknown"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/products?subCategoryId=${subCategory.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {subCategory.productsCount || 0} products
                    </Link>
                  </TableCell>
                  <TableCell>
                    {subCategory.createdAt instanceof Date
                      ? subCategory.createdAt.toISOString().split("T")[0]
                      : subCategory.createdAt}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSubCategory(subCategory)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubCategory(subCategory.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Sub Category Dialog */}
      <Dialog
        open={!!editingSubCategory}
        onOpenChange={() => setEditingSubCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sub Category</DialogTitle>
            <DialogDescription>
              Update sub category information
            </DialogDescription>
          </DialogHeader>
          {editingSubCategory && (
            <form action={handleUpdateSubCategory}>
              <input type="hidden" name="id" value={editingSubCategory.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Sub Category Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingSubCategory.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingSubCategory.description}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-image">Sub Category Image</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <Image
                        src={
                          imageUrl(editingSubCategory.image ?? "") ||
                          "/placeholder.svg"
                        }
                        alt={editingSubCategory.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <Input
                      id="edit-image"
                      name="image"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-categoryId">Category</Label>
                  <select
                    id="edit-categoryId"
                    name="categoryId"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    defaultValue={editingSubCategory.categoryId}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Sub Category</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
