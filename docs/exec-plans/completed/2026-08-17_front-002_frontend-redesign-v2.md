---
id: front-002
title: Rediseño premium del frontend web (mk3_hierros_front)
status: completed
created: 2026-08-17
updated: 2026-08-17
owners:
  - frontend
features:
  - feat-005
covers:
  - mk3_hierros_front/**
  - .github/workflows/deplot.yml
  - docs/processes/dev-setup.md
  - docs/FEATURES.md
---

# Rediseño premium del frontend web (mk3_hierros_front)

## Purpose

Llevar el catálogo público de MK3 Hierros a un estándar visual e interactivo premium (dark industrial refinado, micro-interacciones, feedback visual moderno) sobre una base técnica moderna y rápida, sin alterar el contrato con el backend.

## Problem statement

Ver análisis completo: `docs/analysis/2026-08-17_frontend-redesign-v2.md`.

Resumen: CRA deprecado limita el tooling moderno; no hay librería de componentes/primitivos accesibles; los estados de carga son un único spinner de pantalla completa; hay duplicación de cliente HTTP en 3 componentes; fuentes declaradas nunca se cargan; `colors.ts` es un archivo muerto con paleta incorrecta; el único test existente está roto.

## Context and orientation

Análisis: `docs/analysis/2026-08-17_frontend-redesign-v2.md`.

Archivos afectados (principal): todo `mk3_hierros_front/src/`, `mk3_hierros_front/public/index.html`, `mk3_hierros_front/package.json`, nuevo `mk3_hierros_front/vite.config.js`. Config de deploy: `.github/workflows/deplot.yml` (solo si `outDir`/`base` lo requieren — objetivo es no tocarlo). Docs a sincronizar: `docs/processes/dev-setup.md` (comandos `npm start`/`npm test -- --watchAll=false` cambian con Vite/Vitest), `docs/FEATURES.md`.

## Scope

### In scope

- Migración de build: `react-scripts` → Vite (`vite`, `@vitejs/plugin-react`), manteniendo `HashRouter`, `homepage` de GH Pages y `build/` como `outDir`.
- Tailwind CSS v4 (`@tailwindcss/vite`) con tokens (`@theme`) que formalizan la paleta actual (`--surface-base`, `--accent` teal-mint, etc.).
- Primitivos accesibles: Radix UI (Dialog/Sheet para menú mobile, Tooltip) escritos a mano en JSX (sin CLI de shadcn, sin TypeScript parcial).
- Iconos: `lucide-react`.
- Animaciones: Framer Motion (`motion`).
- Feedback: `sonner` (toasts) + skeletons por vista (reemplazan `LoadingOverlay` de pantalla completa).
- Fuentes: `@fontsource/space-grotesk` y `@fontsource/poppins` (self-hosted) para que las CSS vars existentes carguen de verdad.
- Refactor: `src/lib/api.js` (base URL única) + hook de fetch-con-cache-TTL compartido, usado por `Home`, `OurWork`, `WorkDetail`.
- Componente `<EmptyState>`/`<ErrorState>` reutilizable con acción de reintento real.
- Rediseño completo (JSX + Tailwind) de: `Navbar`, `Hero`, `Home`, `OurWork`, `WorkCard`, `WorkDetail`, `ContactUs`. Eliminación del CSS legacy correspondiente a medida que cada componente migra.
- Eliminación de `assets/constants/colors.ts` (muerto, paleta incorrecta).
- Testing: Vitest + Testing Library reemplazando `react-scripts test`; smoke test real reemplazando el boilerplate roto de `App.test.js`.
- Lint: ESLint 9 flat config (`eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-refresh`), nuevo script `npm run lint`.
- Sincronizar `docs/processes/dev-setup.md` y `docs/FEATURES.md` con los comandos nuevos (`npm run dev`, `npm test`, `npm run lint`).

### Out of scope

- Cualquier cambio de contrato de API, DTOs o endpoints del backend.
- Panel de administración, stock/inventario, pedidos, balances o dashboards de KPIs — no existen en este proyecto (ver análisis, Finding 1).
- Light mode / toggle de tema — se profundiza el dark theme único (decisión confirmada con el usuario).
- Migración a TypeScript.
- Cambios en `mk3_hierros_back` o `mk3_hierros_android`.
- Mecanismo de envío del formulario de contacto (deep-link de WhatsApp) — se mejora la UX alrededor, no se reemplaza por un endpoint propio.

## Plan of work

### Fase 0 — Tooling base
Migrar CRA → Vite; mover `public/index.html` a raíz con `%BASE_URL%`; configurar `base` y `outDir` en `vite.config.js`; instalar Tailwind v4 + plugin de Vite y portar tokens de `App.css` a `@theme`; instalar Radix UI, lucide-react, Framer Motion, sonner, `@fontsource/*`; configurar Vitest + ESLint flat config; verificar `npm run dev` y `npm run build` funcionando con la app intacta (sin rediseño visual todavía).

### Fase 1 — Fundaciones compartidas
`src/lib/api.js` + hook de cache-TTL compartido (sin cambiar endpoints ni comportamiento de cache observable); componentes `ui/` mínimos sobre Radix (Dialog/Sheet, Tooltip, Skeleton, Badge, Button, Input, Textarea); `<Toaster />` en `App.jsx`; `<EmptyState>`/`<ErrorState>`.

### Fase 2 — Rediseño por componente
Navbar → Hero → Home → OurWork/WorkCard → WorkDetail → ContactUs, en ese orden (de layout global a hojas), retirando `LoadingOverlay` de pantalla completa y el CSS legacy de cada uno al migrarlo.

### Fase 3 — Limpieza y cierre
Eliminar `colors.ts` y cualquier `.css` legacy sin uso; sincronizar `docs/processes/dev-setup.md` y `docs/FEATURES.md`; validación final.

## Concrete steps

- [x] 1. Instalar Vite + `@vitejs/plugin-react`; crear `vite.config.js` (`base: '/MK3_Hierros/'`, `build.outDir: 'build'`); mover/adaptar `index.html`; actualizar scripts en `package.json` (`dev`, `build`, `preview`).
- [x] 2. Instalar Tailwind v4 + `@tailwindcss/vite`; definir `@theme` con los tokens actuales de `App.css`; confirmar que build+dev siguen funcionando sin cambios visuales aún.
- [x] 3. Instalar Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-tooltip`), `lucide-react`, `motion`, `sonner`, `@fontsource/space-grotesk`, `@fontsource/poppins`.
- [x] 4. Configurar Vitest (`vitest`, `jsdom`) + reemplazar `App.test.js` por un smoke test real; configurar ESLint 9 flat config y script `npm run lint`.
- [x] 5. Crear `src/lib/api.js` (base URL única) + hook de fetch-con-cache-TTL; migrar `Home.jsx`, `OurWork.jsx`, `workDetail.jsx` a usarlo sin cambiar endpoints/claves de cache observables.
- [x] 6. Crear primitivos `src/components/ui/` (Button, Input, Textarea, Dialog/Sheet, Tooltip, Skeleton, Badge) + `<EmptyState>`/`<ErrorState>` + montar `<Toaster />` en `App.jsx`.
- [x] 7. Rediseñar `Navbar.jsx` (sticky, glass-blur, drawer mobile con Radix Dialog, indicador de ruta activa); retirar `Navbar.css`.
- [x] 8. Rediseñar `Hero.jsx` (tipografía/contraste, fade-in, sin overflow horizontal en mobile); retirar `Hero.css`.
- [x] 9. Rediseñar `Home.jsx` (cards de categoría interactivas, skeleton grid); retirar `Home.css`.
- [x] 10. Rediseñar `OurWork.jsx` + `WorkCard.jsx` (stagger en grilla, chips de filtro, skeleton cards, `<EmptyState>`/`<ErrorState>`); retirar `OurWork.css`/`WorkCard.css`.
- [x] 11. Rediseñar `workDetail.jsx` (carrusel accesible con teclado/swipe, crossfade, skeleton, error con reintento); retirar `workDetails.css`.
- [x] 12. Rediseñar `ContactUs.jsx` (validación visual en tiempo real, estado "enviando", toast de confirmación antes de abrir WhatsApp — mismo mecanismo `wa.me`); retirar `ContactUs.css`.
- [x] 13. Retirar `LoadingOverlay.jsx` y `LoadingOverlay.css` (sin uso tras migrar los 3 fetch consumers a skeletons contextuales).
- [x] 14. Eliminar `src/assets/constants/colors.ts`.
- [x] 15. Actualizar `docs/processes/dev-setup.md` (comandos `npm run dev`, `npm test`, `npm run lint`) y `docs/FEATURES.md` (feat-005 + comandos `Verify` de feat-001/feat-004 actualizados).
- [x] 16. Correr `npm run lint`, `npm test`, `npm run build` en `mk3_hierros_front`; probar `npm run dev`/`preview` contra el backend real (Railway) en desktop y mobile viewport (Playwright headless, screenshots verificadas manualmente).

## Validation and acceptance

- `cd mk3_hierros_front && npm run lint` sin errores.
- `cd mk3_hierros_front && npm test` sin errores.
- `cd mk3_hierros_front && npm run build` genera `build/` sin errores ni warnings de tipo bloqueante.
- `npm run preview` sirve la app y las rutas `/`, `/nuestros-trabajos`, `/trabajo/:id`, `/contactanos` funcionan con el backend real (Railway) — catálogo, filtro por categoría, detalle con slider, envío de contacto por WhatsApp.
- Sin scroll horizontal ni cortes de layout en viewport mobile (375px) y desktop.
- `docs/FEATURES.md` y `docs/processes/dev-setup.md` reflejan los comandos reales post-migración.

## Idempotence and rollback

- Todo el trabajo vive en `feat/frontend-redesign-v2`; rollback = no mergear / `git revert` de los commits de esta rama.
- Migración de build es reversible commit a commit (Vite y CRA pueden coexistir mientras se valida cada fase antes de eliminar `react-scripts`).
- Ningún paso modifica `mk3_hierros_back` ni contratos de API — no hay rollback de datos que gestionar.

## Decision log

- Se descarta CLI de shadcn/ui para evitar TypeScript parcial en un repo 100% JS; se usan primitivos Radix UI escritos a mano en JSX (ver análisis, Option A).
- Se aprueba migración a Vite (aprobado explícitamente por el usuario en sesión de brainstorming, 2026-08-17).
- Se mantiene dark-only, sin light mode (aprobado explícitamente por el usuario).
- Rediseño completo por componente, no incremental (aprobado explícitamente por el usuario).
- Status de este plan se marcó `approved` directamente porque el diseño fue presentado y aprobado explícitamente por el usuario (stakeholder) en la misma sesión, sin secciones abiertas ni ambigüedad pendiente.
- Se agregó `eslint-plugin-react` (no estaba en el análisis original): el `no-unused-vars` de ESLint core no reconoce el uso de componentes dentro de JSX sin él — sin esto, cualquier import usado solo en JSX (la mayoría de los componentes de este proyecto) se marcaba como falso-positivo "unused".
- De la config `recommended` de `eslint-plugin-react-hooks@7` solo se adoptaron `rules-of-hooks` y `exhaustive-deps`. El resto del set (`set-state-in-effect`, `refs`, etc.) son heurísticas para React Compiler; este proyecto no lo usa, y esas reglas marcaban como error el patrón estándar de fetch-en-effect documentado por el propio React (`setLoading(true)` seguido de un fetch).
- `Navbar` y `Hero` se re-arquitecturaron respecto al análisis original: en vez de que `Hero` renderice su propio `Navbar` interno con un prop `standalone`, `App.jsx` monta un único `Navbar` sticky persistente en todas las rutas, y `Hero` (banner con imagen de fondo + CTAs) solo se muestra en `/`. El comportamiento original mostraba el Hero completo (con CTAs "Ver trabajos"/"Agendar consulta") arriba de esas mismas páginas — redundante. `feat-004` (ocultar Hero en `/trabajo/:id`) se preserva como caso particular de esta regla más general.
- `main.jsx`/`App.jsx`/`App.test.jsx`: Vite 8 usa el transform `oxc`, que — a diferencia de Babel/CRA — no permite JSX en archivos `.js` sin config adicional. Se renombraron a `.jsx` (`ARCHITECTURE.md` actualizado) en vez de configurar un loader especial.
- `vite.config.js` fija `server.port: 3001`: el backend real (`mk3_hierros_back/src/main.ts`) solo permite CORS desde `http://localhost:3001` en dev (además del origin de producción). No se tocó el backend; solo se alineó el puerto del dev server de Vite con el allowlist ya existente.
- Bug encontrado y corregido en `App.jsx` (heredado del original, solo visible en dev por el doble-invoke de efectos de StrictMode): `ScrollToSection` usaba un flag booleano `isFirstLoad` no idempotente; se reemplazó por comparación contra el `pathname` anterior vía `useRef`.
- `@fontsource` se importó por subset (`latin`/`latin-ext`) en vez del CSS "todos los scripts", evitando ~200KB de variantes (vietnamita, devanagari, etc.) que el sitio no necesita.

## Surprises and discoveries

- El brief original describía funcionalidad (stock/inventario/pedidos/balances/dashboards) que no existe en `mk3_hierros_front` — confirmado contra `ARCHITECTURE.md` y `docs/FEATURES.md` antes de escribir este plan; alcance redefinido con aprobación explícita del usuario.
- El `App.test.js` heredado (boilerplate de CRA, "renders learn react link") ya estaba roto antes de este trabajo — no ejecutaba contra ninguna UI real del proyecto.
- CORS del backend real bloqueó el primer intento de validación visual (dev server en un puerto no allowlisted); resuelto fijando el puerto de Vite a 3001 (ver decision log).
- Captura de pantalla `fullPage` de Playwright no dispara `whileInView` de Framer Motion (no hay scroll real durante esa captura) — contenido bajo el pliegue aparecía "en blanco" en las capturas automatizadas aunque el comportamiento real (con scroll de usuario) es correcto. Verificado con scroll programático real.

## Progress

Las 3 fases (tooling, fundaciones compartidas, rediseño por componente) y el cierre (limpieza + docs) se completaron en una sola sesión. Validado con `npm run lint`, `npm test`, `npm run build`, y verificación visual manual (Playwright headless + revisión de capturas) de las 4 rutas en desktop y mobile contra el backend real de Railway, incluyendo el flujo de envío de contacto por WhatsApp.

## Outcomes and retrospective

Alcance cumplido según lo aprobado: catálogo público migrado a Vite + Tailwind v4 + Radix UI + Framer Motion + Sonner, sin cambios de contrato con el backend. Deuda identificada en el análisis (cliente HTTP duplicado, fuentes nunca cargadas, `colors.ts` muerto, test roto, spinner único) fue resuelta como parte del mismo trabajo. Pendiente fuera de este plan (no solicitado, se deja como nota para un futuro plan de performance si se prioriza): el bundle JS principal (≈518KB / 165KB gzip) supera el umbral de advertencia de Vite por el conjunto de librerías nuevas (motion, radix, sonner, router); y `fondoHero.jpg` (≈1.7MB) es un asset preexistente pesado para LCP que no se optimizó por no ser parte del alcance de componentes aprobado.
