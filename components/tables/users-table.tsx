"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  Filter,
  Key,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  updateUserAction,
  deleteUserAction,
  resetUserPasswordAction,
  createUserAction,
} from "@/lib/actions/users";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  CompanyDataId?: string;
  createdAt: Date | string;
  CompanyData?: {
    id: string;
    raisonSocial: string;
  };
}

interface UsersData {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

interface UsersTableProps {
  initialData: UsersData;
  initialPage: number;
  initialSearch: string;
  initialRoles: string[];
  initialDateFilter: string;
}

export default function UsersTable({
  initialData,
  initialPage,
  initialSearch,
  initialRoles,
  initialDateFilter,
}: UsersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Data state
  const [usersData, setUsersData] = useState<UsersData>(initialData);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialRoles);
  const [dateFilter, setDateFilter] = useState<string>(initialDateFilter);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [changingPasswordFor, setChangingPasswordFor] = useState<User | null>(
    null
  );
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Message states
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Update URL with new filters
  const updateURL = (params: {
    page?: number;
    search?: string;
    roles?: string[];
    dateFilter?: string;
  }) => {
    const newSearchParams = new URLSearchParams();

    if (params.page && params.page > 1)
      newSearchParams.set("page", params.page.toString());
    if (params.search) newSearchParams.set("search", params.search);
    if (params.roles && params.roles.length > 0) {
      params.roles.forEach((role) => newSearchParams.append("roles", role));
    }
    if (params.dateFilter) newSearchParams.set("dateFilter", params.dateFilter);

    const newUrl = `/dashboard/users${
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
          roles: selectedRoles,
          dateFilter,
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle filter changes
  const handleFilterChange = () => {
    updateURL({
      page: 1,
      search: searchTerm,
      roles: selectedRoles,
      dateFilter,
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({
      page,
      search: searchTerm,
      roles: selectedRoles,
      dateFilter,
    });
  };

  // Toggle role filter
  const toggleRoleFilter = (role: string) => {
    const newRoles = selectedRoles.includes(role)
      ? selectedRoles.filter((item) => item !== role)
      : [...selectedRoles, role];
    setSelectedRoles(newRoles);
  };

  // Apply filters
  const applyFilters = () => {
    handleFilterChange();
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedRoles([]);
    setDateFilter("");
    setSearchTerm("");
    updateURL({
      page: 1,
      search: "",
      roles: [],
      dateFilter: "",
    });
  };

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const formData = new FormData(event.currentTarget);
      const result = await createUserAction(formData);
      if (result.success) {
        setSuccessMessage("User created successfully!");
        setIsCreateOpen(false);
        // Refresh the current page to show the new user
        router.refresh();
      } else {
        setErrorMessage(result.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage("An unexpected error occurred while creating the user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateUser = async (formData: FormData) => {
    setIsUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await updateUserAction(formData);
      if (result.success) {
        setSuccessMessage("User updated successfully!");
        setEditingUser(null);
        router.refresh();
      } else {
        setErrorMessage(result.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage("An unexpected error occurred while updating the user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(userId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await deleteUserAction(userId);
      if (result.success) {
        setSuccessMessage("User deleted successfully!");
        setDeletingUser(null);
        router.refresh();
      } else {
        setErrorMessage(result.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("An unexpected error occurred while deleting the user");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleResetPassword = async (formData: FormData) => {
    setIsResettingPassword(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const result = await resetUserPasswordAction(formData);
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => setChangingPasswordFor(null), 2000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("Failed to reset password");
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = usersData.totalPages;

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
      {/* Success/Error Messages */}
      {successMessage && (
        <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="GROSSISTE">Grossiste</SelectItem>
                      <SelectItem value="POINT_DE_VENTE">
                        Point de Vente
                      </SelectItem>
                      <SelectItem value="GRANDE_SURFACE">
                        Grande Surface
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Company Information */}
                <div className="grid gap-2">
                  <Label>Company Information (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="raisonSocial">Company Name</Label>
                      <Input id="raisonSocial" name="raisonSocial" />
                    </div>
                    <div>
                      <Label htmlFor="nif">NIF</Label>
                      <Input id="nif" name="nif" />
                    </div>
                    <div>
                      <Label htmlFor="nis">NIS</Label>
                      <Input id="nis" name="nis" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" />
                    </div>
                    <div>
                      <Label htmlFor="rc">Registre de commerce</Label>
                      <Input id="rc" name="rc" />
                    </div>
                  </div>
                </div>
                {/* Address Information */}
                <div className="grid gap-2">
                  <Label>Address Information (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="wilaya">Wilaya</Label>
                      <Input id="wilaya" name="wilaya" />
                    </div>
                    <div>
                      <Label htmlFor="commune">Commune</Label>
                      <Input id="commune" name="commune" />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all users in the system (Page {usersData.page} of{" "}
            {usersData.totalPages}, {usersData.total} total users)
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
                disabled={isPending}
              />
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={isPending}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    {(selectedRoles.length > 0 || dateFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Roles</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "ADMIN",
                          "GROSSISTE",
                          "POINT_DE_VENTE",
                          "GRANDE_SURFACE",
                        ].map((role) => (
                          <div
                            key={role}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`role-${role}`}
                              checked={selectedRoles.includes(role)}
                              onCheckedChange={() => toggleRoleFilter(role)}
                            />
                            <Label htmlFor={`role-${role}`}>{role}</Label>
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
                        onClick={resetFilters}
                        disabled={isPending}
                      >
                        Reset Filters
                      </Button>
                      <Button
                        size="sm"
                        onClick={applyFilters}
                        disabled={isPending}
                      >
                        Apply Filters
                      </Button>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData.users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  usersData.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || "Unknown"}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.CompanyData ? (
                        <Link
                          href={`/dashboard/companies?id=${user.CompanyDataId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {user.CompanyData.raisonSocial}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">
                          No company
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.createdAt instanceof Date
                        ? user.createdAt.toISOString().split("T")[0]
                        : new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                          disabled={isUpdating || isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChangingPasswordFor(user)}
                          disabled={isResettingPassword || isPending}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingUser(user)}
                          disabled={isDeleting === user.id || isPending}
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

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * 10 + 1} to{" "}
          {Math.min(currentPage * 10, usersData.total)} of {usersData.total}{" "}
          users
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
            disabled={currentPage >= usersData.totalPages || isPending}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form action={handleUpdateUser}>
              <input type="hidden" name="id" value={editingUser.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingUser.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={editingUser.email}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select name="role" defaultValue={editingUser.role} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="GROSSISTE">Grossiste</SelectItem>
                      <SelectItem value="POINT_DE_VENTE">
                        Point de Vente
                      </SelectItem>
                      <SelectItem value="GRANDE_SURFACE">
                        Grande Surface
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update User"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {deletingUser && (
            <div className="py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-medium">{deletingUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  {deletingUser.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Role: {deletingUser.role}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingUser(null)}
              disabled={isDeleting === deletingUser?.id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingUser && handleDeleteUser(deletingUser.id)}
              disabled={isDeleting === deletingUser?.id}
            >
              {isDeleting === deletingUser?.id ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={!!changingPasswordFor}
        onOpenChange={() => setChangingPasswordFor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {changingPasswordFor?.email}
            </DialogDescription>
          </DialogHeader>
          {changingPasswordFor && (
            <div>
              <form action={handleResetPassword}>
                <input
                  type="hidden"
                  name="userId"
                  value={changingPasswordFor.id}
                />
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isResettingPassword}>
                    {isResettingPassword ? "Resetting..." : "Reset Password"}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
