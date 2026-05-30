# 2026-05-30 - Hero visible en ruta de detalle de trabajo

## Problem statement

Al navegar directamente a `/trabajo/:id` el componente `Hero` (imagen de fondo + tagline + CTA) ocupa el 100% del viewport. El contenido del trabajo queda debajo del fold. El usuario tiene que hacer scroll para ver las fotos/datos del trabajo.

## Context

Archivos relevantes:

- `mk3_hierros_front/src/App.js` — root layout
- `mk3_hierros_front/src/components/Hero.jsx` — sección hero (navbar + bloque visual)
- `mk3_hierros_front/src/components/workDetail.jsx` — vista de detalle
- `mk3_hierros_front/src/components/styles/workDetails.css` — estilos del detalle
- `mk3_hierros_front/src/components/styles/Hero.css` — estilos del hero

Comportamiento actual: `<Hero />` está montado fuera de `<Routes>` en `App.js`, por lo que se renderiza incondicionalmente en todas las rutas. Existe un componente `ScrollToSection` que intenta hacer scroll al `<main>` al cambiar el pathname, pero un guard `isFirstLoad` lo deshabilita en la carga inicial directa, causando que la ruta `/trabajo/:id` arranque con el Hero tapando el contenido.

## Findings

1. `Hero.jsx` mezcla dos responsabilidades: navbar de navegación (siempre necesaria) y bloque de presentación visual (solo necesario en Home / inicio).
2. `ScrollToSection` es un workaround de scroll que no resuelve la carga inicial directa.
3. `.work-detail-page` usa `padding-top: 160px` asumiendo que el Hero siempre está presente y ocupa ese espacio.

## Options

### Option A — Condicionar Hero completo por ruta (sin separar navbar)

Pros: mínimo cambio de código.
Cons: en la ruta de detalle no hay navbar; mala UX para volver atrás.

### Option B — Extraer Navbar, condicionar solo el bloque de presentación del Hero (recomendada)

Pros: navbar disponible en todas las rutas; bloque visual desaparece en `/trabajo/:id`; limpio y declarativo.
Cons: un archivo nuevo (`Navbar.jsx`).

### Option C — Forzar scroll en carga inicial (quitar guard `isFirstLoad`)

Pros: cero archivos nuevos.
Cons: flash visual (Hero aparece y luego salta); experiencia "saltante"; Hero sigue renderizándose innecesariamente.

## Recommendation

**Option B.** Extraer la navbar del Hero a `Navbar.jsx` y condicionar el bloque `<section className="hero-section">` para que solo se pinte cuando la ruta no sea `/trabajo/:id`. Ajustar `padding-top` de `.work-detail-page` para compensar la altura de la navbar standalone.

## Open questions

- [x] ¿Se necesita navbar en la ruta de detalle? → Sí (para poder volver).
- [ ] ¿El botón "volver" del `WorkDetail` es suficiente o se quiere la nav completa? → Asumido: nav completa.

## Risks

- Bajo. Cambio aditivo (nuevo componente) + condicional en existente. Sin impacto en backend ni android.
- Único punto de atención: `padding-top` del work-detail debe coincidir con la altura real de la navbar standalone.
