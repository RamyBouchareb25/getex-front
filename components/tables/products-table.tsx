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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Filter, Upload } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { createProductAction, updateProductAction, deleteProductAction } from "@/lib/actions/products";
import { imageUrl } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  subCategoryId: string;
  createdAt: Date | string;
  subCategory?: {
    id: string;
    name: string;
  };
}

interface SubCategory {
  id: string;
  name: string;
}

export default function ProductsTable({
  products,
  subCategories,
}: {
  products: Product[];
  subCategories: SubCategory[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const subCategoryId = searchParams.get("subCategoryId");
  const productId = searchParams.get("id");

  useEffect(() => {
    if (subCategoryId) {
      setSelectedSubCategories([subCategoryId]);
    }
    if (productId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSearchTerm(product.name);
      }
    }
  }, [subCategoryId, productId, products]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubCategory =
      selectedSubCategories.length === 0 ||
      selectedSubCategories.includes(product.subCategoryId);

    const dateString = product.createdAt instanceof Date
      ? product.createdAt.toISOString().split("T")[0]
      : product.createdAt;
    const matchesDate = !dateFilter || dateString.includes(dateFilter);

    return matchesSearch && matchesSubCategory && matchesDate;
  });

  const toggleSubCategoryFilter = (id: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateProduct = async (formData: FormData) => {
    setIsCreating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await createProductAction(formData);
      if (result.success) {
        setSuccess("Product created successfully!");
        setIsCreateOpen(false);
      } else {
        setError(result.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setError("An unexpected error occurred while creating the product");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProduct = async (formData: FormData) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await updateProductAction(formData);
      if (result.success) {
        setSuccess("Product updated successfully!");
        setEditingProduct(null);
      } else {
        setError(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("An unexpected error occurred while updating the product");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setIsDeleting(productId);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await deleteProductAction(productId);
      if (result.success) {
        setSuccess("Product deleted successfully!");
      } else {
        setError(result.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("An unexpected error occurred while deleting the product");
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
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>Add a new product to your catalog</DialogDescription>
            </DialogHeader>
            <form action={handleCreateProduct}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex items-center gap-2">
                    <Input id="image" name="image" type="file" accept="image/*" />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subCategoryId">Sub Category</Label>
                  <Select name="subCategoryId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((subCat) => (
                        <SelectItem key={subCat.id} value={subCat.id}>
                          {subCat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Product</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>A list of all products in your catalog</CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    {(selectedSubCategories.length > 0 || dateFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Sub Categories</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {subCategories.map((subCat) => (
                          <div key={subCat.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`subcat-${subCat.id}`}
                              checked={selectedSubCategories.includes(subCat.id)}
                              onCheckedChange={() => toggleSubCategoryFilter(subCat.id)}
                            />
                            <Label htmlFor={`subcat-${subCat.id}`}>{subCat.name}</Label>
                          </div>
                        ))}
                      </div>
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
                          setSelectedSubCategories([]);
                          setDateFilter("");
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
                <TableHead>Sub Category</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={imageUrl(product.image ?? "") || "/placeholder.svg"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {product.description}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/subcategories?id=${product.subCategoryId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {product.subCategory?.name || "Unknown"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {product.createdAt instanceof Date
                      ? product.createdAt.toISOString().split("T")[0]
                      : product.createdAt}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
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

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <form action={handleUpdateProduct}>
              <input type="hidden" name="id" value={editingProduct.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingProduct.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingProduct.description}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-image">Product Image</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <Image
                        src={imageUrl(editingProduct.image ?? "") || "/placeholder.svg"}
                        alt={editingProduct.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <Input id="edit-image" name="image" type="file" accept="image/*" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-subCategoryId">Sub Category</Label>
                  <Select
                    name="subCategoryId"
                    defaultValue={editingProduct.subCategoryId}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((subCat) => (
                        <SelectItem key={subCat.id} value={subCat.id}>
                          {subCat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Product</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
