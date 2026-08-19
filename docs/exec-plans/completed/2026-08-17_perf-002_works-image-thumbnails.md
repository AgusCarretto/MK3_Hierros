---
id: perf-002
title: Miniaturas on-demand para la grilla de trabajos
status: completed
created: 2026-08-17
updated: 2026-08-19
owners:
  - frontend
  - backend
features:
  - feat-006
covers:
  - mk3_hierros_back/src/Trabajos/workImage.service.ts
  - mk3_hierros_back/src/Trabajos/trabajo.controller.ts
  - mk3_hierros_back/package.json
  - mk3_hierros_front/src/lib/api.js
  - mk3_hierros_front/src/components/WorkCard.jsx
---

# Miniaturas on-demand para la grilla de trabajos

## Purpose

Que la grilla de "Nuestros Trabajos" y sus fotos carguen de forma percibida como instantánea, sirviendo miniaturas livianas en la grilla y reservando la resolución completa para el detalle/carrusel.

## Problem statement

Ver análisis completo: `docs/analysis/2026-08-17_works-images-performance.md`.

Resumen: la grilla pide la misma imagen de resolución completa (hasta 1179×1160px, 260-320KB) que usa el detalle, para tarjetas mucho más chicas. Un resize a 480px de ancho reduce el payload ~85% (validado con `sharp` sobre una imagen real de producción). El listado JSON y el resto del flujo de fetching/cache del frontend ya están optimizados (`front-002`, `perf-001`) y no requieren cambios.

## Context and orientation

Análisis: `docs/analysis/2026-08-17_works-images-performance.md`.

Archivos afectados:
- `mk3_hierros_back/src/Trabajos/workImage.service.ts` — nuevo método `getThumbnailById`.
- `mk3_hierros_back/src/Trabajos/trabajo.controller.ts` — nueva ruta `GET :id/images/:imageId/thumbnail`.
- `mk3_hierros_back/package.json` — nueva dependencia `sharp`.
- `mk3_hierros_front/src/lib/api.js` — nueva función `workThumbnailUrl`.
- `mk3_hierros_front/src/components/WorkCard.jsx` — usa la miniatura en vez de la imagen completa; blur-up/skeleton por card; `React.memo`.

## Scope

### In scope

- Endpoint nuevo de miniatura on-demand (sin persistencia, sin cambio de esquema — ver análisis, Option A).
- `WorkCard` consume la miniatura; `workDetail` (carrusel) sigue usando la imagen original sin cambios.
- Placeholder/skeleton por card mientras la miniatura individual carga (además del skeleton de grilla ya existente para el estado de carga de datos).
- `React.memo` en `WorkCard`.

### Out of scope

- Cambios en el endpoint de imagen original (`GET /trabajo/:id/images/:imageId`) ni en `workDetail.jsx`/carrusel.
- Cambios de esquema, migraciones o backfill de datos.
- Paginación, scroll infinito o virtualización (no justificado a 3 trabajos / 9 imágenes — ver análisis).
- Adopción de TanStack Query/SWR (no justificado — `useCachedFetch` ya cubre el caso de uso).
- El hallazgo colateral de `price`/`finalPrice` expuestos públicamente (no es un problema de performance; se deja registrado en el análisis para tratar aparte).
- Cambios en `mk3_hierros_android`.

## Plan of work

1. Backend: agregar `sharp`, método de servicio y ruta de thumbnail, ambos aditivos.
2. Frontend: nueva URL helper + `WorkCard` actualizado con placeholder por-imagen y memo.
3. Validar: `npm run build` en back y front, y prueba manual contra el backend real (tamaño/latencia del nuevo endpoint vs. el original, más verificación visual de la grilla).

## Concrete steps

