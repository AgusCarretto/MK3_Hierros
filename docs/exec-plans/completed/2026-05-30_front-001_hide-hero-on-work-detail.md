---
id: front-001
title: Ocultar Hero en ruta de detalle de trabajo
status: completed
created: 2026-05-30
updated: 2026-05-30
owners:
  - frontend
features:
  - feat-004
covers:
  - mk3_hierros_front/src/App.js
  - mk3_hierros_front/src/components/Hero.jsx
  - mk3_hierros_front/src/components/Navbar.jsx
  - mk3_hierros_front/src/components/styles/Hero.css
  - mk3_hierros_front/src/components/styles/workDetails.css
---

# Ocultar Hero en ruta de detalle de trabajo

## Purpose

Que al navegar a `/trabajo/:id` el usuario vea inmediatamente el contenido del trabajo sin tener que hacer scroll, eliminando el bloque visual del Hero en esa ruta.

## Problem statement

`<Hero />` está montado fuera de `<Routes>` en `App.js` y se renderiza en todas las rutas. En `/trabajo/:id` ocupa el viewport completo, dejando el contenido del trabajo por debajo del fold.

## Context and orientation

Análisis: `docs/analysis/2026-05-30_hero-hidden-on-work-detail.md`

Archivos de referencia:
- `mk3_hierros_front/src/App.js`
- `mk3_hierros_front/src/components/Hero.jsx`
- `mk3_hierros_front/src/components/workDetail.jsx`
- `mk3_hierros_front/src/components/styles/workDetails.css`
- `mk3_hierros_front/src/components/styles/Hero.css`

## Scope

### In scope

- Extraer la navbar (`hero-topbar`) del Hero a un componente `Navbar.jsx`.
- Condicionar el bloque `<section className="hero-section">` para que no se renderice en `/trabajo/:id`.
- Ajustar `padding-top` de `.work-detail-page` para compensar la navbar standalone.
- Actualizar `App.js` para montar `<Navbar />` siempre y `<Hero />` condicionado.

### Out of scope

- Cambios en backend o Android.
- Rediseño del Hero o la navbar.
- Modificar el comportamiento de `ScrollToSection`.

## Plan of work

1. Crear `Navbar.jsx` extrayendo el `<header className="hero-topbar">` de `Hero.jsx`.
2. Modificar `Hero.jsx` para importar `Navbar` y no duplicar el header; condicionar el bloque de presentación según la ruta.
3. Actualizar `App.js` para usar `<Navbar />` directamente (Hero se auto-condiciona, pero App puede simplificarse).
4. Ajustar `.work-detail-page { padding-top }` en `workDetails.css`.
5. Verificar con `npm start` que:
   - `/` muestra Hero completo.
   - `/nuestros-trabajos` muestra Hero completo.
   - `/contactanos` muestra Hero completo.
   - `/trabajo/:id` muestra solo navbar + contenido del trabajo sin scroll.

## Concrete steps

- [x] 1. Leer `Hero.jsx` y `Hero.css` completos para identificar clases del header.
- [x] 2. Crear `mk3_hierros_front/src/components/Navbar.jsx` con el `<header className="hero-topbar">` extraído de `Hero.jsx`.
- [x] 3. Crear `mk3_hierros_front/src/components/styles/Navbar.css` con los estilos `.navbar-standalone`.
- [x] 4. Editar `Hero.jsx`: importar `Navbar` y `useLocation`, condicionar el bloque `<section className="hero-section">` para que no renderice en `/trabajo/:id`; si la ruta es de detalle, retornar solo `<Navbar standalone />`.
- [x] 5. Editar `App.js`: sin cambio necesario — Hero ya se auto-condiciona internamente.
- [x] 6. Editar `workDetails.css`: ajustar `padding-top` de `.work-detail-page` de `160px` a `40px`.
- [x] 7. Correr `cd mk3_hierros_front && npm run build` y confirmar compilación correcta.

## Validation and acceptance

- `GET /` → Hero completo visible sin scroll.
- `GET /#/nuestros-trabajos` → Hero completo visible.
- `GET /#/contactanos` → Hero completo visible.
- `GET /#/trabajo/:id` → Solo navbar + contenido del trabajo al tope del viewport, sin Hero de presentación.
- `npm run build` pasa sin errores.

## Idempotence and rollback

- Rollback: revertir `Hero.jsx` a la versión sin condicional y eliminar `Navbar.jsx`. Sin efectos en backend ni Android.
- Los cambios son aditivos: nuevo archivo + condicional + ajuste de padding.

## Decision log

- Elegida Option B del análisis: extraer Navbar + condicionar Hero. Motivo: UX correcta (navbar disponible) + cambio limpio sin workarounds.

## Surprises and discoveries

_Completar durante ejecución._

## Progress

_Completar durante ejecución._

## Outcomes and retrospective

_Completar al cierre._
