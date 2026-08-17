---
id: perf-002
title: Miniaturas on-demand para la grilla de trabajos
status: approved
created: 2026-08-17
updated: 2026-08-17
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
- [ ] 8. **Bloqueado**: prueba manual contra el backend real (curl -w + verificación visual de la grilla) requiere que el endpoint nuevo esté desplegado, o credenciales de Postgres para correr `mk3_hierros_back` local (no hay `.env` en el repo — ver `docs/processes/dev-setup.md`). No se puede completar desde esta sesión sin uno de los dos. Ver Surprises and discoveries.

## Validation and acceptance

- `cd mk3_hierros_back && npm run build` sin errores.
- `cd mk3_hierros_front && npm run lint && npm test && npm run build` sin errores.
- `curl` al nuevo endpoint de thumbnail contra el backend real (una vez desplegado) muestra una reducción de payload consistente con lo validado en el análisis (~80%+ vs. el endpoint de imagen original).
- La grilla de trabajos en el navegador muestra las miniaturas correctamente, sin regresión visual, y el detalle/carrusel sigue mostrando la imagen en resolución completa.
- Endpoint de imagen original (`GET /trabajo/:id/images/:imageId`) sin cambios de comportamiento — `workDetail.jsx` no se modifica.

## Idempotence and rollback

- Cambios 100% aditivos (ruta nueva, función nueva, sin tocar rutas/columnas existentes). Rollback = revertir los commits de esta rama; no hay estado persistido que limpiar (no hay cambio de esquema).
- El frontend puede volver a `workImageUrl` en `WorkCard` como rollback de un solo archivo si el nuevo endpoint tuviera problemas en producción, sin tocar el backend.

## Decision log

- Se elige generación on-demand sin persistencia (Option A del análisis) en vez de columna nueva + backfill, siguiendo el precedente de `perf-001` de evitar cambios de esquema cuando una alternativa los evita sin costo real.
- Se descarta WebP para las miniaturas: validado contra una imagen real, el tamaño resultante es prácticamente idéntico al JPEG (mozjpeg) para este tipo de contenido — no justifica la complejidad de negociar formato.
- Se descarta paginación/virtualización y TanStack Query/SWR por no estar justificados al volumen de datos real (3 trabajos, 9 imágenes) — ver análisis, Recommendation, con umbral documentado para reconsiderar.
- Plan aprobado directamente (`status: approved`) porque el usuario pidió explícitamente el diagnóstico + implementación en el mismo mensaje, con criterios de validación ya definidos por el propio pedido.

## Surprises and discoveries

- El repo no tiene un `.env` para `mk3_hierros_back` (solo `.env.example`, y con nombres de variable distintos a los que `app.module.ts` realmente lee: `PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE` vs. `DB_HOST/...` del ejemplo). Sin eso, el backend no puede levantarse localmente (TypeORM falla al conectar), así que no fue posible correr la app completa y golpear el endpoint nuevo por HTTP real desde esta sesión.
- Mitigación aplicada: la lógica de resize (`sharp`, mismos parámetros que quedaron en `getThumbnailById`) se validó por separado descargando una imagen real de producción y redimensionándola con un script standalone — resultado: -85.3% de payload (260169 → 38181 bytes). El wiring de la ruta nueva sigue el mismo patrón exacto que `GET :id/images/:imageId` (ya en producción, probado), y `npm run build` compila sin errores. Con eso hay alta confianza en que funciona, pero **el paso 8 de validación (HTTP end-to-end contra datos reales) queda pendiente** hasta que se despliegue o se compartan credenciales de DB para probar local.

## Progress

Pasos 1-7 completados y validados (build + lint limpios en back y front, sin regresiones en el resto de la suite). Paso 8 (prueba HTTP end-to-end) bloqueado por falta de acceso a una base de datos — ver Surprises and discoveries. Status del plan se mantiene `approved`, no se marca `completed` hasta cerrar el paso 8.

## Outcomes and retrospective

_Completar al cierre, una vez validado el paso 8._
