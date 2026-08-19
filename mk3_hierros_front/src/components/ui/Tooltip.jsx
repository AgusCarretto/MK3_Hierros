import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export function TooltipProvider({ children }) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      {children}
    </TooltipPrimitive.Provider>
  );
}

export function Tooltip({ label, children }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={8}
          className="z-50 rounded-lg border border-surface-border bg-surface-panel-strong px-3 py-1.5 text-xs text-text-primary shadow-xl backdrop-blur-md"
        >
          {label}
          <TooltipPrimitive.Arrow className="fill-surface-panel-strong" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
