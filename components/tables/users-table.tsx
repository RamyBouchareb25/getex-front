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
import { Plus, Search, Edit, Trash2, Filter, Key } from "lucide-react";
import {
  updateUserAction,
  deleteUserAction,
  resetUserPasswordAction,
  createUserAction,
} from "@/lib/actions/users";
import { useSearchParams } from "next/navigation";
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
  companyId?: string;
  createdAt: Date | string;
  company?: {
    id: string;
    raisonSocial: string;
  };
}

interface Company {
  id: string;
  raisonSocial: string;
  nif: string;
  nis: string;
  phone: string;
  address?: {
    id: string;
    wilaya: string;
    commune: string;
  };
}

interface Address {
  id: string;
  wilaya: string;
  commune: string;
}

export default function UsersTable({ users }: { users: User[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [changingPasswordFor, setChangingPasswordFor] = useState<User | null>(
    null
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");

  useEffect(() => {
    if (companyId) {
      setSearchTerm(companyId);
    }
  }, [companyId]);

  const filteredUsers = users.filter((user) => {
    const userEmail = user.email || "";
    const userName = user.name || "";
    const companyName = user.company?.raisonSocial || "";

    const matchesSearch =
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      selectedRoles.length === 0 || selectedRoles.includes(user.role);

    const dateString =
      user.createdAt instanceof Date
        ? user.createdAt.toISOString().split("T")[0]
        : user.createdAt;
    const matchesDate = !dateFilter || dateString.includes(dateFilter);

    return matchesSearch && matchesRole && matchesDate;
  });

  const handleCreateUser = async (formData: FormData) => {
    await createUserAction(formData);
    setIsCreateOpen(false);
  };

  const handleUpdateUser = async (formData: FormData) => {
    const result = await updateUserAction(formData);
    if (result.success) {
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUserAction(userId);
  };

  const handleResetPassword = async (formData: FormData) => {
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
    }
  };

  const toggleRoleFilter = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((item) => item !== role)
        : [...prev, role]
    );
  };

  return (
    <div className="space-y-6">
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
            <form action={handleCreateUser}>
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
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in the system</CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
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
                        onClick={() => {
                          setSelectedRoles([]);
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
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
                      {user.company ? (
                        <Link
                          href={`/dashboard/companies?id=${user.companyId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {user.company.raisonSocial}
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
                        : user.createdAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChangingPasswordFor(user)}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
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
                <Button type="submit">Update User</Button>
              </DialogFooter>
            </form>
          )}
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
              {successMessage && (
                <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
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
                  <Button type="submit">Reset Password</Button>
                </DialogFooter>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
