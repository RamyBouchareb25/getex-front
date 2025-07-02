"use client";

import { useState } from "react";
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
import { Plus, Search, Edit, Trash2, Filter, Upload } from "lucide-react";
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

export default function CategoriesTable({
  categories,
}: {
  categories: (Category & { _count: { SubCategories: number } })[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [subCategoryCountFilter, setSubCategoryCountFilter] =
    useState<string>("");

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      !dateFilter || category.createdAt.toString().includes(dateFilter);

    const matchesSubCount =
      !subCategoryCountFilter ||
      (subCategoryCountFilter === "less5" &&
        category._count.SubCategories < 5) ||
      (subCategoryCountFilter === "5to10" &&
        category._count.SubCategories >= 5 &&
        category._count.SubCategories <= 10) ||
      (subCategoryCountFilter === "more10" &&
        category._count.SubCategories > 10);

    return matchesSearch && matchesDate && matchesSubCount;
  });

  const handleCreateCategory = async (formData: FormData) => {
    await createCategoryAction(formData);
    setIsCreateOpen(false);
  };

  const handleUpdateCategory = async (formData: FormData) => {
    await updateCategoryAction(formData);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await deleteCategoryAction(categoryId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>Add a new product category</DialogDescription>
            </DialogHeader>
            <form action={handleCreateCategory}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Category Image</Label>
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
              </div>
              <DialogFooter>
                <Button type="submit">Create Category</Button>
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
                placeholder="Search categories..."
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
                    {(dateFilter || subCategoryCountFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Date Created</h4>
                      <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      />
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
                        onClick={() => {
                          setDateFilter("");
                          setSubCategoryCountFilter("");
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
                <TableHead>Sub Categories</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Image
                      src={imageUrl(category.image ?? "") || "/placeholder.svg"}
                      alt={category.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {category.description}
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
                    {category.createdAt ? category.createdAt.toString().split("T")[0] : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
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
            <form action={handleUpdateCategory}>
              <input type="hidden" name="id" value={editingCategory.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Category Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingCategory.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
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
                      id="edit-image"
                      name="image"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Category</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
