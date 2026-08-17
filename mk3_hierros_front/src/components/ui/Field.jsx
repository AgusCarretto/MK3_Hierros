import { forwardRef } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/cn";

const fieldClasses = (invalid, valid, className) =>
  cn(
    "w-full rounded-2xl border bg-white/[0.03] px-5 py-4 text-sm text-text-primary outline-none transition-colors duration-200",
    "placeholder:text-[0.7rem] placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-text-soft",
    invalid
      ? "border-danger/70 focus:border-danger"
      : valid
        ? "border-accent/50 focus:border-accent"
        : "border-surface-border focus:border-accent",
    className
  );

export const Input = forwardRef(function Input(
  { className, invalid, valid, ...props },
  ref
) {
  return (
    <input ref={ref} className={fieldClasses(invalid, valid, className)} {...props} />
  );
});

export const Textarea = forwardRef(function Textarea(
  { className, invalid, valid, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={fieldClasses(invalid, valid, cn("resize-none", className))}
      {...props}
    />
  );
});

export function FieldHint({ invalid, valid, message }) {
  if (!message) return null;
  return (
    <p
      className={cn(
        "mt-2 flex items-center gap-1.5 text-xs",
        invalid ? "text-danger" : valid ? "text-accent" : "text-text-soft"
      )}
      role={invalid ? "alert" : undefined}
    >
      {invalid && <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
      {valid && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
      {message}
    </p>
  );
}
