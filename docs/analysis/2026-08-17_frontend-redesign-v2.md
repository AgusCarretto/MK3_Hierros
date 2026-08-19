# 2026-08-17 - Rediseño premium del frontend web (mk3_hierros_front)

## Problem statement

El frontend público (`mk3_hierros_front`) debe llevarse a un estándar visual e interactivo de nivel premium ("dark industrial sofisticado"), con micro-interacciones, feedback visual moderno (skeletons, toasts, empty states), tablas/listas — en la medida en que existan — con mejor UX, y una base técnica más rápida y mantenible. El pedido original mencionaba tablas de stock/inventario, pedidos y balances, y dashboards de KPIs; ninguno de esos existe en este proyecto (ver Findings). Se redefine el alcance al sitio real: catálogo público de trabajos de un taller de herrería.

## Context

Árbol relevante de `mk3_hierros_front/src/`:

- `App.js` — router (`HashRouter`), monta `Hero` + rutas.
- `components/Navbar.jsx`, `components/Hero.jsx` — navegación y sección de portada.
- `components/Home.jsx` — landing con secciones "Sobre nosotros", categorías (fetch a `/categorias`), CTA.
- `components/OurWork.jsx` + `components/WorkCard.jsx` — grilla de trabajos finalizados (fetch a `/trabajo/byStatus/Finalizado` o `/trabajo/getByCategoryFinished/:id`).
- `components/workDetail.jsx` — detalle de un trabajo con slider de imágenes (fetch a `/trabajo/:id` y `/trabajo/:id/images`).
- `components/ContactUs.jsx` — formulario que arma un deep-link de WhatsApp (`wa.me`), sin backend propio.
- `components/LoadingOverlay.jsx` — spinner de pantalla completa usado como único estado de carga.
- `assets/constants/colors.ts` — paleta sin uso real (accent violeta `#BB86FC`), no importada por ningún componente.
- Estilos: un `.css` plano por componente en `components/styles/`, más tokens en `App.css` (`:root { --surface-base, --accent, --font-heading: 'Space Grotesk', --font-body: 'Poppins', ... }`).
- Build: Create React App (`react-scripts@5.0.1`), deploy a GitHub Pages vía `gh-pages`, workflow `.github/workflows/deplot.yml` (`npm install && npm run build`, publica `mk3_hierros_front/build`).

## Findings

1. **Desfasaje de alcance con el pedido original.** `ARCHITECTURE.md` y `docs/FEATURES.md` (feat-001) confirman que `mk3_hierros_front` es exclusivamente un catálogo público de clientes (sin auth, sin panel admin). La gestión operativa (stock, estados, pedidos) vive en `mk3_hierros_android`, fuera de este alcance. Confirmado con el usuario: se redefine el brief al sitio real.
2. **CRA está deprecado** y limita la instalación de tooling moderno (Tailwind v4, plugins de Vite). No hay script `lint` propio; ESLint corre embebido en el webpack de `react-scripts`.
3. **Identidad visual ya existente y coherente**: dark theme con acento teal-mint (`--accent: #79ffe1`), no violeta como sugiere `colors.ts` (archivo muerto/desactualizado). Efectos `glow-panel` / `neon-pill` ya establecidos — se puede refinar en vez de reinventar.
4. **Fuentes declaradas pero nunca cargadas**: `--font-heading`/`--font-body` referencian Space Grotesk/Poppins sin ningún `<link>` ni `@font-face` — hoy cae silenciosamente a system-ui.
5. **Duplicación del cliente HTTP**: `Home.jsx`, `OurWork.jsx` y `workDetail.jsx` repiten el mismo patrón fetch + cache TTL en `localStorage` contra la misma base URL de Railway hardcodeada 5 veces en el código.
6. **Único test existente está roto**: `App.test.js` es el boilerplate de CRA ("renders learn react link"), no corresponde a ninguna UI real del proyecto.
7. **`LoadingOverlay` es el único estado de carga**: spinner de pantalla completa en las 3 vistas con fetch, en vez de skeletons contextuales.
8. **Formulario de contacto envía por WhatsApp deep-link** (`wa.me`), no hay endpoint de backend para contacto — este mecanismo debe preservarse intacto.
9. **`homepage` en `package.json`** (`https://AgusCarretto.github.io/MK3_Hierros`) y uso de `HashRouter` ya resuelven el ruteo en GitHub Pages (sin rewrites de servidor); debe preservarse al migrar de build tool.

## Options

### Option A — Migración a Vite + Tailwind v4 + Radix UI (manual, sin CLI de shadcn) + Framer Motion + Sonner

Pros:
- Vite resuelve la deuda de tooling (CRA deprecado) con riesgo mecánico y bajo.
- Mantener JS/JSX puro (sin adoptar shadcn vía CLI, que forzaría `.tsx` parcial) evita mezclar TypeScript a medias en un repo 100% JS.
- Radix UI da accesibilidad (foco, aria, teclado) para los pocos primitivos que hacen falta (Dialog/Sheet para el menú mobile, Tooltip).
- Tailwind v4 permite formalizar los design tokens que ya existen como CSS vars, sin reinventar la paleta.
- Cambios de build/deploy acotados (`base` + `outDir` en `vite.config`) evitan tocar el workflow de GitHub Actions.

Cons:
- Migración de build tool añade superficie de cambio no solicitada explícitamente en el brief original (mitigado: aprobado explícitamente por el usuario).
- Vitest reemplaza el único test existente; hay que reescribirlo (era boilerplate roto de todos modos).

### Option B — Mantener CRA, sumar Tailwind v3 (única versión con soporte estable vía PostCSS en CRA) + librerías de UI vía CDN/paquetes compatibles con Webpack 5 de `react-scripts`

Pros:
- Cero cambios en build/deploy; menor riesgo inmediato.

Cons:
- No resuelve la lentitud de dev/build ni la deprecación de CRA.
- Tailwind v4 (más rápido, mejor DX) no es compatible con el pipeline de PostCSS que expone `react-scripts` sin eyectar.
- Eyectar (`npm run eject`) para poder configurar libremente es irreversible y de alto riesgo — peor opción que migrar a Vite.

## Recommendation

Option A. Ya validada y aprobada explícitamente por el usuario en la sesión de brainstorming (incluida la migración a Vite y evitar TypeScript parcial vía shadcn CLI).

## Open questions

Ninguna abierta — todas las decisiones de alcance, tema visual (dark-only, sin light mode) y profundidad de refactor (rediseño completo por componente) fueron confirmadas por el usuario antes de este documento.

## Risks

- Migrar de CRA a Vite cambia el mecanismo de carga de assets estáticos (`%PUBLIC_URL%` → `%BASE_URL%`) y el directorio de test runner (Jest → Vitest); mitigado con verificación explícita de `npm run build` y smoke test post-migración.
- `base` de Vite mal configurado rompe el deploy en GitHub Pages (subpath `/MK3_Hierros/`); mitigado verificando `homepage` de `package.json` y probando el build servido localmente antes de mergear.
- Retirar `LoadingOverlay` de pantalla completa en favor de skeletons por vista es un cambio de comportamiento visible; no afecta contrato de datos ni backend.
