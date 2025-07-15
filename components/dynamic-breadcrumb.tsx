"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const formatPathSegment = (segment: string): string => {
  // Convert kebab-case and snake_case to Title Case
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  
  // Split the pathname into segments and filter out empty ones
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // Remove the first segment (language) if it exists
  const filteredSegments = pathSegments.length > 0 ? pathSegments.slice(1) : [];
  
  // Build breadcrumb items
  const breadcrumbItems = filteredSegments.map((segment, index) => {
    const href = "/" + pathSegments[0] + "/" + filteredSegments.slice(0, index + 1).join("/");
    const isLast = index === filteredSegments.length - 1;
    const displayName = formatPathSegment(segment);
    
    return {
      href,
      label: displayName,
      isLast,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
