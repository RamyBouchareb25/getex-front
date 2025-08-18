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
import { toast } from "sonner";
interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: Date | string;
  CompanyData?: {
    id: string;
    raisonSocial: string;
    art?: string;
  };
  FoodTruckData?: {
    id: string;
    plate: string;
    licence: string;
    carteGrise: string;
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
  const tCommon = useTranslations("common");
  const tUsers = useTranslations("users");
  const tValidation = useTranslations("validation");
  const tPagination = useTranslations("pagination");
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

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // Track selected role for create/edit dialogs
  const [createRole, setCreateRole] = useState<string>(initialRoles[0] || "");
  const [editRole, setEditRole] = useState<string>("");
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
    try {
      const formData = new FormData(event.currentTarget);
      // Add role from state (for Select component)
      formData.set("role", createRole);
      // Add art field
      // Already included via input name="art"
      // If FOOD_TRUCK, ensure plate, licence, carteGrise are included
      if (createRole === "FOOD_TRUCK") {
        // Already included via input names
      } else {
        formData.delete("plate");
        formData.delete("licence");
        formData.delete("carteGrise");
      }
      const result = await createUserAction(formData);
      if (result.success) {
        toast.success(tUsers("toasts.userCreatedSuccess"));
        setIsCreateOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || tUsers("toasts.userCreatedError"));
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(tUsers("toasts.userCreatedUnexpectedError"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsUpdating(true);
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      // Add role from state (for Select component)
      formData.set("role", editRole);
      // Add art field
      // Already included via input name="art"
      // If FOOD_TRUCK, ensure plate, licence, carteGrise are included
      if (editRole === "FOOD_TRUCK") {
        // Already included via input names
      } else {
        formData.delete("plate");
        formData.delete("licence");
        formData.delete("carteGrise");
      }
      const result = await updateUserAction(formData);
      if (result.success) {
        toast.success(tUsers("toasts.userUpdatedSuccess"));
        setEditingUser(null);
      } else {
        toast.error(result.message || tUsers("toasts.userUpdatedError"));
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(tUsers("toasts.userUpdatedUnexpectedError"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(userId);

    try {
      const result = await deleteUserAction(userId);
      if (result.success) {
        toast.success(tUsers("toasts.userDeletedSuccess"));
        setDeletingUser(null);
        router.refresh();
      } else {
        toast.error(result.message || tUsers("toasts.userDeletedError"));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(tUsers("toasts.userDeletedUnexpectedError"));
    } finally {
      setIsDeleting(null);
    }
  };

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    setIsResettingPassword(true);
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const result = await resetUserPasswordAction(formData);
      if (result.success) {
        toast.success(result.message);
        setTimeout(() => setChangingPasswordFor(null), 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(tUsers("toasts.passwordResetError"));
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
  // When opening the dialog, set editRole to editingUser.role
  useEffect(() => {
    if (!!editingUser) {
      setEditRole(editingUser.role);
    }
  }, [!!editingUser, editingUser?.role]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tUsers("title")}
          </h1>
          <p className="text-muted-foreground">
            {tUsers("manageUsersPermissions")}
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {tUsers("createUser")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{tUsers("createUser")}</DialogTitle>
              <DialogDescription>
                {tUsers("addNewUserToSystem")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{tCommon("name")}</Label>
                  <Input disabled={isCreating} id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="art">{tCommon("art")}</Label>
                  <Input disabled={isCreating} id="art" name="art" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{tCommon("email")}</Label>
                  <Input
                    disabled={isCreating}
                    id="email"
                    name="email"
                    type="email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{tCommon("password")}</Label>
                  <Input
                    disabled={isCreating}
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">
                    {tUsers("confirmPassword")}
                  </Label>
                  <Input
                    disabled={isCreating}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">{tUsers("role")}</Label>
                  <Select
                    disabled={isCreating}
                    name="role"
                    required
                    value={createRole}
                    onValueChange={setCreateRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={tUsers("selectRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">{tUsers("admin")}</SelectItem>
                      <SelectItem value="GROSSISTE">
                        {tUsers("grossiste")}
                      </SelectItem>
                      <SelectItem value="POINT_DE_VENTE">
                        {tUsers("pointDeVente")}
                      </SelectItem>
                      <SelectItem value="GRANDE_SURFACE">
                        {tUsers("grandeSurface")}
                      </SelectItem>
                      <SelectItem value="FOOD_TRUCK">
                        {tUsers("foodTruck")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* FOOD_TRUCK extra fields */}
                {createRole === "FOOD_TRUCK" && (
                  <div className="grid gap-2">
                    <Label>{tUsers("foodTruckDetails")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="plate">{tUsers("plate")}</Label>
                        <Input
                          disabled={isCreating}
                          id="plate"
                          name="plate"
                          required={createRole === "FOOD_TRUCK"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="licence">{tUsers("licence")}</Label>
                        <Input
                          disabled={isCreating}
                          id="licence"
                          name="licence"
                          required={createRole === "FOOD_TRUCK"}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="carteGrise">
                          {tUsers("carteGrise")}
                        </Label>
                        <Input
                          disabled={isCreating}
                          id="carteGrise"
                          name="carteGrise"
                          type="file"
                          accept="image/*"
                          required={createRole === "FOOD_TRUCK"}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* Company Information */}
                <div className="grid gap-2">
                  <Label>{tUsers("companyOptional")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="raisonSocial">
                        {tUsers("companyName")}
                      </Label>
                      <Input
                        disabled={isCreating}
                        id="raisonSocial"
                        name="raisonSocial"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nif">{tCommon("nif")}</Label>
                      <Input disabled={isCreating} id="nif" name="nif" />
                    </div>
                    <div>
                      <Label htmlFor="nis">{tCommon("nis")}</Label>
                      <Input disabled={isCreating} id="nis" name="nis" />
                    </div>
                    <div>
                      <Label htmlFor="phone">{tCommon("phone")}</Label>
                      <Input disabled={isCreating} id="phone" name="phone" />
                    </div>
                    <div>
                      <Label htmlFor="rc">{tUsers("registreCommerce")}</Label>
                      <Input disabled={isCreating} id="rc" name="rc" />
                    </div>
                  </div>
                </div>
                {/* Address Information */}
                <div className="grid gap-2">
                  <Label>{tUsers("addressOptional")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="wilaya">{tUsers("wilaya")}</Label>
                      <Input disabled={isCreating} id="wilaya" name="wilaya" />
                    </div>
                    <div>
                      <Label htmlFor="commune">{tUsers("commune")}</Label>
                      <Input
                        disabled={isCreating}
                        id="commune"
                        name="commune"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? tUsers("creating") : tUsers("createUserBtn")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tUsers("title")}</CardTitle>
          <CardDescription>
            {tUsers("listAllUsers")} (
            {tUsers("pageOf", {
              page: usersData.page,
              totalPages: usersData.totalPages,
              total: usersData.total,
            })
              .replace("{page}", usersData.page.toString())
              .replace("{totalPages}", usersData.totalPages.toString())
              .replace("{total}", usersData.total.toString())}
            )
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={tUsers("searchUsers")}
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
                    <span>{tCommon("filter")}</span>
                    {(selectedRoles.length > 0 || dateFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{tUsers("roles")}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "ADMIN",
                          "GROSSISTE",
                          "POINT_DE_VENTE",
                          "GRANDE_SURFACE",
                          "FOOD_TRUCK",
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
                      <h4 className="font-medium">{tUsers("dateCreated")}</h4>
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
                        {tUsers("resetFilters")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={applyFilters}
                        disabled={isPending}
                      >
                        {tUsers("applyFilters")}
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
                  <TableHead>{tCommon("name")}</TableHead>
                  <TableHead>{tCommon("email")}</TableHead>
                  <TableHead>{tUsers("role")}</TableHead>
                  <TableHead>{tCommon("company")}</TableHead>
                  <TableHead>{tUsers("createdAt")}</TableHead>
                  <TableHead>{tCommon("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData.users.length === 0 ? (
                  <TableEmptyState
                    colSpan={6}
                    message={
                      searchTerm
                        ? tCommon("emptyState.noItemsFound")
                        : tUsers("noUsersFound")
                    }
                    description={
                      searchTerm
                        ? tCommon("emptyState.tryDifferentSearch")
                        : tUsers("usersWillAppear")
                    }
                    showAddButton={!searchTerm}
                    onAddClick={() => setIsCreateOpen(true)}
                    addButtonText={tUsers("createUser")}
                  />
                ) : (
                  usersData.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || tUsers("unknown")}
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
                            href={`/dashboard/companies?id=${user.CompanyData.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {user.CompanyData.raisonSocial}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">
                            {tUsers("noCompany")}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.createdAt instanceof Date
                          ? user.createdAt.toISOString().split("T")[0]
                          : new Date(user.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
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
          {tUsers("showingUsers", {
            start: ((currentPage - 1) * 10 + 1).toString(),
            end: Math.min(currentPage * 10, usersData.total).toString(),
            total: usersData.total.toString(),
          })
            .replace("{start}", ((currentPage - 1) * 10 + 1).toString())
            .replace(
              "{end}",
              Math.min(currentPage * 10, usersData.total).toString()
            )
            .replace("{total}", usersData.total.toString())}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isPending}
          >
            <ChevronLeft className="h-4 w-4" />
            {tUsers("previous")}
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
            {tUsers("next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tUsers("editUser")}</DialogTitle>
            <DialogDescription>{tUsers("updateUserInfo")}</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleUpdateUser}>
              <input type="hidden" name="id" value={editingUser.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">{tUsers("fullName")}</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingUser.name}
                    required
                    disabled={isUpdating}
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
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    disabled={isUpdating}
                    name="role"
                    value={editRole || editingUser.role}
                    defaultValue={editingUser.role}
                    onValueChange={setEditRole}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">{tUsers("admin")}</SelectItem>
                      <SelectItem value="GROSSISTE">
                        {tUsers("grossiste")}
                      </SelectItem>
                      <SelectItem value="POINT_DE_VENTE">
                        {tUsers("pointDeVente")}
                      </SelectItem>
                      <SelectItem value="GRANDE_SURFACE">
                        {tUsers("grandeSurface")}
                      </SelectItem>
                      <SelectItem value="FOOD_TRUCK">
                        {tUsers("foodTruck")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* FOOD_TRUCK extra fields for edit */}
                {(editRole || editingUser.role) === "FOOD_TRUCK" && (
                  <div className="grid gap-2">
                    <Label>{tUsers("foodTruckDetails")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="edit-plate">{tUsers("plate")}</Label>
                        <Input
                          id="edit-plate"
                          name="plate"
                          defaultValue={editingUser.FoodTruckData?.plate || ""}
                          required={
                            (editRole || editingUser.role) === "FOOD_TRUCK"
                          }
                          disabled={isUpdating}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-licence">
                          {tUsers("licence")}
                        </Label>
                        <Input
                          id="edit-licence"
                          name="licence"
                          defaultValue={
                            editingUser.FoodTruckData?.licence || ""
                          }
                          required={
                            (editRole || editingUser.role) === "FOOD_TRUCK"
                          }
                          disabled={isUpdating}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="edit-carteGrise">
                          {tUsers("carteGrise")}
                        </Label>
                        <Input
                          id="edit-carteGrise"
                          name="carteGrise"
                          type="file"
                          accept="image/*"
                          disabled={isUpdating}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? tUsers("updating") : tUsers("updateUser")}
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
              {tUsers("confirmDeletion")}
            </DialogTitle>
            <DialogDescription>{tUsers("deleteConfirmText")}</DialogDescription>
          </DialogHeader>
          {deletingUser && (
            <div className="py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-medium">{deletingUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  {deletingUser.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tUsers("roleLabel")} {deletingUser.role}
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
              {tUsers("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingUser && handleDeleteUser(deletingUser.id)}
              disabled={isDeleting === deletingUser?.id}
            >
              {isDeleting === deletingUser?.id
                ? tUsers("deleting")
                : tUsers("deleteUserBtn")}
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
            <DialogTitle>{tUsers("resetPassword")}</DialogTitle>
            <DialogDescription>
              {tUsers("resetPasswordFor", {
                email: changingPasswordFor?.email || "",
              })}
            </DialogDescription>
          </DialogHeader>
          {changingPasswordFor && (
            <div>
              <form onSubmit={handleResetPassword}>
                <input
                  disabled={isResettingPassword}
                  type="hidden"
                  name="userId"
                  value={changingPasswordFor.id}
                />
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="oldPassword">{tUsers("oldPassword")}</Label>
                    <Input
                      disabled={isResettingPassword}
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">{tUsers("newPassword")}</Label>
                    <Input
                      disabled={isResettingPassword}
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">
                      {tUsers("confirmPassword")}
                    </Label>
                    <Input
                      disabled={isResettingPassword}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isResettingPassword}>
                    {isResettingPassword
                      ? tUsers("resetting")
                      : tUsers("resetPasswordBtn")}
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
