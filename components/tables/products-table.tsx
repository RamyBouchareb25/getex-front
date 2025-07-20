"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import TableEmptyState from "@/components/table-empty-state";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Upload,
  ChevronLeft,
  ChevronRight,
  Tag,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/lib/actions/products";
import { imageUrl } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NutritionalInfo {
  id: string;
  type: string;
  graisse: string;
  acide: string;
  glucide: string;
  sucre: string;
  proteine: string;
  sel: string;
  fibre: string;
  energie: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  productId: string;
}

interface Product {
  id: string;
  name: string;
  reference?: string;
  description?: string;
  image?: string;
  subCategoryId: string;
  createdAt: Date | string;
  SubCategory?: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    };
  };
  nutritionalInfo?: NutritionalInfo;
}

interface SubCategory {
  id: string;
  name: string;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface PaginationData {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ProductsTable({
  productsData,
  subCategories,
  categories,
  currentPage,
  limit,
}: {
  productsData: PaginationData | Product[];
  subCategories: SubCategory[];
  categories: Category[];
  currentPage: number;
  limit: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const tProducts = useTranslations("products");
  const tCommon = useTranslations("common");
  const tPagination = useTranslations("pagination");

  // Handle both paginated and non-paginated data
  const products = Array.isArray(productsData)
    ? productsData
    : productsData.products;
  const totalPages = Array.isArray(productsData)
    ? Math.ceil(products.length / limit)
    : productsData.totalPages;
  const total = Array.isArray(productsData)
    ? products.length
    : productsData.total;

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [includeNutritionalInfo, setIncludeNutritionalInfo] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingProductDetails, setIsLoadingProductDetails] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const subCategoryIdParam = searchParams.get("subCategoryId");
  const categoryIdParam = searchParams.get("categoryId");
  const productIdParam = searchParams.get("id");

  // Initialize filters from URL params
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setDateFromFilter(searchParams.get("dateFrom") || "");
    setDateToFilter(searchParams.get("dateTo") || "");
    if (subCategoryIdParam) {
      setSelectedSubCategories([subCategoryIdParam]);
    }
    if (categoryIdParam) {
      setSelectedCategories([categoryIdParam]);
    }
  }, [searchParams, subCategoryIdParam, categoryIdParam]);

  // Handle loading state when URL changes
  useEffect(() => {
    setIsSearching(false);
  }, [products]);

  useEffect(() => {
    if (productIdParam) {
      const product = products.find((p) => p.id === productIdParam);
      if (product) {
        setSearchTerm(product.name);
      }
    }
  }, [productIdParam, products]);

