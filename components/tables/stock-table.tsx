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
import { Plus, Search, Edit, Trash2, AlertTriangle, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createStockAction, updateStockAction, deleteStockAction } from "@/lib/actions/stock";

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

export default function StockTable({
  stock,
  products,
  users,
}: {
  stock: Stock[];
  products: Product[];
  users: User[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [stockStatusFilter, setStockStatusFilter] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("");

  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  useEffect(() => {
    if (productId) {
      setSelectedProducts([productId]);
    }
  }, [productId]);

  const isLowStock = (quantity: number, minQuantity: number) => quantity <= minQuantity;

  const filteredStock = stock.filter((item) => {
    const productName = item.product?.name || "";
    const ownerEmail = item.owner?.email || "";

    const matchesSearch =
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProduct =
      selectedProducts.length === 0 || selectedProducts.includes(item.productId);

    const matchesOwner =
      selectedOwners.length === 0 || selectedOwners.includes(item.ownerId);

    const matchesStockStatus =
      !stockStatusFilter ||
      (stockStatusFilter === "low" && isLowStock(item.quantity, item.minQuantity)) ||
      (stockStatusFilter === "normal" && !isLowStock(item.quantity, item.minQuantity));

    const matchesVisibility =
      !visibilityFilter ||
      (visibilityFilter === "visible" && item.visible) ||
      (visibilityFilter === "hidden" && !item.visible);

    return matchesSearch && matchesProduct && matchesOwner && matchesStockStatus && matchesVisibility;
  });

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
    await createStockAction(formData);
    setIsCreateOpen(false);
  };

  const handleUpdateStock = async (formData: FormData) => {
    await updateStockAction(formData);
    setEditingStock(null);
  };

  const handleDeleteStock = async (stockId: string) => {
    await deleteStockAction(stockId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-muted-foreground">Monitor and manage inventory levels</p>
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
                    <Input id="quantity" name="quantity" type="number" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" step="0.01" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minQuantity">Min Quantity</Label>
                    <Input id="minQuantity" name="minQuantity" type="number" defaultValue="1" />
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
                  <Input id="expirationDate" name="expirationDate" type="date" required />
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
                  <Checkbox id="visible" name="visible" value="true" defaultChecked />
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
          <CardDescription>Current stock levels and product information</CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stock..."
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
                    {(selectedProducts.length > 0 ||
                      selectedOwners.length > 0 ||
                      stockStatusFilter ||
                      visibilityFilter) && (
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
                          <div key={product.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`product-${product.id}`}
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => toggleProductFilter(product.id)}
                            />
                            <Label htmlFor={`product-${product.id}`}>{product.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Owners</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                        {users.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`owner-${user.id}`}
                              checked={selectedOwners.includes(user.id)}
                              onCheckedChange={() => toggleOwnerFilter(user.id)}
                            />
                            <Label htmlFor={`owner-${user.id}`}>{user.email}</Label>
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
                        <option value="">Any</option>
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
                        <option value="">Any</option>
                        <option value="visible">Visible</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProducts([]);
                          setSelectedOwners([]);
                          setStockStatusFilter("");
                          setVisibilityFilter("");
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
              {filteredStock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.product?.name || "Unknown Product"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.quantity}
                      {isLowStock(item.quantity, item.minQuantity) && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.minQuantity}</TableCell>
                  <TableCell>{item.reductionPercent}%</TableCell>
                  <TableCell>
                    {item.expirationDate instanceof Date
                      ? item.expirationDate.toISOString().split("T")[0]
                      : item.expirationDate}
                  </TableCell>
                  <TableCell>{item.owner?.email || "Unknown Owner"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant={item.visible ? "default" : "secondary"}>
                        {item.visible ? "Visible" : "Hidden"}
                      </Badge>
                      {isLowStock(item.quantity, item.minQuantity) && (
                        <Badge variant="destructive">Low Stock</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingStock(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStock(item.id)}
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
                        ? editingStock.expirationDate.toISOString().split("T")[0]
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
