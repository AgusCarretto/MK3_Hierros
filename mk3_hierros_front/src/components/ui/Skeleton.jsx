import { cn } from "../../lib/cn";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-white/[0.06]", className)}
      {...props}
    />
  );
}
