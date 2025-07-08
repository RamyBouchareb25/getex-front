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
import { Search, Edit, Filter, Building2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { updateAddressAction } from "@/lib/actions/addresses";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Address {
  id: string;
  wilaya: string;
  commune: string;
  createdAt: Date | string;
  company?: {
    id: string;
    raisonSocial: string;
  };
}

interface Company {
  id: string;
  raisonSocial: string;
}

export default function AddressesTable({
  addresses,
  companies,
}: {
  addresses: Address[];
  companies: Company[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [wilayaFilter, setWilayaFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Loading states
  const [isUpdating, setIsUpdating] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const addressId = searchParams.get("id");

  useEffect(() => {
    if (addressId) {
      const address = addresses.find((a) => a.id === addressId);
      if (address) {
        setSearchTerm(address.wilaya);
      }
    }
  }, [addressId, addresses]);

  const filteredAddresses = addresses.filter((address) => {
    const companyName = address.company?.raisonSocial || "";
    const matchesSearch =
      address.wilaya.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWilaya = !wilayaFilter || 
      address.wilaya.toLowerCase() === wilayaFilter.toLowerCase();

    const dateString = address.createdAt instanceof Date
      ? address.createdAt.toISOString().split("T")[0]
      : address.createdAt;
    const matchesDate = !dateFilter || dateString.includes(dateFilter);

    return matchesSearch && matchesWilaya && matchesDate;
  });

  const uniqueWilayas = Array.from(
    new Set(addresses.map((address) => address.wilaya))
  );

  const handleUpdateAddress = async (formData: FormData) => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await updateAddressAction(formData);
      if (result.success) {
        setSuccess("Address updated successfully!");
        setEditingAddress(null);
      } else {
        setError(result.message || "Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setError("An unexpected error occurred while updating the address");
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
          <h1 className="text-3xl font-bold tracking-tight">Addresses</h1>
          <p className="text-muted-foreground">Manage company addresses</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Addresses</CardTitle>
          <CardDescription>A list of all addresses in the system</CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search addresses..."
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
                  <TableHead>Wilaya</TableHead>
                  <TableHead>Commune</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAddresses.map((address) => (
                  <TableRow key={address.id}>
                    <TableCell className="font-medium">{address.wilaya}</TableCell>
                    <TableCell>{address.commune}</TableCell>
                    <TableCell>
                      {address.company ? (
                        <Link
                          href={`/dashboard/companies?id=${address.company.id}`}
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Building2 className="h-3 w-3" />
                          {address.company.raisonSocial}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">No company</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {address.createdAt instanceof Date
                        ? address.createdAt.toISOString().split("T")[0]
                        : address.createdAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAddress(address)}
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

      {/* Edit Address Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>Update address information</DialogDescription>
          </DialogHeader>
          {editingAddress && (
            <form action={handleUpdateAddress}>
              <input type="hidden" name="id" value={editingAddress.id} />
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-wilaya">Wilaya</Label>
                  <Input
                    id="edit-wilaya"
                    name="wilaya"
                    defaultValue={editingAddress.wilaya}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-commune">Commune</Label>
                  <Input
                    id="edit-commune"
                    name="commune"
                    defaultValue={editingAddress.commune}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Address</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
