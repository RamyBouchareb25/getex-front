"use client";

import { useState, useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
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
import { useRouter, usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TableEmptyState from "@/components/table-empty-state";
import {
  createCamionAction,
  updateCamionAction,
  deleteCamionAction,
} from "@/lib/actions/camions";
import Link from "next/link";
import SalamiLoadingAnimation from "../ui/salami-loading";

interface Camion {
  id: string;
  name: string;
  plate: string;
  companyId: string;
  assignedOrderId?: string;
  assignedOrder?: {
    id: string;
  };
  company: {
    raisonSocial: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Company {
  id: string;
  raisonSocial: string;
}

interface CamionsData {
  camions: Camion[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

interface CamionsTableProps {
  initialData: CamionsData;
  companies: Company[];
  initialPage: number;
  initialSearch?: string;
  initialCompanyFilter: string;
  initialDateFromFilter: string;
  initialDateToFilter: string;
}

export default function CamionsTable({
  initialData,
  companies,
  initialPage,
  initialSearch,
  initialCompanyFilter,
  initialDateFromFilter,
  initialDateToFilter,
}: CamionsTableProps) {
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const tCamions = useTranslations("camions");
  const tCamionsTable = useTranslations("camionsTable");
  const tChauffeur = useTranslations("chauffeurs");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Data state
  const [camionsData, setCamionsData] = useState<CamionsData>(initialData);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");
  const [companyFilter, setCompanyFilter] = useState(initialCompanyFilter);
  const [dateFromFilter, setDateFromFilter] = useState(initialDateFromFilter);
  const [dateToFilter, setDateToFilter] = useState(initialDateToFilter);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCamion, setEditingCamion] = useState<Camion | null>(null);

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update URL with new filters
  const updateURL = (params: {
    page?: number;
    search?: string;
    companyId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    const newSearchParams = new URLSearchParams();

    if (params.page && params.page > 1)
      newSearchParams.set("page", params.page.toString());
    if (params.search) newSearchParams.set("search", params.search);
    if (params.companyId) newSearchParams.set("companyId", params.companyId);
    if (params.dateFrom) newSearchParams.set("dateFrom", params.dateFrom);
    if (params.dateTo) newSearchParams.set("dateTo", params.dateTo);

    const newUrl = `${pathname}${
      newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
    }`;

    startTransition(() => {
      router.push(newUrl);
    });
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== (initialSearch || "")) {
        updateURL({
          page: 1,
          search: searchTerm,
          companyId: companyFilter,
          dateFrom: dateFromFilter,
          dateTo: dateToFilter,
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
      companyId: companyFilter,
      dateFrom: dateFromFilter,
      dateTo: dateToFilter,
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({
      page,
      search: searchTerm,
      companyId: companyFilter,
      dateFrom: dateFromFilter,
      dateTo: dateToFilter,
    });
  };

  // Apply filters
  const applyFilters = () => {
    handleFilterChange();
  };

  // Reset filters
  const resetFilters = () => {
    setCompanyFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setSearchTerm("");
    updateURL({
      page: 1,
      search: "",
      companyId: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const handleCreateCamion = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await createCamionAction(formData);
      if (result.success) {
        setSuccess(tCamions("truckCreatedSuccess"));
        setIsCreateOpen(false);
        router.refresh();
      } else {
        setError(result.message || tCamions("truckCreateError"));
      }
    } catch (error) {
      console.error("Error creating truck:", error);
      setError(tCommon("error"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCamion = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await updateCamionAction(formData);
      if (result.success) {
        setSuccess(tCamions("truckUpdatedSuccess"));
        setEditingCamion(null);
        router.refresh();
      } else {
        setError(result.message || tCamions("truckUpdateError"));
      }
    } catch (error) {
      console.error("Error updating truck:", error);
      setError(tCommon("error"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCamion = async (id: string) => {
    setIsDeleting(id);
    setError(null);
    setSuccess(null);

    try {
      const result = await deleteCamionAction(id);
      if (result.success) {
        setSuccess(tCamionsTable("truckDeletedSuccess"));
        router.refresh();
      } else {
        setError(result.message || tCamionsTable("truckDeleteError"));
      }
    } catch (error) {
      console.error("Error deleting truck:", error);
      setError(tCommon("error"));
    } finally {
      setIsDeleting(null);
    }
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = camionsData.totalPages;

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
          <h1 className="text-3xl font-bold tracking-tight">{tCamionsTable("trucksTitle")}</h1>
          <p className="text-muted-foreground">
            {tCamionsTable("manageTrucks")}
          </p>
        </div>{" "}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {tCamionsTable("addTruck")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tCamionsTable("addTruck")}</DialogTitle>
              <DialogDescription>
                {tCommon("emptyState.getStarted")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCamion}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{tCommon("name")}</Label>
                  <Input id="name" name="name" required disabled={isCreating} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="plate">{tCamionsTable("plateNumber")}</Label>
                  <Input
                    id="plate"
                    name="plate"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="companyId">{tCommon("company")}</Label>
                  <Select name="companyId" required>
                    <SelectTrigger disabled={isCreating}>
                                            <SelectValue placeholder={tCamionsTable("selectCompany")} />
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
                  {isCreating ? tCommon("loading") : tCamionsTable("addTruck")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tCamionsTable("trucksTitle")}</CardTitle>
          <CardDescription>
            {tCamionsTable("trucksDescription", { 
              page: camionsData.page,
              totalPages: camionsData.totalPages,
              total: camionsData.total
            })}
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={tCamionsTable("searchTrucks")}
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
                    {(companyFilter || dateFromFilter || dateToFilter) && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{tCommon("company")}</h4>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                      >
                        <option value="">{tCamionsTable("anyCompany")}</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.raisonSocial}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        {tCamionsTable("dateRange")}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">
                            {tCamionsTable("from")}
                          </label>
                          <Input
                            type="date"
                            value={dateFromFilter}
                            onChange={(e) => setDateFromFilter(e.target.value)}
                            disabled={isPending}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">
                            {tCamionsTable("to")}
                          </label>
                          <Input
                            type="date"
                            value={dateToFilter}
                            onChange={(e) => setDateToFilter(e.target.value)}
                            disabled={isPending}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        disabled={isPending}
                      >
                        {tCamionsTable("resetFilters")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={applyFilters}
                        disabled={isPending}
                      >
                        {tCamionsTable("applyFilters")}
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
                  <TableHead>{tCamionsTable("plateNumber")}</TableHead>
                  <TableHead>{tCommon("company")}</TableHead>
                  <TableHead>{tCamionsTable("assignedOrder")}</TableHead>
                  <TableHead>{tCamionsTable("createdAt")}</TableHead>
                  <TableHead>{tCommon("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {camionsData.camions.length === 0 ? (
                  <TableEmptyState
                    colSpan={5}
                    message={
                      searchTerm
                        ? tCommon("emptyState.noItemsFound")
                        : tCamionsTable("noTrucksFound")
                    }
                    description={
                      searchTerm
                        ? tCommon("emptyState.tryDifferentSearch")
                        : tCamionsTable("noTrucksDescription")
                    }
                    showAddButton={!searchTerm}
                    onAddClick={() => setIsCreateOpen(true)}
                    addButtonText={tCamionsTable("addTruck")}
                  />
                ) : (
                  camionsData.camions.map((camion) => (
                    <TableRow key={camion.id}>
                      <TableCell className="font-medium">
                        {camion.name}
                      </TableCell>
                      <TableCell>{camion.plate}</TableCell>
                      <TableCell>
                        <Link
                          className="text-blue-600 hover:underline"
                          href={`/companies/${camion.companyId}`}
                        >
                          {camion.company?.raisonSocial || tCommon("unknown")}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {camion.assignedOrder ? (
                          <Link
                            className="text-blue-600 hover:underline"
                            href={`/orders?id=${camion.assignedOrderId}`}
                          >
                            #{camion.assignedOrder.id || tChauffeur("unknown")}
                          </Link>
                        ) : (
                          tCamionsTable("notAssigned")
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(camion.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingCamion(camion)}
                            disabled={isUpdating || isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCamion(camion.id)}
                            disabled={isDeleting === camion.id || isPending}
                          >
                            {isDeleting === camion.id ? (
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
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          {tCamionsTable("showingResults", {
            start: (currentPage - 1) * camionsData.limit + 1,
            end: Math.min(currentPage * camionsData.limit, camionsData.total),
            total: camionsData.total
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isPending}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("pagination.previous")}
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
            disabled={currentPage >= camionsData.totalPages || isPending}
          >
            {t("pagination.next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Camion Dialog */}
      <Dialog
        open={!!editingCamion}
        onOpenChange={() => setEditingCamion(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tCamionsTable("editTruck")}</DialogTitle>
          </DialogHeader>
          {editingCamion && (
            <form onSubmit={handleUpdateCamion}>
              <div className="grid gap-4 py-4">
                <input type="hidden" name="id" value={editingCamion.id} />
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">{tCommon("name")}</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingCamion.name}
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-plate">
                    {tCamionsTable("plateNumber")}
                  </Label>
                  <Input
                    id="edit-plate"
                    name="plate"
                    defaultValue={editingCamion.plate}
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-companyId">{tCommon("company")}</Label>
                  <Select
                    name="companyId"
                    defaultValue={editingCamion.companyId}
                  >
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
                      {tCommon("updating") || "Updating..."}
                    </>
                  ) : (
                    tCommon("update") || "Update"
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
