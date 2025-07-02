"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction } from "@/lib/products";
import { Checkbox } from "@/components/ui/checkbox";
import { getCategories } from "@/lib/categories";
import { getSubCategories } from "@/lib/subcategories";

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductModal({
  open,
  onOpenChange,
}: CreateProductModalProps) {
  const [createCategory, setCreateCategory] = useState(false);
  const [createSubCategory, setCreateSubCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    async function loadData() {
      const [categoriesData, subCategoriesData] = await Promise.all([
        getCategories(),
        getSubCategories(),
      ]);
      setCategories(categoriesData);
      setSubCategories(subCategoriesData);
    }
    if (open) {
      loadData();
    }
  }, [open]);

  const filteredSubCategories = subCategories.filter(
    (sub) => sub.categoryId === selectedCategoryId
  );

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await createProductAction(formData);
      if (result.success) {
        onOpenChange(false);
        setCreateCategory(false);
        setCreateSubCategory(false);
        setSelectedCategoryId("");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Add a new product with optional category and subcategory creation
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <Tabs defaultValue="product" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="product">Product Details</TabsTrigger>
              <TabsTrigger value="category" disabled={!createCategory}>
                Category
              </TabsTrigger>
              <TabsTrigger value="subcategory" disabled={!createSubCategory}>
                Sub Category
              </TabsTrigger>
            </TabsList>

            <TabsContent value="product" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>Basic product details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                    />
                  </div>

                  {!createCategory && (
                    <div className="grid gap-2">
                      <Label htmlFor="categoryId">Category</Label>
                      <Select
                        name="categoryId"
                        value={selectedCategoryId}
                        onValueChange={setSelectedCategoryId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {!createSubCategory && selectedCategoryId && (
                    <div className="grid gap-2">
                      <Label htmlFor="subCategoryId">Sub Category</Label>
                      <Select name="subCategoryId">
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub category" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSubCategories.map((subCategory) => (
                            <SelectItem
                              key={subCategory.id}
                              value={subCategory.id}
                            >
                              {subCategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="createCategory"
                        checked={createCategory}
                        onCheckedChange={(check) =>
                          setCreateCategory(check ? true : false)
                        }
                      />
                      <Label htmlFor="createCategory">
                        Create new category
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="createSubCategory"
                        checked={createSubCategory}
                        onCheckedChange={(check) =>
                          setCreateSubCategory(check ? true : false)
                        }
                      />
                      <Label htmlFor="createSubCategory">
                        Create new sub category
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="category" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Category Information</CardTitle>
                  <CardDescription>New category details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      name="categoryName"
                      required={createCategory}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Textarea
                      id="categoryDescription"
                      name="categoryDescription"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subcategory" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sub Category Information</CardTitle>
                  <CardDescription>New sub category details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subCategoryName">Sub Category Name</Label>
                    <Input
                      id="subCategoryName"
                      name="subCategoryName"
                      required={createSubCategory}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subCategoryDescription">Description</Label>
                    <Textarea
                      id="subCategoryDescription"
                      name="subCategoryDescription"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
