"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Truck,
  Eye,
} from "lucide-react";
import {
  createFoodTruckAction,
  updateFoodTruckAction,
  deleteFoodTruckAction,
} from "@/lib/actions/food-trucks";
import { toast } from "sonner";
import Image from "next/image";

interface FoodTruckUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface FoodTruck {
  id: string;
  plate: string;
  licence: string;
  carteGrise: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  User?: FoodTruckUser;
}

interface FoodTrucksData {
  foodTrucks: FoodTruck[];
  total: number;
  page: number;
  totalPages: number;
}

interface FoodTrucksTableProps {
  initialData: FoodTrucksData;
  initialPage: number;
  initialSearch: string;
  availableUsers: FoodTruckUser[];
}

export default function FoodTrucksTable({
  initialData,
  initialPage,
  initialSearch,
  availableUsers,
}: FoodTrucksTableProps) {
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Data state
  const [foodTrucksData, setFoodTrucksData] = useState<FoodTrucksData>(initialData);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFoodTruck, setEditingFoodTruck] = useState<FoodTruck | null>(null);
  const [deletingFoodTruck, setDeletingFoodTruck] = useState<FoodTruck | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Update URL with new filters
  const updateURL = (params: {
    page?: number;
    search?: string;
  }) => {
    const newSearchParams = new URLSearchParams();

    if (params.page && params.page > 1)
      newSearchParams.set("page", params.page.toString());
    if (params.search) newSearchParams.set("search", params.search);

    const newUrl = `/dashboard/food-trucks${
      newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
    }`;

    startTransition(() => {
      router.push(newUrl);
    });
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== initialSearch) {
        updateURL({
          page: 1,
          search: searchTerm,
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({
      page,
      search: searchTerm,
    });
  };

  const handleCreateFoodTruck = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      const formData = new FormData(event.currentTarget);
      const result = await createFoodTruckAction(formData);
      if (result.success) {
        toast.success("Food truck created successfully!");
        setIsCreateOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create food truck");
      }
    } catch (error) {
      console.error("Error creating food truck:", error);
      toast.error("An unexpected error occurred while creating the food truck");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateFoodTruck = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsUpdating(true);
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const result = await updateFoodTruckAction(formData);
      if (result.success) {
        toast.success("Food truck updated successfully!");
        setEditingFoodTruck(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update food truck");
      }
    } catch (error) {
      console.error("Error updating food truck:", error);
      toast.error("An unexpected error occurred while updating the food truck");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteFoodTruck = async (foodTruckId: string) => {
    setIsDeleting(foodTruckId);

    try {
      const result = await deleteFoodTruckAction(foodTruckId);
      if (result.success) {
        toast.success("Food truck deleted successfully!");
        setDeletingFoodTruck(null);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete food truck");
      }
    } catch (error) {
      console.error("Error deleting food truck:", error);
      toast.error("An unexpected error occurred while deleting the food truck");
    } finally {
      setIsDeleting(null);
    }
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = foodTrucksData.totalPages;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Food Trucks
          </h1>
          <p className="text-muted-foreground">
            Manage food truck registrations and licenses
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Food Truck
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Food Truck</DialogTitle>
              <DialogDescription>
                Register a new food truck in the system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateFoodTruck}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="userId">Food Truck Owner</Label>
                  <Select name="userId" required disabled={isCreating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a food truck user" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="plate">License Plate</Label>
                  <Input 
                    disabled={isCreating} 
                    id="plate" 
                    name="plate" 
                    placeholder="e.g., ABC-123-XYZ" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="licence">Business License</Label>
                  <Input 
                    disabled={isCreating} 
                    id="licence" 
                    name="licence" 
                    placeholder="Business license number" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="carteGrise">Carte Grise (Registration Document)</Label>
                  <Input 
                    disabled={isCreating} 
                    id="carteGrise" 
                    name="carteGrise" 
                    type="file" 
                    accept="image/*,.pdf" 
                    required 
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload the vehicle registration document (Image or PDF)
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Food Truck"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Food Trucks</CardTitle>
          <CardDescription>
            A list of all registered food trucks (Page {foodTrucksData.page} of{" "}
            {foodTrucksData.totalPages}, {foodTrucksData.total} total food trucks)
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search food trucks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
                disabled={isPending}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead>Business License</TableHead>
                  <TableHead>Registration Doc</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>{tCommon("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foodTrucksData.foodTrucks.length === 0 ? (
                  <TableEmptyState
                    colSpan={6}
                    message={searchTerm ? "No food trucks found" : "No food trucks registered"}
                    description={searchTerm ? "Try a different search term" : "Food trucks will appear here when they are registered"}
                    showAddButton={!searchTerm}
                    onAddClick={() => setIsCreateOpen(true)}
                    addButtonText="Add Food Truck"
                  />
                ) : (
                  foodTrucksData.foodTrucks.map((foodTruck) => (
                    <TableRow key={foodTruck.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium">{foodTruck.User?.name || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{foodTruck.User?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {foodTruck.plate}
                        </Badge>
                      </TableCell>
                      <TableCell>{foodTruck.licence}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingImage(foodTruck.carteGrise)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        {foodTruck.createdAt instanceof Date
                          ? foodTruck.createdAt.toLocaleDateString()
                          : new Date(foodTruck.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingFoodTruck(foodTruck)}
                            disabled={isUpdating || isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingFoodTruck(foodTruck)}
                            disabled={isDeleting === foodTruck.id || isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {foodTrucksData.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 10 + 1} to{" "}
            {Math.min(currentPage * 10, foodTrucksData.total)} of {foodTrucksData.total}{" "}
            food trucks
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {generatePaginationNumbers().map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  disabled={isPending}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= foodTrucksData.totalPages || isPending}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Food Truck Dialog */}
      <Dialog open={!!editingFoodTruck} onOpenChange={() => setEditingFoodTruck(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Food Truck</DialogTitle>
            <DialogDescription>Update food truck information</DialogDescription>
          </DialogHeader>
          {editingFoodTruck && (
            <form onSubmit={handleUpdateFoodTruck}>
              <input type="hidden" name="id" value={editingFoodTruck.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-userId">Food Truck Owner</Label>
                  <Select 
                    name="userId" 
                    required 
                    disabled={isUpdating}
                    defaultValue={editingFoodTruck.userId}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-plate">License Plate</Label>
                  <Input
                    id="edit-plate"
                    name="plate"
                    defaultValue={editingFoodTruck.plate}
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-licence">Business License</Label>
                  <Input
                    id="edit-licence"
                    name="licence"
                    defaultValue={editingFoodTruck.licence}
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-carteGrise">Update Carte Grise (Optional)</Label>
                  <Input
                    id="edit-carteGrise"
                    name="carteGrise"
                    type="file"
                    accept="image/*,.pdf"
                    disabled={isUpdating}
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave empty to keep the current document
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Food Truck"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingFoodTruck} onOpenChange={() => setDeletingFoodTruck(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this food truck? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingFoodTruck && (
            <div className="py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-medium">Owner: {deletingFoodTruck.User?.name}</p>
                <p className="text-sm text-muted-foreground">
                  License Plate: {deletingFoodTruck.plate}
                </p>
                <p className="text-sm text-muted-foreground">
                  Business License: {deletingFoodTruck.licence}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingFoodTruck(null)}
              disabled={isDeleting === deletingFoodTruck?.id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingFoodTruck && handleDeleteFoodTruck(deletingFoodTruck.id)}
              disabled={isDeleting === deletingFoodTruck?.id}
            >
              {isDeleting === deletingFoodTruck?.id ? "Deleting..." : "Delete Food Truck"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewing Dialog */}
      <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Carte Grise Document</DialogTitle>
          </DialogHeader>
          {viewingImage && (
            <div className="py-4">
              {viewingImage.toLowerCase().endsWith('.pdf') ? (
                <div className="text-center">
                  <p className="mb-4">PDF Document</p>
                  <Button asChild>
                    <a href={viewingImage} target="_blank" rel="noopener noreferrer">
                      View PDF Document
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="relative w-full h-96">
                  <Image
                    src={viewingImage}
                    alt="Carte Grise"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
