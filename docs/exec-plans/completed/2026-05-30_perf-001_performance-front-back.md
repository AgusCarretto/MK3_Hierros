---
id: perf-001
title: Optimización de performance frontend y backend
status: completed
created: 2026-05-30
updated: 2026-05-30
owners:
  - frontend
  - backend
features:
  - feat-001
  - feat-003
covers:
  - mk3_hierros_back/src/Trabajos/trabajo.controller.ts
  - mk3_hierros_back/src/Trabajos/trabajo.service.ts
  - mk3_hierros_front/src/components/WorkCard.jsx
  - mk3_hierros_front/src/components/workDetail.jsx
---

# Optimización de performance frontend y backend

## Purpose

Reducir la cantidad de requests HTTP, el payload de las queries de lista y la latencia percibida en las vistas de grilla y detalle de trabajo.

## Problem statement

Ver análisis completo: `docs/analysis/2026-05-30_performance-front-back.md`

Cinco problemas por prioridad:
1. Sin `Cache-Control` en respuestas de imagen → browser repite descarga en cada visita
2. `relations: ['images']` en lista → JOIN innecesario con bytea en queries de lista
3. Fetches secuenciales en WorkDetail → latencia evitable de 200–400ms
4. N+1 requests en WorkCard → 1+N requests por cada carga de la grilla
5. Imágenes en bytea (largo plazo, fuera de scope este plan)

## Scope

### In scope

- **Backend**: agregar `Cache-Control: public, max-age=31536000, immutable` en `GET /trabajo/:id/images/:imageId`
- **Backend**: eliminar `relations: ['images']` de `getAll()` en `trabajo.service.ts`
- **Backend**: nuevo método `getPreviewImageId(workId)` o join selectivo para exponer `previewImageId` en el response de lista
- **Frontend**: parallelizar los dos fetches en `workDetail.jsx` con `Promise.all`
- **Frontend**: `WorkCard.jsx` consume `previewImageId` del objeto `work` en lugar de hacer fetch propio

### Out of scope

- Migración de imágenes a object storage (requiere decisión de arquitectura, ver `docs/decisions/`)
- Code splitting de rutas en `App.js` (no es crítico aún dado el tamaño del bundle: 76kB gzip)
- Cambios en Android (revisar impacto de quitar `images` del response de lista)

## Context and orientation

Análisis: `docs/analysis/2026-05-30_performance-front-back.md`

Archivos afectados:
- `mk3_hierros_back/src/Trabajos/trabajo.service.ts`
- `mk3_hierros_back/src/Trabajos/trabajo.controller.ts`
- `mk3_hierros_back/src/Entity/Work.entity.ts` (revisar si necesita campo virtual)
- `mk3_hierros_front/src/components/workDetail.jsx`
- `mk3_hierros_front/src/components/WorkCard.jsx`

## Plan of work

### Fase A — Backend (sin impacto en contratos de Android)

**A1. Cache-Control en imágenes**
Modificar `getWorkImage()` en `trabajo.controller.ts` para agregar:
```ts
res.set('Cache-Control', 'public, max-age=31536000, immutable');
```

**A2. Eliminar JOIN innecesario en `getAll()`**
En `trabajo.service.ts`, quitar `relations: ['images']` de `getAll()`.
⚠️ Verificar primero si el Android consume `work.images` desde ese endpoint.

**A3. Exponer `previewImageId` en la lista**
Opciones a decidir antes de ejecutar:
- Opción A: nueva query con `LEFT JOIN LATERAL` o subquery que traiga solo el primer `image.id` por trabajo
- Opción B: agregar `@Column({ nullable: true }) previewImageId: string` en `Work.entity.ts` y poblarlo al subir imágenes

Recomendado: Opción A (sin cambio de esquema), implementada como método en `WorkImageService.getFirstImageIdByWorkIds(ids[])`.

### Fase B — Frontend

**B1. Parallelizar fetches en WorkDetail**
Reemplazar:
```js
const resWork = await fetch(...)
const resImages = await fetch(...)
```
Por:
```js
const [resWork, resImages] = await Promise.all([fetch(...), fetch(...)])
```

**B2. Eliminar fetch individual en WorkCard**
Usar `previewImageId` que ya viene en el objeto `work` de la lista (provisto por A3). Construir la URL directamente sin fetch adicional.

## Concrete steps

- [x] 1. Verificar si Android usa `work.images` del endpoint de lista antes de quitar el JOIN. → Confirmado: no lo consume en la lista.
- [x] 2. Backend A1: Agregar `Cache-Control: public, max-age=31536000, immutable` en `getWorkImage()` en `trabajo.controller.ts`.
- [x] 3. Backend A2: Quitar `relations: ['images']` de `getAll()` en `trabajo.service.ts`.
- [x] 4. Backend A3: Agregar método privado `enrichWithPreviewImageId` en `TrabajoService`; aplicado en `getByStatus` y `getByCategoryFinished`.
- [x] 5. Frontend B1: Reemplazar fetches secuenciales en `workDetail.jsx` con `Promise.all`; TTL aumentado a 30 min.
- [x] 6. Frontend B2: Eliminar `useEffect` de fetch en `WorkCard.jsx`; usar `work.previewImageId` directamente.
- [x] 7. Correr `npm run build` en `mk3_hierros_front` — compilación exitosa, bundle −111 B gzip.
- [x] 8. Correr `npm run build` en `mk3_hierros_back` — sin errores nuevos introducidos.

## Validation and acceptance

- `GET /trabajo/byStatus/Finalizado` devuelve cada work con `previewImageId` (no `null`) cuando tiene imágenes.
- `GET /trabajo/:id/images/:imageId` responde con header `Cache-Control: public, max-age=31536000, immutable`.
- La grilla de trabajos carga con 1 solo request de lista (sin requests individuales por imagen).
- La vista de detalle inicia ambos fetches en paralelo (observable en DevTools → Network → Timing).
- `npm run build` en front y back pasan sin errores.

## Idempotence and rollback

- `Cache-Control`: rollback = eliminar la línea del header. Sin cambio de esquema.
- Quitar JOIN: rollback = restaurar `relations: ['images']`. Sin cambio de esquema.
- `previewImageId` en response: es un campo adicional, no rompe contratos existentes.
- Cambio en WorkCard: si se revierte A3, `WorkCard` debe volver a su fetch individual.

## Decision log

- Elegida Opción A para previewImageId (subquery sin cambio de esquema sobre Opción B con nuevo campo).

## Surprises and discoveries

_Completar durante ejecución._

## Progress

_Completar durante ejecución._

## Outcomes and retrospective

_Completar al cierre._
