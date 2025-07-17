"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TableEmptyState from "@/components/table-empty-state";
import { 
  createChauffeurAction, 
  updateChauffeurAction, 
  deleteChauffeurAction 
} from "@/lib/actions/chauffeurs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Chauffeur {
  id: string;
  name: string;
  phone: number;
  companyId: string;
  company: {
    raisonSocial: string;
  };
  assignedOrderId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Company {
  id: string;
  raisonSocial: string;
}

interface PaginationData {
  chauffeurs: Chauffeur[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export default function ChauffeursTable({
  chauffeursData,
  companies,
  currentPage,
  limit,
}: {
  chauffeursData: PaginationData | Chauffeur[];
  companies: Company[];
  currentPage: number;
  limit: number;
}) {
  const t = useTranslations();
  const tCommon = useTranslations('common');
  const tChauffeurs = useTranslations('chauffeurs');
  const router = useRouter();
  const pathname = usePathname();

  // Handle both paginated and non-paginated data
  const chauffeurs = Array.isArray(chauffeursData) ? chauffeursData : chauffeursData.chauffeurs;
  const totalPages = Array.isArray(chauffeursData)
    ? Math.ceil(chauffeurs.length / limit)
    : chauffeursData.totalPages;
  const total = Array.isArray(chauffeursData) ? chauffeurs.length : chauffeursData.total;

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingChauffeur, setEditingChauffeur] = useState<Chauffeur | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string>("");
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
  const companyIdParam = searchParams.get("companyId");

  // Initialize filters from URL params
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setCompanyFilter(searchParams.get("companyId") || "");
    setDateFromFilter(searchParams.get("dateFrom") || "");
    setDateToFilter(searchParams.get("dateTo") || "");
  }, [searchParams]);

  // Handle loading state when URL changes
  useEffect(() => {
    setIsSearching(false);
  }, [chauffeurs]);

  // Since we're using server-side pagination, we don't filter on client
  const filteredChauffeurs = chauffeurs;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    params.set("limit", limit.toString());

    // Preserve existing filters
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (companyFilter) params.set("companyId", companyFilter);
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
    if (companyFilter) params.set("companyId", companyFilter);
    if (dateFromFilter) params.set("dateFrom", dateFromFilter);
    if (dateToFilter) params.set("dateTo", dateToFilter);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setIsSearching(true);
    setSearchTerm("");
    setCompanyFilter("");
    setDateFromFilter("");
    setDateToFilter("");

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const formatPhoneNumber = (phone: number) => {
    const phoneStr = phone.toString();
    return phoneStr.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '+$1 $2 $3 $4');
  };

  const handleCreateChauffeur = async (formData: FormData) => {
    setIsCreating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await createChauffeurAction(formData);
      if (result.success) {
        setSuccess(tChauffeurs('chauffeurCreated') || "Driver created successfully!");
        setIsCreateOpen(false);
      } else {
        setError(result.message || tChauffeurs('failedToCreateChauffeur') || "Failed to create driver");
      }
    } catch (error) {
      console.error("Error creating driver:", error);
      setError(tChauffeurs('unexpectedError') || "An unexpected error occurred while creating the driver");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateChauffeur = async (formData: FormData) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await updateChauffeurAction(formData);
      if (result.success) {
        setSuccess(tChauffeurs('chauffeurUpdated') || "Driver updated successfully!");
        setEditingChauffeur(null);
      } else {
        setError(result.message || tChauffeurs('failedToUpdateChauffeur') || "Failed to update driver");
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      setError(tChauffeurs('unexpectedError') || "An unexpected error occurred while updating the driver");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteChauffeur = async (id: string) => {
    setIsDeleting(id);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await deleteChauffeurAction(id);
      if (result.success) {
        setSuccess(tChauffeurs('chauffeurDeleted') || "Driver deleted successfully!");
      } else {
        setError(result.message || tChauffeurs('failedToDeleteChauffeur') || "Failed to delete driver");
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      setError(tChauffeurs('unexpectedError') || "An unexpected error occurred while deleting the driver");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div>
      {error && (
        <Alert className="mb-4 bg-destructive/15 text-destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-4 bg-green-500/15 text-green-500">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {tChauffeurs('createChauffeur') || "Create Driver"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tChauffeurs('createChauffeur') || "Create Driver"}</DialogTitle>
              <DialogDescription>
                {tChauffeurs('createChauffeurDescription') || "Add a new driver to the system"}
              </DialogDescription>
            </DialogHeader>
            <form action={handleCreateChauffeur}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{tCommon('name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">{tCommon('phone')}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="number"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="companyId">{tCommon('company')}</Label>
                  <Select name="companyId" required>
                    <SelectTrigger disabled={isCreating}>
                      <SelectValue placeholder={tChauffeurs('selectCompany') || "Select company"} />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.raisonSocial}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? tCommon('loading') : tChauffeurs('createChauffeur') || "Create Driver"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tChauffeurs('title') || "Drivers"}</CardTitle>
          <CardDescription>{tChauffeurs('description') || "A list of all drivers in the system"}</CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                disabled={isUpdating || isSearching}
                placeholder={tCommon('search') + ' ' + (tChauffeurs('title') || 'drivers').toLowerCase() + '...'}
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
                {isSearching ? tChauffeurs('searching') || "Searching..." : tCommon('search')}
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
                    <span>{tCommon('filter')}</span>
                    {(companyFilter || dateFromFilter || dateToFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{tCommon('company')}</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                      >
                        <option value="">{tChauffeurs('anyCompany') || "Any Company"}</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.raisonSocial}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">{tChauffeurs('dateRange') || "Date Range"}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">
                            {tChauffeurs('from') || "From"}
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
                            {tChauffeurs('to') || "To"}
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
                        {tChauffeurs('resetFilters') || "Reset Filters"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSearch}
                        disabled={isSearching}
                      >
                        {isSearching ? tChauffeurs('applying') || "Applying..." : tChauffeurs('applyFilters') || "Apply Filters"}
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
                  if (searchTerm.trim()) params.set("search", searchTerm.trim());
                  if (companyFilter) params.set("companyId", companyFilter);
                  if (dateFromFilter) params.set("dateFrom", dateFromFilter);
                  if (dateToFilter) params.set("dateTo", dateToFilter);

                  router.push(`${pathname}?${params.toString()}`);
                }}
              >
                <option value={5}>5 {tChauffeurs('perPage') || "per page"}</option>
                <option value={10}>10 {tChauffeurs('perPage') || "per page"}</option>
                <option value={20}>20 {tChauffeurs('perPage') || "per page"}</option>
                <option value={50}>50 {tChauffeurs('perPage') || "per page"}</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-b-transparent"></div>
              <span className="ml-2">{tChauffeurs('loadingChauffeurs') || "Loading drivers..."}</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tCommon('name')}</TableHead>
                  <TableHead>{tCommon('phone')}</TableHead>
                  <TableHead>{tCommon('company')}</TableHead>
                  <TableHead>{tChauffeurs('assignedOrder') || "Assigned Order"}</TableHead>
                  <TableHead>{tChauffeurs('createdAt') || "Created At"}</TableHead>
                  <TableHead>{tCommon('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChauffeurs.length === 0 ? (
                  <TableEmptyState 
                    colSpan={6} 
                    message={searchTerm ? tCommon('emptyState.noItemsFound') : tChauffeurs('noChauffeursFound') || "No drivers found"}
                    description={searchTerm ? tCommon('emptyState.tryDifferentSearch') : tChauffeurs('noChauffeursDescription') || "Drivers will appear here when they're added to the system"}
                  />
                ) : (
                  filteredChauffeurs.map((chauffeur) => (
                    <TableRow key={chauffeur.id}>
                      <TableCell className="font-medium">
                        {chauffeur.name}
                      </TableCell>
                      <TableCell>{formatPhoneNumber(chauffeur.phone)}</TableCell>
                      <TableCell>{chauffeur.company?.raisonSocial || tCommon('unknown')}</TableCell>
                      <TableCell>
                        {chauffeur.assignedOrderId ? (
                          <a 
                            href={`/dashboard/orders?id=${chauffeur.assignedOrderId}`} 
                            className="text-blue-600 hover:underline"
                          >
                            #{chauffeur.assignedOrderId}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">{tChauffeurs('notAssigned') || "Not assigned"}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(chauffeur.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingChauffeur(chauffeur)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteChauffeur(chauffeur.id)}
                            disabled={isDeleting === chauffeur.id}
                          >
                            {isDeleting === chauffeur.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
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

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {tChauffeurs('showing') || "Showing"} {Math.min((currentPage - 1) * limit + 1, total)} - {Math.min(currentPage * limit, total)} {tChauffeurs('of') || "of"} {total}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isSearching}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Show pages centered around current page
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
                      key={i}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isSearching}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isSearching}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Chauffeur Dialog */}
      <Dialog open={!!editingChauffeur} onOpenChange={() => setEditingChauffeur(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tChauffeurs('editChauffeur') || "Edit Driver"}</DialogTitle>
          </DialogHeader>
          {editingChauffeur && (
            <form action={handleUpdateChauffeur}>
              <div className="grid gap-4 py-4">
                <input type="hidden" name="id" value={editingChauffeur.id} />
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">{tCommon('name')}</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingChauffeur.name}
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">{tCommon('phone')}</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    type="number"
                    defaultValue={editingChauffeur.phone}
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-companyId">{tCommon('company')}</Label>
                  <Select name="companyId" defaultValue={editingChauffeur.companyId}>
                    <SelectTrigger disabled={isUpdating}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.raisonSocial}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      {tCommon('updating') || "Updating..."}
                    </>
                  ) : (
                    tCommon('update') || "Update"
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
