import { Inbox } from "lucide-react";
import { Button } from "./ui/Button";

export function EmptyState({
  icon: Icon = Inbox,
  badge,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`glow-panel flex flex-col items-center gap-4 px-8 py-16 text-center ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-surface-border bg-white/5 text-accent">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      {badge && <span className="neon-pill">{badge}</span>}
      <h3 className="max-w-md font-heading text-xl text-text-primary">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-text-muted">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="ghost" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
