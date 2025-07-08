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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Printer,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createOrderAction,
  updateOrderAction,
  deleteOrderAction,
} from "@/lib/actions/orders";
import { clientAxios } from "@/lib/axios-interceptor";

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: {
    id: string;
    email: string;
    name?: string;
    CompanyData?: {
      raisonSocial: string;
    };
  };
  OrderItems?: Array<{
    id: string;
    quantity: number;
    stock: {
      price: number;
      expirationDate: string;
      reductionPercent: number;
      owner: {
        id: string;
        email: string;
        name?: string;
        CompanyData?: {
          raisonSocial: string;
        };
      };
      product: {
        name: string;
        description: string;
        image: string;
      };
    };
  }>;
}

interface User {
  id: string;
  email: string;
  name?: string;
  company?: {
    raisonSocial: string;
  };
}

export default function OrdersTable({
  orders,
  users,
}: {
  orders: Order[];
  users: User[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (userId) {
      setSearchTerm(userId);
    }
  }, [userId]);

  const filteredOrders = orders.filter((order) => {
    const userEmail = order.user?.email || "";
    const userName = order.user?.name || "";
    const senderCompany = order.user?.CompanyData?.raisonSocial || "";
    const receiverEmail = order.OrderItems?.[0]?.stock.owner.email || "";
    const receiverName = order.OrderItems?.[0]?.stock.owner.name || "";
    const receiverCompany =
      order.OrderItems?.[0]?.stock.owner.CompanyData?.raisonSocial || "";

    const matchesSearch =
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      senderCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receiverCompany.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || order.status === statusFilter;

    const dateString =
      order.createdAt instanceof Date
        ? order.createdAt.toISOString().split("T")[0]
        : order.createdAt;
    const matchesDate = !dateFilter || dateString.includes(dateFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "PENDING":
        return "secondary";
      case "ACCEPTED":
        return "outline";
      case "SHIPPING":
        return "outline";
      case "REJECTED":
        return "destructive";
      case "CANCELED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleCreateOrder = async (formData: FormData) => {
    await createOrderAction(formData);
    setIsCreateOpen(false);
  };

  const handleDeleteOrder = async (orderId: string) => {
    await deleteOrderAction(orderId);
  };

  const handlePrintDocument = async (orderId: string, documentType: string) => {
    try {
      // Replace with your actual endpoint
      const response = await fetch(
        `/api/orders/${orderId}/print/${documentType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.ok &&
        response.headers.get("content-type")?.includes("application/pdf")
      ) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        // Clean up the URL object after opening
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      } else {
        console.error("Failed to fetch PDF document");
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error("Error printing document:", error);
      // You might want to show a toast notification here
    }
  };

  const handlePrint = () => {
    if (!viewingOrder) return;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage customer orders and their status
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Create a new order for a customer
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateOrder}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="userId">Sender</Label>
                  <Select name="userId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sender" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email} - {user.name || "Unknown"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="receiverId">Receiver</Label>
                  <Select name="receiverId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select receiver" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email} - {user.name || "Unknown"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="shippingAddress">Shipping Address</Label>
                  <Input id="shippingAddress" name="shippingAddress" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="total">Total Amount</Label>
                  <Input
                    id="total"
                    name="total"
                    type="number"
                    step="0.01"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="SHIPPING">Shipping</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELED">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Order</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>A list of all customer orders</CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
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
                    {(statusFilter || dateFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Status</h4>
                      <Select
                        value={statusFilter || undefined}
                        onValueChange={(value) => setStatusFilter(value || "")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="ACCEPTED">Accepted</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                          <SelectItem value="SHIPPING">Shipping</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELED">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
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
                          setStatusFilter("");
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {order.user?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.user?.CompanyData?.raisonSocial ||
                            "Unknown Company"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {order.OrderItems?.at(0)?.stock.owner.name ||
                            "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.OrderItems?.at(0)?.stock.owner.CompanyData
                            ?.raisonSocial || "Unknown Company"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{order.total.toFixed(2)} DA</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.OrderItems?.length || 0} items</TableCell>
                    <TableCell>
                      {order.createdAt instanceof Date
                        ? order.createdAt.toISOString().split("T")[0]
                        : order.createdAt.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Printer className="h-4 w-4 mr-1" />
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handlePrintDocument(order.id, "bon-livraison")
                              }
                            >
                              Bon de Livraison
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handlePrintDocument(order.id, "bon-commande")
                              }
                            >
                              Bon de Commande
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handlePrintDocument(order.id, "bon-retour")
                              }
                            >
                              Bon de Retour
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handlePrintDocument(order.id, "facture")
                              }
                            >
                              Facture
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handlePrintDocument(order.id, "proforma")
                              }
                            >
                              Facture Proforma
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingOrder(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button> */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Order Dialog
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update order information</DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <form action={handleUpdateOrder}>
              <input type="hidden" name="id" value={editingOrder.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-total">Total Amount</Label>
                  <Input
                    id="edit-total"
                    name="total"
                    type="number"
                    step="0.01"
                    defaultValue={editingOrder.total}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={editingOrder.status} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="SHIPPING">Shipping</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELED">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-shippingAddress">Shipping Address</Label>
                  <Input
                    id="edit-shippingAddress"
                    name="shippingAddress"
                    defaultValue={editingOrder.shippingAddress}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Order</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog> */}

      {/* View Order Dialog */}
      <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
        <DialogContent className="sm:max-w-[60vw]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Order #{viewingOrder?.id}</span>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </DialogTitle>
            <DialogDescription>Order details</DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="py-4">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Order Information</h3>
                      <div className="grid grid-cols-2 gap-1 text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={getStatusColor(viewingOrder.status)}>
                          {viewingOrder.status}
                        </Badge>
                        <span className="text-muted-foreground">Date:</span>
                        <span>
                          {viewingOrder.createdAt instanceof Date
                            ? viewingOrder.createdAt.toISOString().split("T")[0]
                            : viewingOrder.createdAt}
                        </span>
                        <span className="text-muted-foreground">Total:</span>
                        <span>{viewingOrder.total.toFixed(2)} DA</span>
                        <span className="text-muted-foreground">Items:</span>
                        <span>{viewingOrder.OrderItems?.length || 0}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Parties</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex-1">
                          <p className="font-medium">
                            {viewingOrder.user?.name || "Unknown"}
                          </p>
                          <p className="text-muted-foreground">
                            {viewingOrder.user?.CompanyData?.raisonSocial ||
                              "Unknown Company"}
                          </p>
                          <p className="text-muted-foreground">
                            {viewingOrder.user?.email}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium">
                            {viewingOrder.user?.name || "Unknown"}
                          </p>
                          <p className="text-muted-foreground">
                            {viewingOrder.user?.CompanyData?.raisonSocial ||
                              "Unknown Company"}
                          </p>
                          <p className="text-muted-foreground">
                            {viewingOrder.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="items" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(viewingOrder.OrderItems || []).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.stock.product?.name || "Unknown Product"}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {item.stock.price.toFixed(2)} DA
                          </TableCell>
                          <TableCell>
                            {(item.quantity * item.stock.price).toFixed(2)} DA
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end mt-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="text-xl font-bold">
                        {viewingOrder.total.toFixed(2)} DA
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
