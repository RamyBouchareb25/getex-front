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
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  createStockAction,
  updateStockAction,
  deleteStockAction,
} from "@/lib/actions/stock";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface Stock {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  minQuantity: number;
  expirationDate: Date | string;
  reductionPercent: number;
  visible: boolean;
  ownerId: string;
  createdAt: Date | string;
  product?: {
    id: string;
    name: string;
  };
  owner?: {
    id: string;
    email: string;
    name: string;
    CompanyData?: {
      id: string;
      raisonSocial: string;
    };
  };
}

interface Product {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
}

interface PaginationData {
  stock: Stock[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function StockTable({
  stockData,
  products,
  users,
  currentPage,
  limit,
}: {
  stockData: PaginationData | Stock[];
  products: Product[];
  users: User[];
  currentPage: number;
  limit: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Handle both paginated and non-paginated data
  const stock = Array.isArray(stockData) ? stockData : stockData.stock;
  const totalPages = Array.isArray(stockData)
    ? Math.ceil(stock.length / limit)
    : stockData.totalPages;
  const total = Array.isArray(stockData) ? stock.length : stockData.total;

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [stockStatusFilter, setStockStatusFilter] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const productIdParam = searchParams.get("productId");
  const ownerIdParam = searchParams.get("ownerId");

  // Initialize filters from URL params
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setStockStatusFilter(searchParams.get("stockStatus") || "");
    setVisibilityFilter(searchParams.get("visibility") || "");
    setDateFromFilter(searchParams.get("dateFrom") || "");
    setDateToFilter(searchParams.get("dateTo") || "");
    if (productIdParam) {
      setSelectedProducts([productIdParam]);
    }
    if (ownerIdParam) {
      setSelectedOwners([ownerIdParam]);
    }
  }, [searchParams, productIdParam, ownerIdParam]);

  // Handle loading state when URL changes
  useEffect(() => {
    setIsSearching(false);
  }, [stock]);

  // Since we're using server-side pagination, we don't filter on client
  const filteredStock = stock;

  const isLowStock = (quantity: number, minQuantity: number) =>
    quantity <= minQuantity;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());

