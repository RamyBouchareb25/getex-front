"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfileAction, changePasswordAction } from "@/lib/account"
import { AlertCircle, Check, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AccountPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const mockUser = {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "ADMIN",
    company: "Admin Corp",
    createdAt: "2024-01-15",
    avatar: "/placeholder.svg?height=100&width=100",
  }

  async function handleUpdateProfile(formData: FormData) {
    setIsUpdating(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      await updateProfileAction(formData)
      setSuccessMessage("Profile updated successfully")
    } catch (error) {
      setErrorMessage("Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleChangePassword(formData: FormData) {
    setIsChangingPassword(true)
    setSuccessMessage("")
    setErrorMessage("")

    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match")
      setIsChangingPassword(false)
      return
    }

    try {
      await changePasswordAction(formData)
      setSuccessMessage("Password changed successfully")
      // Reset form
      const form = document.getElementById("password-form") as HTMLFormElement
      if (form) form.reset()
    } catch (error) {
      setErrorMessage("Failed to change password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-medium">{mockUser.name}</h3>
              <p className="text-sm text-muted-foreground">{mockUser.email}</p>
              <div className="mt-2">
                <Badge variant="outline">{mockUser.role}</Badge>
              </div>
            </div>
            <div className="w-full text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Company</span>
                <span>{mockUser.company}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Member since</span>
                <span>{mockUser.createdAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Update your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  {successMessage && (
                    <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <Check className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}
                  {errorMessage && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                  <form action={handleUpdateProfile} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" defaultValue={mockUser.name} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" defaultValue={mockUser.email} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <div className="flex items-center gap-2">
                        <Input id="avatar" name="avatar" type="file" accept="image/*" />
                      </div>
                    </div>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  {successMessage && (
                    <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <Check className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}
                  {errorMessage && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                  <form id="password-form" action={handleChangePassword} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" name="currentPassword" type="password" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" name="newPassword" type="password" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" required />
                    </div>
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? "Changing Password..." : "Change Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