- [x] 1. `cd mk3_hierros_back && npm install sharp`.
- [x] 2. `workImage.service.ts`: agregar `getThumbnailById(imageId)` que reusa `getImageById` y redimensiona con `sharp` (ancho 480px, `withoutEnlargement`, JPEG calidad 75 mozjpeg).
- [x] 3. `trabajo.controller.ts`: agregar `GET :id/images/:imageId/thumbnail` (mismo patrón de headers que el endpoint original, `Content-Type: image/jpeg` fijo, mismo `Cache-Control: immutable`).
- [x] 4. `cd mk3_hierros_back && npm run build` — sin errores de TypeScript.
- [x] 5. `mk3_hierros_front/src/lib/api.js`: agregar `workThumbnailUrl(workId, imageId)`.
- [x] 6. `WorkCard.jsx`: usar `workThumbnailUrl` para la imagen de grilla; agregar estado de carga por-imagen con skeleton/blur mientras decodifica; envolver el componente en `React.memo`.
- [x] 7. `cd mk3_hierros_front && npm run lint && npm test && npm run build`.
- [x] 8. Prueba manual contra el backend real, corrido localmente contra la base de Postgres de producción (Railway, vía TCP proxy público) con credenciales provistas por el usuario. Ver Surprises and discoveries para el bug encontrado y corregido en el camino.

## Validation and acceptance

- [x] `cd mk3_hierros_back && npm run build` sin errores.
- [x] `cd mk3_hierros_front && npm run lint && npm test && npm run build` sin errores.
- [x] `curl` al nuevo endpoint de thumbnail contra el backend real muestra una reducción de payload consistente con lo validado en el análisis: **260169 → 38181 bytes, -85.3%** (trabajo id 38, imagen id 30), idéntico al resultado offline del análisis original.
- [x] La grilla de trabajos en el navegador muestra las miniaturas correctamente, sin regresión visual (verificado con screenshot contra `mk3_hierros_front` corriendo local apuntado al backend local). El detalle/carrusel no se tocó (fuera de alcance, sin diff en `workDetail.jsx`).
- [x] Endpoint de imagen original (`GET /trabajo/:id/images/:imageId`) sin cambios de comportamiento — confirmado (200, `image/jpeg`, mismo `Cache-Control`).

## Idempotence and rollback

- Cambios 100% aditivos (ruta nueva, función nueva, sin tocar rutas/columnas existentes). Rollback = revertir los commits de esta rama; no hay estado persistido que limpiar (no hay cambio de esquema).
- El frontend puede volver a `workImageUrl` en `WorkCard` como rollback de un solo archivo si el nuevo endpoint tuviera problemas en producción, sin tocar el backend.

## Decision log

- Se elige generación on-demand sin persistencia (Option A del análisis) en vez de columna nueva + backfill, siguiendo el precedente de `perf-001` de evitar cambios de esquema cuando una alternativa los evita sin costo real.
- Se descarta WebP para las miniaturas: validado contra una imagen real, el tamaño resultante es prácticamente idéntico al JPEG (mozjpeg) para este tipo de contenido — no justifica la complejidad de negociar formato.
- Se descarta paginación/virtualización y TanStack Query/SWR por no estar justificados al volumen de datos real (3 trabajos, 9 imágenes) — ver análisis, Recommendation, con umbral documentado para reconsiderar.
- Plan aprobado directamente (`status: approved`) porque el usuario pidió explícitamente el diagnóstico + implementación en el mismo mensaje, con criterios de validación ya definidos por el propio pedido.

## Surprises and discoveries

