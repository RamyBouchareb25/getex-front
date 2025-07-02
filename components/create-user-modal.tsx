"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createUserAction } from "@/lib/users";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
  const [createCompany, setCreateCompany] = useState(false);
  const [createAddress, setCreateAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await createUserAction(formData);
      if (result.success) {
        onOpenChange(false);
        // Reset form
        setCreateCompany(false);
        setCreateAddress(false);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system with optional company and address
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="user">User Details</TabsTrigger>
              <TabsTrigger value="company" disabled={!createCompany}>
                Company
              </TabsTrigger>
              <TabsTrigger value="address" disabled={!createAddress}>
                Address
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>Basic user account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="createCompany"
                        checked={createCompany}
                        onCheckedChange={(checked) =>
                          setCreateCompany(checked ? true : false)
                        }
                      />
                      <Label htmlFor="createCompany">
                        Create company for this user
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="createAddress"
                        checked={createAddress}
                        onCheckedChange={(checked) =>
                          setCreateAddress(checked ? true : false)
                        }
                      />
                      <Label htmlFor="createAddress">
                        Create address for company
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Company details for the user
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="raisonSocial">Raison Social</Label>
                    <Input
                      id="raisonSocial"
                      name="raisonSocial"
                      required={createCompany}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nif">NIF</Label>
                      <Input id="nif" name="nif" required={createCompany} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nis">NIS</Label>
                      <Input id="nis" name="nis" required={createCompany} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required={createCompany}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>
                    Address details for the company
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="wilaya">Wilaya</Label>
                      <Input
                        id="wilaya"
                        name="wilaya"
                        required={createAddress}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="commune">Commune</Label>
                      <Input
                        id="commune"
                        name="commune"
                        required={createAddress}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
