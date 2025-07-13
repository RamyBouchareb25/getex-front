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
import { Search, Edit, Filter, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
  rc: string;
  phone: string;
  userId?: string;
  addressId?: string;
  createdAt: Date | string;
  User?: {
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

interface PaginationData {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CompaniesTable({
  companiesData,
  currentPage,
  limit,
}: {
  companiesData: PaginationData | Company[];
  currentPage: number;
  limit: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Handle both paginated and non-paginated data
  const companies = Array.isArray(companiesData) ? companiesData : companiesData.companies;
  const totalPages = Array.isArray(companiesData) ? Math.ceil(companies.length / limit) : companiesData.totalPages;
  const total = Array.isArray(companiesData) ? companies.length : companiesData.total;

  const [searchTerm, setSearchTerm] = useState("");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [wilayaFilter, setWilayaFilter] = useState<string>("");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");

  // Loading states
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const companyId = searchParams.get("id");

  // Initialize filters from URL params
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setWilayaFilter(searchParams.get("wilaya") || "");
    setDateFromFilter(searchParams.get("dateFrom") || "");
    setDateToFilter(searchParams.get("dateTo") || "");
  }, [searchParams]);

  // Handle loading state when URL changes
  useEffect(() => {
    setIsSearching(false);
  }, [companies]);

  useEffect(() => {
    if (companyId) {
      const company = companies.find((c) => c.id === companyId);
      if (company) {
        setSearchTerm(company.raisonSocial);
      }
    }
  }, [companyId, companies]);

  // Since we're using server-side pagination, we don't filter on client
  const filteredCompanies = companies;

  const uniqueWilayas = Array.from(
    new Set(companies.map((company) => company.address?.wilaya).filter(Boolean))
  );

  const handleSearch = () => {
    setIsSearching(true);
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', limit.toString());
    
    if (searchTerm) params.set('search', searchTerm);
    if (wilayaFilter) params.set('wilaya', wilayaFilter);
    if (dateFromFilter) params.set('dateFrom', dateFromFilter);
    if (dateToFilter) params.set('dateTo', dateToFilter);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setWilayaFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', limit.toString());
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleUpdateCompany = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData(event.currentTarget);
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

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set('page', newPage.toString());
    searchParams.set('limit', limit.toString());
    router.push(`${pathname}?${searchParams.toString()}`);
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
          <CardDescription>
            A list of all companies in the system
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                disabled={isUpdating || isSearching}
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="max-w-sm"
              />
              <Button 
                onClick={handleSearch} 
                size="sm"
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
                    {(wilayaFilter || dateFromFilter || dateToFilter) && (
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
                      <h4 className="font-medium">Date Range</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">From</label>
                          <Input
                            disabled={isUpdating || isSearching}
                            type="date"
                            value={dateFromFilter}
                            onChange={(e) => setDateFromFilter(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">To</label>
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
                  const searchParams = new URLSearchParams();
                  searchParams.set('page', '1');
                  searchParams.set('limit', newLimit.toString());
                  router.push(`${pathname}?${searchParams.toString()}`);
                }}
              >
                <option value={2}>2 per page</option>
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Raison Social</TableHead>
                  <TableHead>Numero d&apos;identification fiscal</TableHead>
                  <TableHead>
                    Numero d&apos;identification statistique
                  </TableHead>
                  <TableHead>Registre de commerce</TableHead>
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
                    <TableCell className="font-medium">
                      {company.raisonSocial}
                    </TableCell>
                    <TableCell className="text-center">{company.nif}</TableCell>{" "}
                    <TableCell className="text-center">{company.nis}</TableCell>{" "}
                    <TableCell className="text-center">{company.rc}</TableCell>
                    <TableCell>{company.phone}</TableCell>
                    <TableCell>
                      {company.User ? (
                        <Link
                          href={`/dashboard/users?id=${company.userId}`}
                          className="text-blue-600 hover:underline flex flex-col gap-2"
                        >
                          <div>{company.User.email}</div>
                          <div>{company.User.name}</div>
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">No user</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {company.address ? (
                        <div className="text-blue-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {company.address.wilaya}, {company.address.commune}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No address
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {company.createdAt instanceof Date
                        ? company.createdAt.toISOString().split("T")[0]
                        : new Date(company.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} companies
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

      {/* Edit Company Dialog */}
      <Dialog
        open={!!editingCompany}
        onOpenChange={() => setEditingCompany(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update company information</DialogDescription>
          </DialogHeader>
          {editingCompany && (
            <form onSubmit={handleUpdateCompany}>
              <input
                disabled={isUpdating}
                type="hidden"
                name="id"
                value={editingCompany.id}
              />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-raisonSocial">Raison Social</Label>
                  <Input
                    disabled={isUpdating}
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
                      disabled={isUpdating}
                      id="edit-nif"
                      name="nif"
                      defaultValue={editingCompany.nif}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-nis">NIS</Label>
                    <Input
                      disabled={isUpdating}
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
                    disabled={isUpdating}
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
                      disabled={isUpdating}
                      id="edit-wilaya"
                      name="wilaya"
                      defaultValue={editingCompany.address?.wilaya || ""}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-commune">Commune</Label>
                    <Input
                      disabled={isUpdating}
                      id="edit-commune"
                      name="commune"
                      defaultValue={editingCompany.address?.commune || ""}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Company"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
