"use client";

import {
  Building2,
  ChevronUp,
  Home,
  MapPin,
  Package,
  ShoppingCart,
  Tag,
  Users,
  Warehouse,
  User2,
  Gauge,
  Truck,
  UserRoundPen,
  ReceiptText,
  ChevronDown,
  UserCheck,
  FileText,
  Folder,
  FolderOpen,
  PackageCheck,
  Boxes,
  Hamburger,
  History,
  ClipboardList,
  Bell,
  Map,
  BookText,
} from "lucide-react";
import Icon from "@mdi/react";
import { mdiCashRegister } from "@mdi/js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/logout";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const t = useTranslations("navigation");
  const locale = useLocale();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // All menu items with translations
  const allItems = [
    {
      title: t("dashboard"),
      url: `/${locale}/dashboard`,
      icon: Gauge,
      roles: ["ADMIN", "DEPOT"], // Available for both roles
    },
    {
      title: "Dashboard (Mock Data)",
      url: `/${locale}/dashboard/mock`,
      icon: Home,
      roles: ["ADMIN"], // Admin only
    },
    {
      title: t("map"),
      url: `/${locale}/dashboard/map`,
      icon: Map,
      roles: ["ADMIN", "DEPOT"], // Available for both roles
    },
    {
      title: t("users"),
      url: `/${locale}/dashboard/users`,
      icon: Users,
      roles: ["ADMIN"], // Admin only
    },
    {
      title: t("companies"),
      url: `/${locale}/dashboard/companies`,
      icon: Building2,
      roles: ["ADMIN"], // Admin only
    },
    {
      title: t("categories"),
      url: `/${locale}/dashboard/categories`,
      icon: FolderOpen,
      roles: ["ADMIN"], // Admin only
    },
    {
      title: t("subcategories"),
      url: `/${locale}/dashboard/subcategories`,
      icon: Folder,
      roles: ["ADMIN"], // Admin only
    },
    {
      title: t("products"),
      url: `/${locale}/dashboard/products`,
      icon: Package,
      roles: ["ADMIN"], // Admin only
    },
    {
      title: t("stock"),
      url: `/${locale}/dashboard/stock`,
      icon: Warehouse,
      roles: ["ADMIN", "DEPOT"], // Available for both roles
      content: [
        {
          title: t("jacketStock"),
          url: `/${locale}/dashboard/stock/self`,
          icon: PackageCheck,
          roles: ["ADMIN"], // Available for both roles
        },
        {
          title: t("allStocks"),
          url: `/${locale}/dashboard/stock`,
          icon: Boxes,
          roles: ["ADMIN", "DEPOT"], // Admin only
        },
      ],
    },
    {
      title: t("orders"),
      url: `/${locale}/dashboard/stock`,
      icon: ShoppingCart,
      roles: ["ADMIN", "DEPOT"], // Available for both roles
      content: [
        {
          title: t("orderList"),
          url: `/${locale}/dashboard/orders`,
          icon: ClipboardList,
          roles: ["ADMIN", "DEPOT"], // Available for both roles
        },
        {
          title: t("ordersHistory"),
          url: `/${locale}/dashboard/order-history`,
          icon: History,
          roles: ["ADMIN", "DEPOT"], // Available for both roles
        },
      ],
    },
    {
      title: t("comptoir"),
      url: `/${locale}/dashboard/comptoir`,
      mdiIcon: mdiCashRegister,
      roles: ["ADMIN", "DEPOT", "MAGASIN"], // Available for both roles
      isMdi: true,
    },
    {
      title: t("camions"),
      url: `/${locale}/dashboard/trucks`,
      icon: Truck,
      roles: ["ADMIN", "DEPOT"], // Available for both roles
    },
    {
      title: t("chauffeurs"),
      url: `/${locale}/dashboard/drivers`,
      icon: UserCheck,
      roles: ["ADMIN", "DEPOT"], // Available for both roles
    },
    {
      title: t("factures"),
      url: `/${locale}/dashboard/invoices`,
      icon: FileText,
      roles: ["ADMIN", "DEPOT"], // Available for both roles
    },
    {
      title: t("foodTrucks"),
      url: `/${locale}/dashboard/food-trucks`,
      icon: Hamburger,
      roles: ["ADMIN", "DEPOT"], // Available for both roles
    },
    {
      title: t("etats"),
      url: `/${locale}/dashboard/etats`,
      icon: BookText,
      roles: ["ADMIN", "DEPOT"], // Available for both roles
    },
    {
      title: t("notifications"),
      url: `/${locale}/dashboard/notifications`,
      icon: Bell,
      roles: ["ADMIN", "DEPOT"], // Available for both roles
    },
  ];

  // Filter items based on user role
  const userRole = user?.role || "DEPOT"; // Default to DEPOT if no role
  const items = allItems.filter((item) => {
    // Check if user role is allowed for this item
    const hasAccess = item.roles.includes(userRole);

    // If item has content (submenu), filter the content as well
    if (hasAccess && item.content) {
      item.content = item.content.filter((subItem) =>
        subItem.roles?.includes(userRole)
      );
    }

    return hasAccess;
  });

  const handleLogout = async () => {
    try {
      await logoutAction();
      router.push(`/${locale}/auth/login`);
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: redirect anyway
      router.push(`/${locale}/auth/login`);
    }
  };
  return (
    <Sidebar
      side={locale === "ar" ? "right" : "left"}
      className={locale === "ar" ? "rtl" : "ltr"}
    >
      <SidebarHeader>
        <div className="flex items-center justify-center p-4">
          {mounted ? (
            <Image
              src={resolvedTheme === "dark" ? "/logo.png" : "/logo-black.png"}
              alt="Logo"
              width={500}
              height={500}
              className="h-24 w-auto"
            />
          ) : (
            <div className="h-24 w-auto" /> // Placeholder to prevent layout shift
          )}
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 ${
            locale === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`grid flex-1 text-left text-sm leading-tight ${
              locale === "ar" ? "text-right" : "text-left"
            }`}
          >
            <span className="truncate font-semibold">
              Jacket's Club Dashboard
            </span>
            <span className="truncate text-xs">Inventory Management</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // Special case for dashboard which should only highlight when exactly at the dashboard
                const isDashboardRoute = item.url === `/${locale}/dashboard`;
                const isActive = isDashboardRoute
                  ? pathname === `/${locale}/dashboard`
                  : pathname.startsWith(item.url);

                // For items with submenu, check if any of the subitems match the current path
                const hasActiveSubItem = item.content
                  ? item.content.some((subItem) => {
                      // For exact paths like /en/dashboard/stock/self, check exact match
                      if (subItem.url.split("/").length > 4) {
                        return pathname === subItem.url;
                      }
                      // For general paths like /en/dashboard/stock, check if path starts with it
                      return pathname.startsWith(subItem.url);
                    })
                  : false;

                if (item.content) {
                  return (
                    <Collapsible
                      defaultOpen={hasActiveSubItem}
                      className="group/collapsible"
                      key={item.title}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton data-active={hasActiveSubItem}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {item.content.map((subItem) => {
                            // For exact paths like /en/dashboard/stock/self, check exact match
                            // For general paths like /en/dashboard/stock, check if path starts with it
                            const isSubItemActive =
                              subItem.url.split("/").length > 4
                                ? pathname === subItem.url
                                : pathname.startsWith(subItem.url);
                            return (
                              <SidebarMenuSub
                                className="pb-2"
                                key={subItem.title}
                              >
                                <SidebarMenuSubItem>
                                  <Link
                                    className={cn(
                                      "flex flex-row gap-2 items-center",
                                      isSubItemActive &&
                                        "font-medium text-primary bg-sidebar-accent rounded-md"
                                    )}
                                    href={subItem.url}
                                  >
                                    <subItem.icon size={15} />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubItem>
                              </SidebarMenuSub>
                            );
                          })}
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={isActive}>
                      <Link href={item.url}>
                        {item.isMdi ? (
                          <Icon path={item.mdiIcon} size={1} />
                        ) : (
                          item.icon && <item.icon />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className={locale === "ar" ? "flex-row-reverse" : ""}
                >
                  <User2 /> {user?.name}
                  <ChevronUp
                    className={locale === "ar" ? "mr-auto" : "ml-auto"}
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard/account`}>
                    {t("account")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
