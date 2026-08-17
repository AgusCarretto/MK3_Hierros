import { cn } from "../../lib/cn";

const variants = {
  accent: "border-surface-border-strong bg-accent-soft text-accent",
  neutral: "border-surface-border bg-white/5 text-text-muted",
  danger: "border-danger/40 bg-danger/10 text-danger",
};

export function Badge({ className, variant = "accent", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
