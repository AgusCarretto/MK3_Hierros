import { useState } from "react";
import { NavLink } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/cn";

const LINKS = [
  { to: "/", label: "Inicio", end: true },
  { to: "/nuestros-trabajos", label: "Trabajos" },
  { to: "/contactanos", label: "Contacto" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-surface-border bg-surface-base/70 px-[6vw] py-5 backdrop-blur-xl">
      <div className="flex items-end gap-3.5">
        <span className="rounded-2xl border border-surface-border-strong bg-accent-soft px-4 py-3 font-heading text-xl tracking-[6px] text-accent">
          MK3
        </span>
        <span className="hidden text-xs uppercase tracking-[5px] text-text-muted sm:inline">
          Metal Lab
        </span>
      </div>

      <nav className="hidden md:block">
        <ul className="m-0 flex list-none gap-8 p-0">
          {LINKS.map((link) => (
            <li key={link.to} className="relative">
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "relative block pb-3 text-[0.85rem] uppercase tracking-[3px] transition-colors",
                    isActive ? "text-accent" : "text-text-primary hover:text-accent"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 h-px w-full bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-border text-text-primary transition-colors hover:border-accent hover:text-accent md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </Dialog.Trigger>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  className="fixed inset-y-0 right-0 z-50 flex w-[80vw] max-w-xs flex-col gap-8 border-l border-surface-border bg-surface-panel-strong p-8"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                >
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="font-heading text-sm uppercase tracking-[4px] text-text-muted">
                      Menú
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-border text-text-primary hover:border-accent hover:text-accent"
                        aria-label="Cerrar menú"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <ul className="m-0 flex list-none flex-col gap-6 p-0">
                    {LINKS.map((link) => (
                      <li key={link.to}>
                        <NavLink
                          to={link.to}
                          end={link.end}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              "text-lg uppercase tracking-[2px]",
                              isActive ? "text-accent" : "text-text-primary"
                            )
                          }
                        >
                          {link.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </header>
  );
};

export default Navbar;
