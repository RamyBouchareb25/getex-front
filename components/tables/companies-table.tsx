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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Edit, Filter, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { updateCompanyAction } from "@/lib/actions/companies";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Company {
  id: string;
  raisonSocial: string;
  nif: string;
  nis: string;
  phone: string;
  userId?: string;
  addressId?: string;
  createdAt: Date | string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  address?: {
    id: string;
    wilaya: string;
    commune: string;
  };
}

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function CompaniesTable({
  companies,
}: {
  companies: Company[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [wilayaFilter, setWilayaFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Loading states
  const [isUpdating, setIsUpdating] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const companyId = searchParams.get("id");

  useEffect(() => {
    if (companyId) {
      const company = companies.find((c) => c.id === companyId);
      if (company) {
        setSearchTerm(company.raisonSocial);
      }
    }
  }, [companyId, companies]);

  const filteredCompanies = companies.filter((company) => {
    const userEmail = company.user?.email || "";
    const matchesSearch =
      company.raisonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.nif.includes(searchTerm) ||
      company.nis.includes(searchTerm) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWilaya = !wilayaFilter || 
      company.address?.wilaya.toLowerCase() === wilayaFilter.toLowerCase();

    const dateString = company.createdAt instanceof Date
      ? company.createdAt.toISOString().split("T")[0]
      : company.createdAt;
    const matchesDate = !dateFilter || dateString.includes(dateFilter);

    return matchesSearch && matchesWilaya && matchesDate;
  });

  const uniqueWilayas = Array.from(
    new Set(companies.map((company) => company.address?.wilaya).filter(Boolean))
  );

  const handleUpdateCompany = async (formData: FormData) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await updateCompanyAction(formData);
      if (result.success) {
        setSuccess("Company updated successfully!");
        setEditingCompany(null);
      } else {
        setError(result.message || "Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      setError("An unexpected error occurred while updating the company");
    } finally {
      setIsUpdating(false);
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
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage company information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
          <CardDescription>A list of all companies in the system</CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
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
                    {(wilayaFilter || dateFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Wilaya</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={wilayaFilter}
                        onChange={(e) => setWilayaFilter(e.target.value)}
                      >
                        <option value="">Any Wilaya</option>
                        {uniqueWilayas.map((wilaya) => (
                          <option key={wilaya} value={wilaya}>
                            {wilaya}
                          </option>
                        ))}
                      </select>
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
                          setWilayaFilter("");
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
                  <TableHead>Raison Social</TableHead>
                  <TableHead>NIF/NIS</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.raisonSocial}</TableCell>
                    <TableCell>
                      <div>
                        <div>NIF: {company.nif}</div>
                        <div>NIS: {company.nis}</div>
                      </div>
                    </TableCell>
                    <TableCell>{company.phone}</TableCell>
                    <TableCell>
                      {company.user ? (
                        <Link
                          href={`/dashboard/users?id=${company.userId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {company.user.email}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">No user</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {company.address ? (
                        <Link
                          href={`/dashboard/addresses?id=${company.addressId}`}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <MapPin className="h-3 w-3" />
                          {company.address.wilaya}, {company.address.commune}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">No address</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {company.createdAt instanceof Date
                        ? company.createdAt.toISOString().split("T")[0]
                        : company.createdAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCompany(company)}
                        >
                          <Edit className="h-4 w-4" />
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

      {/* Edit Company Dialog */}
      <Dialog open={!!editingCompany} onOpenChange={() => setEditingCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update company information</DialogDescription>
          </DialogHeader>
          {editingCompany && (
            <form action={handleUpdateCompany}>
              <input type="hidden" name="id" value={editingCompany.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-raisonSocial">Raison Social</Label>
                  <Input
                    id="edit-raisonSocial"
                    name="raisonSocial"
                    defaultValue={editingCompany.raisonSocial}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-nif">NIF</Label>
                    <Input
                      id="edit-nif"
                      name="nif"
                      defaultValue={editingCompany.nif}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-nis">NIS</Label>
                    <Input
                      id="edit-nis"
                      name="nis"
                      defaultValue={editingCompany.nis}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    type="tel"
                    defaultValue={editingCompany.phone}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-wilaya">Wilaya</Label>
                    <Input
                      id="edit-wilaya"
                      name="wilaya"
                      defaultValue={editingCompany.address?.wilaya || ""}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-commune">Commune</Label>
                    <Input
                      id="edit-commune"
                      name="commune"
                      defaultValue={editingCompany.address?.commune || ""}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Company</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