  // Since we're using server-side pagination, we don't filter on client
  const filteredProducts = products;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());

    // Preserve existing filters
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (selectedSubCategories.length > 0)
      params.set("subCategoryId", selectedSubCategories[0]);
    if (selectedCategories.length > 0)
      params.set("categoryId", selectedCategories[0]);
    if (dateFromFilter) params.set("dateFrom", dateFromFilter);
    if (dateToFilter) params.set("dateTo", dateToFilter);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = () => {
    setIsSearching(true);
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());

    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (selectedSubCategories.length > 0)
      params.set("subCategoryId", selectedSubCategories[0]);
    if (selectedCategories.length > 0)
      params.set("categoryId", selectedCategories[0]);
    if (dateFromFilter) params.set("dateFrom", dateFromFilter);
    if (dateToFilter) params.set("dateTo", dateToFilter);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setIsSearching(true);
    setSearchTerm("");
    setSelectedSubCategories([]);
    setSelectedCategories([]);
    setDateFromFilter("");
    setDateToFilter("");

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleSubCategoryFilter = (id: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCategoryFilter = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateProduct = async (formData: FormData) => {
    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      // If nutritional info is being included, validate that all fields are filled or none
      if (includeNutritionalInfo) {
        const type = formData.get("nutritionalType") as string;
        const graisse = formData.get("graisse") as string;
        const acide = formData.get("acide") as string;
        const glucide = formData.get("glucide") as string;
        const sucre = formData.get("sucre") as string;
        const proteine = formData.get("proteine") as string;
        const sel = formData.get("sel") as string;
        const fibre = formData.get("fibre") as string;
        const energie = formData.get("energie") as string;

        // Check if any nutritional field is filled
        const anyNutritionalFieldFilled =
          (type && type.trim()) ||
          (graisse && graisse.trim()) ||
          (acide && acide.trim()) ||
          (glucide && glucide.trim()) ||
          (sucre && sucre.trim()) ||
          (proteine && proteine.trim()) ||
          (sel && sel.trim()) ||
          (fibre && fibre.trim()) ||
          (energie && energie.trim());

        // If any field is filled, all should be filled
        if (anyNutritionalFieldFilled) {
          formData.append("includeNutritionalInfo", "true");
        } else {
          // No nutritional fields filled, don't include nutritional info
          formData.append("includeNutritionalInfo", "false");
        }
      } else {
        formData.append("includeNutritionalInfo", "false");
      }

      const result = await createProductAction(formData);
      if (result.success) {
        setSuccess(tProducts("productCreated"));
        setIsCreateOpen(false);
        setIncludeNutritionalInfo(false); // Reset state after successful creation
      } else {
        setError(result.message || tProducts("productCreationFailed"));
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
          <h1 className="text-3xl font-bold tracking-tight">
            {tProducts("title")}
          </h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {tProducts("createProduct")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{tProducts("createProduct")}</DialogTitle>
              <DialogDescription>
                Add a new product to your catalog
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateProduct}>
              <Tabs defaultValue="basic" className="pt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger
                    value="nutritional"
                    onClick={() => setIncludeNutritionalInfo(true)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIncludeNutritionalInfo(false);
                      }
                    }}
                  >
                    Nutritional Information (Optional)
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-4">
                  <div className="grid gap-4 py-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name">{tProducts("productName")}</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reference">
                        {tProducts("reference")}
                      </Label>
                      <Input id="reference" name="reference" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">
                        {tProducts("productDescription")}
                      </Label>
                      <Textarea id="description" name="description" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="subCategoryId">
                        {tCommon("subcategory")}
                      </Label>
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
                </TabsContent>
                <TabsContent value="nutritional" className="mt-4">
                  <div className="grid gap-4 py-2">
                    <div className="flex items-center p-3 rounded-md bg-muted/50 border border-muted">
                      <p className="text-sm text-muted-foreground">
                        {tProducts("nutritionalInfo")} is optional. You can
                        leave all fields empty, but if you fill any field, we
                        recommend filling all fields for complete nutritional
                        data.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nutritionalType">
                          {tProducts("nutritionalType")}
                        </Label>
                        <Input id="nutritionalType" name="nutritionalType" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="graisse">
                          {tProducts("nutritionalGraisse")}
                        </Label>
                        <Input id="graisse" name="graisse" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="acide">
                          {tProducts("nutritionalAcide")}
                        </Label>
                        <Input id="acide" name="acide" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="glucide">
                          {tProducts("nutritionalGlucide")}
                        </Label>
                        <Input id="glucide" name="glucide" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sucre">
                          {tProducts("nutritionalSucre")}
                        </Label>
                        <Input id="sucre" name="sucre" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="proteine">
                          {tProducts("nutritionalProteine")}
                        </Label>
                        <Input id="proteine" name="proteine" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sel">
                          {tProducts("nutritionalSel")}
                        </Label>
                        <Input id="sel" name="sel" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="fibre">
                          {tProducts("nutritionalFibre")}
                        </Label>
                        <Input id="fibre" name="fibre" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="energie">
                          {tProducts("nutritionalEnergie")}
                        </Label>
                        <Input id="energie" name="energie" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? tCommon("loading") : tProducts("createProduct")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            A list of all products in your catalog
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                disabled={isUpdating || isSearching}
                placeholder="Search products..."
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
                    {(selectedSubCategories.length > 0 ||
                      selectedCategories.length > 0 ||
                      dateFromFilter ||
                      dateToFilter) && (
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
                      <h4 className="font-medium">Sub Categories</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {subCategories.map((subCategory) => (
                          <div
                            key={subCategory.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`subcat-${subCategory.id}`}
                              checked={selectedSubCategories.includes(
                                subCategory.id
                              )}
                              onCheckedChange={() =>
                                toggleSubCategoryFilter(subCategory.id)
                              }
                            />
                            <Label htmlFor={`subcat-${subCategory.id}`}>
                              {subCategory.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
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
                  const params = new URLSearchParams();
                  params.set("page", "1");
                  params.set("limit", newLimit.toString());

                  // Preserve existing filters
                  if (searchTerm.trim())
                    params.set("search", searchTerm.trim());
                  if (selectedSubCategories.length > 0)
                    params.set("subCategoryId", selectedSubCategories[0]);
                  if (selectedCategories.length > 0)
                    params.set("categoryId", selectedCategories[0]);
                  if (dateFromFilter) params.set("dateFrom", dateFromFilter);
                  if (dateToFilter) params.set("dateTo", dateToFilter);

                  router.push(`${pathname}?${params.toString()}`);
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
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-b-transparent"></div>
              <span className="ml-2">Loading products...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableEmptyState
                    colSpan={6}
                    message={
                      searchTerm
                        ? tCommon("emptyState.noItemsFound")
                        : "No products found"
                    }
                    description={
                      searchTerm
                        ? tCommon("emptyState.tryDifferentSearch")
                        : "Products will appear here when they are created"
                    }
                    showAddButton={!searchTerm}
                    onAddClick={() => setIsCreateOpen(true)}
                    addButtonText="Create Product"
                  />
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Image
                          src={imageUrl(product.image) || "/placeholder.svg"}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.reference}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {product.description}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/subcategories?id=${product.subCategoryId}`}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {product.SubCategory?.name || "Unknown"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {product.createdAt instanceof Date
                          ? product.createdAt.toISOString().split("T")[0]
                          : new Date(product.createdAt)
                              .toISOString()
                              .split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingProduct(product)}
                            title={tProducts("viewDetails")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                            disabled={isUpdating || isDeleting === product.id}
                            title={tCommon("edit")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isDeleting === product.id || isUpdating}
                            title={tCommon("delete")}
                          >
                            {isDeleting === product.id ? (
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
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * limit + 1} to{" "}
          {Math.min(currentPage * limit, total)} of {total} products
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

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={() => setEditingProduct(null)}
      >
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
                        src={
                          imageUrl(editingProduct.image) || "/placeholder.svg"
                        }
                        alt={editingProduct.name}
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
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Product"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Product Details Dialog */}
      <Dialog
        open={!!viewingProduct}
        onOpenChange={(open) => !open && setViewingProduct(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{tProducts("productDetails")}</DialogTitle>
            <DialogDescription>{viewingProduct?.name}</DialogDescription>
          </DialogHeader>
          {viewingProduct && (
            <div className="grid gap-6 py-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <Image
                    src={imageUrl(viewingProduct.image) || "/placeholder.svg"}
                    alt={viewingProduct.name}
                    width={300}
                    height={300}
                    className="rounded-md object-cover w-full h-auto"
                  />
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      {tProducts("productName")}
                    </h3>
                    <p>{viewingProduct.name}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">
                      {tProducts("reference")}
                    </h3>
                    <p>{viewingProduct.reference || tCommon("unknown")}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">
                      {tProducts("productDescription")}
                    </h3>
                    <p>{viewingProduct.description || tCommon("unknown")}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">
                      {tCommon("subcategory")}
                    </h3>
                    <p>
                      {viewingProduct.SubCategory?.name || tCommon("unknown")}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">
                      {tCommon("category")}
                    </h3>
                    <p>
                      {viewingProduct.SubCategory?.category?.name ||
                        tCommon("unknown")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nutritional Information */}
              {viewingProduct.nutritionalInfo && (
                <div className="pt-4 border-t">
                  <h2 className="text-xl font-bold mb-4">
                    {tProducts("nutritionalInfo")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted rounded-md">
                      <h3 className="font-medium">
                        {tProducts("nutritionalType")}
                      </h3>
                      <p>{viewingProduct.nutritionalInfo.type}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <h3 className="font-medium">
                        {tProducts("nutritionalGraisse")}
                      </h3>
                      <p>{viewingProduct.nutritionalInfo.graisse}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <h3 className="font-medium">
                        {tProducts("nutritionalAcide")}
                      </h3>
                      <p>{viewingProduct.nutritionalInfo.acide}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <h3 className="font-medium">
                        {tProducts("nutritionalGlucide")}
                      </h3>
                      <p>{viewingProduct.nutritionalInfo.glucide}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <h3 className="font-medium">
                        {tProducts("nutritionalSucre")}
                      </h3>
                      <p>{viewingProduct.nutritionalInfo.sucre}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <h3 className="font-medium">
                        {tProducts("nutritionalProteine")}
                      </h3>
                      <p>{viewingProduct.nutritionalInfo.proteine}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <h3 className="font-medium">
                        {tProducts("nutritionalSel")}
                      </h3>
                      <p>{viewingProduct.nutritionalInfo.sel}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <h3 className="font-medium">
                        {tProducts("nutritionalFibre")}
                      </h3>
                      <p>{viewingProduct.nutritionalInfo.fibre}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <h3 className="font-medium">
                        {tProducts("nutritionalEnergie")}
                      </h3>
                      <p>{viewingProduct.nutritionalInfo.energie}</p>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button onClick={() => setViewingProduct(null)}>
                  {tCommon("close")}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
