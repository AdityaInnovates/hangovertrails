import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-line/70", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="mt-5 h-4 w-2/3" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
    </div>
  );
}