- El repo no tiene un `.env` para `mk3_hierros_back` (solo `.env.example`, y con nombres de variable distintos a los que `app.module.ts` realmente lee: `PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE` vs. `DB_HOST/...` del ejemplo). Sin eso, el backend no puede levantarse localmente (TypeORM falla al conectar), así que no fue posible correr la app completa y golpear el endpoint nuevo por HTTP real durante la implementación inicial.
- Mitigación aplicada en ese momento: la lógica de resize (`sharp`, mismos parámetros que quedaron en `getThumbnailById`) se validó por separado descargando una imagen real de producción y redimensionándola con un script standalone — resultado: -85.3% de payload (260169 → 38181 bytes). Esto dio alta confianza pero no cerraba el paso 8.
- El usuario compartió credenciales de Postgres de producción (Railway) en una sesión posterior. El host inicial (`postgres.railway.internal`) es el hostname de red privada de Railway y no resuelve fuera de su red — hubo que pedir el proxy TCP público (`Settings → Networking → TCP Proxy`, `shuttle.proxy.rlwy.net:48767`) para poder conectar desde esta sesión.
- **Bug real encontrado al correr el endpoint nuevo por primera vez**: `GET :id/images/:imageId/thumbnail` devolvía 500 (`TypeError: sharp_1.default is not a function`). Causa raíz: `sharp` 0.35 publica tipos condicionales por `exports` (ESM vs CJS), pero `tsconfig.json` no tenía `moduleResolution` seteado → TypeScript usa resolución legacy ("node10"), que ignora el mapa `exports` y lee el campo `types` de nivel superior del `package.json` de `sharp` (`./dist/index.d.mts`, tipos **ESM**) en vez de `./dist/index.d.cts` (tipos CJS, que sí calzan con el runtime real `module.exports = Sharp`). El `import sharp from 'sharp'` original tipaba bien contra ese `.d.mts` (tiene `export default sharp`) pero fallaba en runtime porque el tsconfig tenía `allowSyntheticDefaultImports: true` sin su contraparte `esModuleInterop: true` — sin el helper de interop, TS emite acceso directo a `.default` sobre el `require()` crudo, que no existe en el módulo CJS real.
  - Fix aplicado: agregar `"esModuleInterop": true` a `mk3_hierros_back/tsconfig.json` (un flag, sin tocar el import de `workImage.service.ts`). Es la contraparte estándar de `allowSyntheticDefaultImports` — tenerlo sin el otro es exactamente el footgun que causó esto. `npm run build` completo del backend después del cambio: sin errores nuevos, sin regresiones en el resto de los imports por default del proyecto.
  - Este bug no era detectable con `npm run build`/lint/tests (todos pasaban limpios) ni con la validación offline de `sharp` (el script standalone importaba `sharp` con un tsconfig/contexto distinto al de Nest) — solo apareció al ejecutar la ruta real vía HTTP. Confirma que el paso 8 (prueba end-to-end) no era opcional pese a la alta confianza previa.
- `synchronize: true` en `app.module.ts` no tiene guard por entorno (corre siempre, incluso local contra prod). Antes de bootear localmente se verificó que las entities de esta rama no tienen diff contra `main` (`git diff main...HEAD -- src/Entity/`), así que no se esperaba ni se observó ningún `ALTER`/`CREATE` al conectar. Queda registrado como riesgo latente para cualquier sesión futura que corra el backend local contra la DB real con cambios de entity pendientes.

## Progress

Completado. Pasos 1-8 cerrados: build/lint/test limpios en back y front, endpoint de thumbnail probado end-to-end contra la base de producción real (curl + verificación visual de la grilla), y un bug de configuración (`esModuleInterop` faltante, expuesto por `sharp`) encontrado y corregido en el camino.

## Outcomes and retrospective

Confirmado en producción (datos reales, vía proxy Postgres): -85.3% de payload en el endpoint de thumbnail (260169 → 38181 bytes), igual a lo proyectado en el análisis. Grilla renderiza las 3 miniaturas sin regresión visual; el endpoint de imagen original queda sin cambios de comportamiento.

El único desvío del plan original fue el fix de `esModuleInterop` en `tsconfig.json` — no estaba en el alcance inicial, pero era un bloqueante real para que el propio endpoint de este plan funcionara en producción, no una mejora aparte. Se trató como parte de cerrar el paso 8, no como un cambio de alcance nuevo.

Aprendizaje para próximos planes que agreguen una dependencia nueva con tipos duales ESM/CJS: la validación offline de una librería (script standalone) no sustituye correr la ruta real dentro de la app — el tsconfig/contexto de resolución de módulos puede diferir y ocultar bugs de interop que solo aparecen en runtime real.
