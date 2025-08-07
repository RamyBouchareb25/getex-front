import { Skeleton } from "@/components/ui/skeleton"
import SalamiLoadingAnimation from "@/components/ui/salami-loading"

export default function Loading() {
  return (
    <div className="relative space-y-6">
      {/* Foreground Salami Loading Animation */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
        <SalamiLoadingAnimation />
      </div>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Table Section */}
      <div className="rounded-md border">
        <div className="border-b p-4">
          <div className="flex items-center gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b p-4 last:border-b-0">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}