    // Preserve existing filters
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (selectedProducts.length > 0)
      params.set("productId", selectedProducts[0]);
    if (selectedOwners.length > 0) params.set("ownerId", selectedOwners[0]);
    if (stockStatusFilter) params.set("stockStatus", stockStatusFilter);
    if (visibilityFilter) params.set("visibility", visibilityFilter);
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
    if (selectedProducts.length > 0)
      params.set("productId", selectedProducts[0]);
    if (selectedOwners.length > 0) params.set("ownerId", selectedOwners[0]);
    if (stockStatusFilter) params.set("stockStatus", stockStatusFilter);
    if (visibilityFilter) params.set("visibility", visibilityFilter);
    if (dateFromFilter) params.set("dateFrom", dateFromFilter);
    if (dateToFilter) params.set("dateTo", dateToFilter);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setIsSearching(true);
    setSearchTerm("");
    setSelectedProducts([]);
    setSelectedOwners([]);
    setStockStatusFilter("");
    setVisibilityFilter("");
    setDateFromFilter("");
    setDateToFilter("");

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleProductFilter = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleOwnerFilter = (id: string) => {
    setSelectedOwners((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateStock = async (formData: FormData) => {
    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await createStockAction(formData);
      if (result.success) {
        setSuccess("Stock created successfully!");
        setIsCreateOpen(false);
      } else {
        setError(result.message || "Failed to create stock");
      }
    } catch (error) {
      console.error("Error creating stock:", error);
      setError("An unexpected error occurred while creating the stock");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateStock = async (formData: FormData) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateStockAction(formData);
      if (result.success) {
        setSuccess("Stock updated successfully!");
        setEditingStock(null);
      } else {
        setError(result.message || "Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      setError("An unexpected error occurred while updating the stock");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteStock = async (stockId: string) => {
    setIsDeleting(stockId);
    setError(null);
    setSuccess(null);

    try {
      const result = await deleteStockAction(stockId);
      if (result.success) {
        setSuccess("Stock deleted successfully!");
      } else {
        setError(result.message || "Failed to delete stock");
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
      setError("An unexpected error occurred while deleting the stock");
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
            Stock Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage inventory levels
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Stock</DialogTitle>
              <DialogDescription>Add inventory for a product</DialogDescription>
            </DialogHeader>
            <form action={handleCreateStock}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="productId">Product</Label>
                  <Select name="productId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minQuantity">Min Quantity</Label>
                    <Input
                      id="minQuantity"
                      name="minQuantity"
                      type="number"
                      defaultValue="1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reductionPercent">Reduction %</Label>
                    <Input
                      id="reductionPercent"
                      name="reductionPercent"
                      type="number"
                      step="0.01"
                      defaultValue="0"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    type="date"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ownerId">Owner</Label>
                  <Select name="ownerId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="visible"
                    name="visible"
                    value="true"
                    defaultChecked
                  />
                  <Label htmlFor="visible">Visible to customers</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Stock</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Inventory</CardTitle>
          <CardDescription>
            Current stock levels and product information
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                disabled={isUpdating || isSearching}
                placeholder="Search stock..."
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
                    {(selectedProducts.length > 0 ||
                      selectedOwners.length > 0 ||
                      stockStatusFilter ||
                      visibilityFilter ||
                      dateFromFilter ||
                      dateToFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Products</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`product-${product.id}`}
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() =>
                                toggleProductFilter(product.id)
                              }
                            />
                            <Label htmlFor={`product-${product.id}`}>
                              {product.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Owners</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`owner-${user.id}`}
                              checked={selectedOwners.includes(user.id)}
                              onCheckedChange={() => toggleOwnerFilter(user.id)}
                            />
                            <Label htmlFor={`owner-${user.id}`}>
                              {user.email}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Stock Status</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={stockStatusFilter}
                        onChange={(e) => setStockStatusFilter(e.target.value)}
                      >
                        <option value="">All Stock</option>
                        <option value="low">Low Stock</option>
                        <option value="normal">Normal Stock</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Visibility</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={visibilityFilter}
                        onChange={(e) => setVisibilityFilter(e.target.value)}
                      >
                        <option value="">All Items</option>
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                      </select>
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
                  if (selectedProducts.length > 0)
                    params.set("productId", selectedProducts[0]);
                  if (selectedOwners.length > 0)
                    params.set("ownerId", selectedOwners[0]);
                  if (stockStatusFilter)
                    params.set("stockStatus", stockStatusFilter);
                  if (visibilityFilter)
                    params.set("visibility", visibilityFilter);
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
              <span className="ml-2">Loading stock...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Min Qty</TableHead>
                  <TableHead>Reduction</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No stock items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStock.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/products?id=${item.product?.id}`}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {item.product?.name || "Unknown Product"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.quantity}
                          {isLowStock(item.quantity, item.minQuantity) && (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.price} DA</TableCell>
                      <TableCell>{item.minQuantity}</TableCell>
                      <TableCell>{item.reductionPercent}%</TableCell>
                      <TableCell>
                        {item.expirationDate instanceof Date
                          ? item.expirationDate.toISOString().split("T")[0]
                          : new Date(item.expirationDate)
                              .toISOString()
                              .split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/users?id=${item.owner?.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.owner?.name +
                            " " +
                            item.owner?.CompanyData?.raisonSocial || "Unknown"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {isLowStock(item.quantity, item.minQuantity) && (
                            <Badge variant="destructive">Low Stock</Badge>
                          )}
                          <Badge
                            variant={item.visible ? "default" : "secondary"}
                          >
                            {item.visible ? "Visible" : "Hidden"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingStock(item)}
                            disabled={isUpdating || isDeleting === item.id}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStock(item.id)}
                            disabled={isDeleting === item.id || isUpdating}
                          >
                            {isDeleting === item.id ? (
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

      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * limit + 1, total)} to{" "}
          {Math.min(currentPage * limit, total)} of {total} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isSearching}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isSearching}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isSearching}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Edit Stock Dialog */}
      <Dialog open={!!editingStock} onOpenChange={() => setEditingStock(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Stock</DialogTitle>
            <DialogDescription>Update stock information</DialogDescription>
          </DialogHeader>
          {editingStock && (
            <form action={handleUpdateStock}>
              <input type="hidden" name="id" value={editingStock.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Product</Label>
                  <Input
                    value={editingStock.product?.name || "Unknown Product"}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-quantity">Quantity</Label>
                    <Input
                      id="edit-quantity"
                      name="quantity"
                      type="number"
                      defaultValue={editingStock.quantity}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-price">Price</Label>
                    <Input
                      id="edit-price"
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingStock.price}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-minQuantity">Min Quantity</Label>
                    <Input
                      id="edit-minQuantity"
                      name="minQuantity"
                      type="number"
                      defaultValue={editingStock.minQuantity}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-reductionPercent">Reduction %</Label>
                    <Input
                      id="edit-reductionPercent"
                      name="reductionPercent"
                      type="number"
                      step="0.01"
                      defaultValue={editingStock.reductionPercent}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-expirationDate">Expiration Date</Label>
                  <Input
                    id="edit-expirationDate"
                    name="expirationDate"
                    type="date"
                    defaultValue={
                      editingStock.expirationDate instanceof Date
                        ? editingStock.expirationDate
                            .toISOString()
                            .split("T")[0]
                        : editingStock.expirationDate
                    }
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-visible"
                    name="visible"
                    value="true"
                    defaultChecked={editingStock.visible}
                  />
                  <Label htmlFor="edit-visible">Visible to customers</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Stock</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
