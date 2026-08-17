import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/cn";

const variants = {
  primary:
    "bg-gradient-to-br from-accent to-accent-strong text-accent-ink shadow-[0_12px_30px_rgba(121,255,225,0.3)] hover:-translate-y-1",
  ghost:
    "bg-transparent border border-surface-border-strong text-accent hover:border-accent hover:shadow-[0_0_18px_rgba(121,255,225,0.2)] hover:-translate-y-1",
  subtle:
    "bg-white/5 border border-surface-border text-text-primary hover:bg-white/10 hover:border-accent/40",
};

const sizes = {
  default: "px-9 py-4 text-xs",
  sm: "px-5 py-2.5 text-xs",
  icon: "h-11 w-11 p-0",
};

export const Button = forwardRef(function Button(
  { className, variant = "primary", size = "default", asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-[0.2em] transition-all duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
