import { Skeleton } from "./ui/Skeleton";

export function CategoryGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function WorkGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="aspect-[4/5] w-full rounded-[var(--radius-card)]" />
      ))}
    </div>
  );
}

export function WorkDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="aspect-video w-full rounded-[var(--radius-panel)]" />
    </div>
  );
}
