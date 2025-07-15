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
} from "lucide-react";

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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/lib/actions/logout";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';

export function AppSidebar() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const t = useTranslations('navigation');
  const locale = useLocale();

  // Menu items with translations
  const items = [
    {
      title: t('dashboard'),
      url: `/${locale}/dashboard`,
      icon: Gauge,
    },
    {
      title: "Dashboard (Mock Data)",
      url: `/${locale}/dashboard/mock`,
      icon: Home,
    },
    {
      title: t('users'),
      url: `/${locale}/dashboard/users`,
      icon: Users,
    },
    {
      title: t('companies'),
      url: `/${locale}/dashboard/companies`,
      icon: Building2,
    },
    {
      title: t('categories'),
      url: `/${locale}/dashboard/categories`,
      icon: Tag,
    },
    {
      title: t('subcategories'),
      url: `/${locale}/dashboard/subcategories`,
      icon: Tag,
    },
    {
      title: t('products'),
      url: `/${locale}/dashboard/products`,
      icon: Package,
    },
    {
      title: t('stock'),
      url: `/${locale}/dashboard/stock`,
      icon: Warehouse,
    },
    {
      title: t('orders'),
      url: `/${locale}/dashboard/orders`,
      icon: ShoppingCart,
    },
  ];

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
  console.log("AppSidebar loaded for locale:", locale);
  return (
    <Sidebar side={locale === 'ar' ? 'right' : 'left'} className={locale === 'ar' ? 'rtl' : 'ltr'}>
      <SidebarHeader>
        <div className={`flex items-center gap-2 px-4 py-2 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="size-4" />
          </div>
          <div className={`grid flex-1 text-left text-sm leading-tight ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
            <span className="truncate font-semibold">Admin Dashboard</span>
            <span className="truncate text-xs">Inventory Management</span>
          </div>
          <LanguageSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className={locale === 'ar' ? 'flex-row-reverse' : ''}>
                  <User2 /> {user?.name}
                  <ChevronUp className={locale === 'ar' ? 'mr-auto' : 'ml-auto'} />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard/account`}>{t('account')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
