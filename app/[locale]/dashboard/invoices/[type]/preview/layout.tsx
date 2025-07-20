import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { Suspense } from "react";

export default function InvoicePreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="p-4">
        <Suspense fallback={<div>Loading breadcrumbs...</div>}>
          <DynamicBreadcrumb />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
