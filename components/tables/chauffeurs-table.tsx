"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import {
  createChauffeurAction,
  updateChauffeurAction,
  deleteChauffeurAction,
} from "@/lib/actions/chauffeurs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import Link from "next/link";

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

interface ChauffeursData {
  chauffeurs: Chauffeur[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

interface ChauffeursTableProps {
  initialData: ChauffeursData;
  companies: Company[];
  initialPage: number;
  initialSearch: string;
  initialCompanyId: string;
  initialDateFrom: string;
  initialDateTo: string;
}

export default function ChauffeursTable({
  initialData,
  companies,
  initialPage,
  initialSearch,
  initialCompanyId,
  initialDateFrom,
  initialDateTo,
}: ChauffeursTableProps) {
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const tChauffeurs = useTranslations("chauffeurs");
  const tChauffeursTable = useTranslations("chauffeursTable");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Data state
  const [chauffeursData, setChauffeursData] =
    useState<ChauffeursData>(initialData);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [companyFilter, setCompanyFilter] = useState<string>(initialCompanyId);
  const [dateFromFilter, setDateFromFilter] = useState<string>(initialDateFrom);
  const [dateToFilter, setDateToFilter] = useState<string>(initialDateTo);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingChauffeur, setEditingChauffeur] = useState<Chauffeur | null>(
    null
  );
  const [deletingChauffeur, setDeletingChauffeur] = useState<Chauffeur | null>(
    null
  );

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
      if (searchTerm !== initialSearch) {
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

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = chauffeursData.totalPages;

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

  const formatPhoneNumber = (phone: number) => {
    const phoneStr = phone.toString();
    if (phoneStr.startsWith("213")) {
      return phoneStr.replace(
        /^213(\d{3})(\d{2})(\d{2})(\d{2})/,
        "+213 $1 $2 $3 $4"
      );
    }
    return phoneStr.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "0$1 $2 $3 $4");
  };

  const handleCreateChauffeur = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsCreating(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await createChauffeurAction(formData);
      if (result.success) {
        toast.success(tChauffeursTable("driverCreatedSuccess"));
        setIsCreateOpen(false);
        // Refresh the current page to show the new driver
        router.refresh();
      } else {
        toast.error(
          result.message || tChauffeursTable("driverCreateError")
        );
      }
    } catch (error) {
      console.error("Error creating driver:", error);
      toast.error(tChauffeursTable("unexpectedError"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateChauffeur = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await updateChauffeurAction(formData);
      if (result.success) {
        toast.success(tChauffeursTable("driverUpdatedSuccess"));
        setEditingChauffeur(null);
        // Refresh the current page to show the updated driver
        router.refresh();
      } else {
        toast.error(
          result.message || tChauffeursTable("driverUpdateError")
        );
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      toast.error(
        tChauffeurs("unexpectedError") ||
          "An unexpected error occurred while updating the driver"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteChauffeur = async () => {
    if (!deletingChauffeur) return;

    setIsDeleting(deletingChauffeur.id);

    try {
      const result = await deleteChauffeurAction(deletingChauffeur.id);
      if (result.success) {
        toast.success(tChauffeursTable("driverDeletedSuccess"));
        setDeletingChauffeur(null);
        // Refresh the current page to show the updated list
        router.refresh();
      } else {
        toast.error(
          result.message || tChauffeursTable("driverDeleteError")
        );
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error(
        tChauffeurs("unexpectedError") ||
          "An unexpected error occurred while deleting the driver"
      );
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tChauffeursTable("driversTitle")}
          </h1>
          <p className="text-muted-foreground">
            {tChauffeursTable("manageDrivers")}
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {tChauffeursTable("addDriver")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {tChauffeursTable("addDriver")}
              </DialogTitle>
              <DialogDescription>
                {tChauffeursTable("addDriverDescription")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateChauffeur}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{tCommon("name")}</Label>
                  <Input id="name" name="name" required disabled={isCreating} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">{tCommon("phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="number"
                    required
                    disabled={isCreating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="companyId">{tCommon("company")}</Label>
                  <Select name="companyId" required>
                    <SelectTrigger disabled={isCreating}>
                      <SelectValue
                        placeholder={tChauffeursTable("selectCompany")}
                      />
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
                  {isCreating
                    ? tCommon("creating")
                    : tChauffeursTable("addDriver")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tChauffeursTable("driversTitle")}</CardTitle>
          <CardDescription>
            {tChauffeursTable("driversDescription", {
              page: chauffeursData.page,
              totalPages: chauffeursData.totalPages,
              total: chauffeursData.total
            })}
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={tChauffeursTable("searchDrivers")}
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
                      <Select
                        value={companyFilter}
                        onValueChange={setCompanyFilter}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={tChauffeursTable("selectCompany")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">{tCommon("all")}</SelectItem>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.raisonSocial}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        {tChauffeursTable("dateFrom")}
                      </h4>
                      <Input
                        type="date"
                        value={dateFromFilter}
                        onChange={(e) => setDateFromFilter(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        {tChauffeursTable("dateTo")}
                      </h4>
                      <Input
                        type="date"
                        value={dateToFilter}
                        onChange={(e) => setDateToFilter(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        disabled={isPending}
                      >
                        {tChauffeursTable("resetFilters")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={applyFilters}
                        disabled={isPending}
                      >
                        {tChauffeursTable("applyFilters")}
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
                  <TableHead>{tCommon("phone")}</TableHead>
                  <TableHead>{tCommon("company")}</TableHead>
                  <TableHead>
                    {tChauffeursTable("assignedOrder")}
                  </TableHead>
                  <TableHead>
                    {tChauffeursTable("createdAt")}
                  </TableHead>
                  <TableHead>{tCommon("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chauffeursData.chauffeurs.length === 0 ? (
                  <TableEmptyState
                    colSpan={6}
                    message={
                      searchTerm
                        ? tCommon("emptyState.noItemsFound")
                        : tChauffeursTable("noDriversFound")
                    }
                    description={
                      searchTerm
                        ? tCommon("emptyState.tryDifferentSearch")
                        : tChauffeursTable("noDriversDescription")
                    }
                  />
                ) : (
                  chauffeursData.chauffeurs.map((chauffeur) => (
                    <TableRow key={chauffeur.id}>
                      <TableCell className="font-medium">
                        {chauffeur.name}
                      </TableCell>
                      <TableCell>
                        {formatPhoneNumber(chauffeur.phone)}
                      </TableCell>
                      <TableCell>
                        <Link
                          className="text-blue-600 hover:underline"
                          href={`/companies/${chauffeur.companyId}`}
                        >
                          {chauffeur.company?.raisonSocial || "N/A"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {chauffeur.assignedOrderId ? (
                          <Link
                            className="text-blue-600 hover:underline"
                            href={`/orders/${chauffeur.assignedOrderId}`}
                          >
                            {chauffeur.assignedOrderId}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">
                            {tChauffeursTable("noAssignedOrder")}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(chauffeur.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingChauffeur(chauffeur)}
                            disabled={isUpdating || isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingChauffeur(chauffeur)}
                            disabled={isDeleting === chauffeur.id || isPending}
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
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {tChauffeursTable("showingResults", {
            start: (currentPage - 1) * 10 + 1,
            end: Math.min(currentPage * 10, chauffeursData.total),
            total: chauffeursData.total
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
            disabled={currentPage >= chauffeursData.totalPages || isPending}
          >
            {t("pagination.next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Chauffeur Dialog */}
      <Dialog
        open={!!editingChauffeur}
        onOpenChange={() => setEditingChauffeur(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {tChauffeursTable("editDriver")}
            </DialogTitle>
            <DialogDescription>
              {tChauffeursTable("editDriverDescription")}
            </DialogDescription>
          </DialogHeader>
          {editingChauffeur && (
            <form onSubmit={handleUpdateChauffeur}>
              <input type="hidden" name="id" value={editingChauffeur.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">{tCommon("name")}</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingChauffeur.name}
                    required
                    disabled={isUpdating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">{tCommon("phone")}</Label>
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
                  <Label htmlFor="edit-companyId">{tCommon("company")}</Label>
                  <Select
                    name="companyId"
                    defaultValue={editingChauffeur.companyId}
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
                  {isUpdating
                    ? tCommon("updating")
                    : tCommon("update")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingChauffeur}
        onOpenChange={() => setDeletingChauffeur(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {tChauffeursTable("deleteDriver")}
            </DialogTitle>
            <DialogDescription>
              {tChauffeursTable("deleteDriverConfirmation")}
            </DialogDescription>
          </DialogHeader>
          {deletingChauffeur && (
            <div className="py-4">
              <p className="text-sm">
                <strong>{tCommon("name")}:</strong> {deletingChauffeur.name}
              </p>
              <p className="text-sm">
                <strong>{tCommon("phone")}:</strong>{" "}
                {formatPhoneNumber(deletingChauffeur.phone)}
              </p>
              <p className="text-sm">
                <strong>{tCommon("company")}:</strong>{" "}
                {deletingChauffeur.company?.raisonSocial || "N/A"}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingChauffeur(null)}
              disabled={isDeleting === deletingChauffeur?.id}
            >
              {tCommon("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteChauffeur}
              disabled={isDeleting === deletingChauffeur?.id}
            >
              {isDeleting === deletingChauffeur?.id
                ? tCommon("deleting")
                : tCommon("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
