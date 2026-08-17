# 2026-08-17 - Performance de carga de "Nuestros Trabajos" y sus fotos

## Problem statement

La vista de trabajos (`/nuestros-trabajos`) y la visualización de fotos tardan mucho en cargar. Se pide diagnóstico de causa raíz y un plan de optimización integral (imágenes, data fetching, y backend si aplica) para que la carga sea percibida como instantánea.

## Context

Flujo actual (post `front-002`):
- `OurWork.jsx` → `getFinishedWorks()` → `GET /trabajo/byStatus/Finalizado` o `/trabajo/getByCategoryFinished/:id`.
- `WorkCard.jsx` → `workImageUrl(work.id, work.previewImageId)` → `GET /trabajo/:id/images/:imageId`.
- `workDetail.jsx` → `getWorkDetail()` → `Promise.all([GET /trabajo/:id, GET /trabajo/:id/images])`, luego cada imagen del carrusel vía el mismo endpoint de imagen.
- Backend (`WorkImage` entity): las imágenes se guardan como `bytea` en Postgres (`imageData: Buffer`), subidas sin redimensionar (Multer solo valida mimetype y tope de 5MB). `getWorkImage()` en el controller lee la columna completa y la sirve tal cual, con `Cache-Control: public, max-age=31536000, immutable` (agregado en `perf-001`).
- **El mismo endpoint de imagen sirve la resolución completa tanto en la grilla (`WorkCard`, miniatura visual pequeña) como en el detalle/carrusel (`workDetail`, tamaño completo).** No existe generación de miniaturas en ningún punto del flujo.

## Findings

Evidencia recolectada contra el backend real (`https://mk3hierros-production.up.railway.app`), 2026-08-17:

1. **Listado de trabajos ya es liviano** (`GET /trabajo/byStatus/Finalizado`): 1007 bytes para 3 trabajos, sin blobs embebidos, con `previewImageId` ya resuelto server-side (trabajo de `perf-001`). **No es el cuello de botella.**
2. **Cada imagen de la grilla es la foto original sin redimensionar**: las 3 imágenes de preview actuales pesan 260KB, 267KB y 322KB, con dimensiones de hasta 1179×1160px, para tarjetas que se muestran a un ancho de card de grilla (~350px de ancho renderizado). Se está transportando y decodificando ~3-4x más píxeles de los necesarios.
3. **Latencia fija por imagen ~1s** (`time_starttransfer` ≈ 0.5s, `time_total` ≈ 1.0-1.1s), consistente incluso en pedidos repetidos a la misma imagen — indica costo de servidor (lectura de `bytea` completo en memoria antes de responder, sin streaming) más transferencia de un payload innecesariamente grande, no solo latencia de red.
4. **Validado cuantitativamente**: redimensionar una de las imágenes reales de producción a 480px de ancho (`sharp`, JPEG calidad 75, mozjpeg) reduce el payload de 260169 → 38181 bytes (**-85.3%**). WebP a la misma calidad da un tamaño prácticamente idéntico (38476 bytes) para este tipo de contenido (fotos de obra) — no justifica la complejidad adicional de negociar formato.
5. **Frontend ya tiene**: `loading="lazy"` nativo en `WorkCard` (evita descargar tarjetas fuera de viewport), cache TTL en `localStorage` vía `useCachedFetch` (revisitas instantáneas, 0 requests), fetch de detalle paralelizado (`Promise.all`), sin duplicación de cliente HTTP. **Estos puntos del pedido ya están resueltos por `front-002` y no requieren cambios.**
6. **Volumen de datos real: 3 trabajos, 9 imágenes en total.** Paginación, scroll infinito o virtualización (TanStack Virtual/react-window) no están justificados hoy — agregarían complejidad sin beneficio medible a este volumen. Se documenta el umbral para reconsiderar (ver Recommendation).
7. **TanStack Query/SWR no aportarían nada nuevo**: `useCachedFetch` ya da revisitas a 0ms vía cache TTL en `localStorage`, que es exactamente el comportamiento pedido. Reemplazarlo sería una dependencia lateral sin beneficio funcional para la escala actual de la app.
8. **Hallazgo colateral (fuera de alcance de este plan)**: el endpoint público `GET /trabajo/byStatus/:status` expone `price` y `finalPrice` (costos internos) sin autenticación. No se toca en este plan (no es un problema de performance), pero se deja registrado para evaluar por separado.

## Options

### Option A — Miniatura generada on-demand (sin cambio de esquema)

Nuevo endpoint `GET /trabajo/:id/images/:imageId/thumbnail`: reutiliza la misma lectura de `imageData` ya existente, la redimensiona con `sharp` (ancho 480px, JPEG calidad 75, mozjpeg) al vuelo y la sirve con el mismo `Cache-Control: immutable`. `WorkCard` pasa a pedir esta URL; `workDetail` sigue pidiendo la imagen original sin cambios.

Pros:
- Cero cambios de esquema/migración — coherente con la decisión ya tomada en `perf-001` de evitar cambios de esquema cuando hay alternativa (subquery para `previewImageId` en vez de columna nueva).
- Cambio 100% aditivo: ruta nueva, sin tocar contratos existentes. Cero riesgo de regresión en el endpoint de imagen original ni en Android (que no usa `previewImageId`/thumbnail).
- El costo de CPU de redimensionar (~decenas de ms) es insignificante comparado con la latencia de red/DB ya medida (~500-1000ms), y con `Cache-Control: immutable` el navegador solo lo pide una vez por imagen por visitante.

Cons:
- Sin cache server-side de la miniatura generada: si muchos visitantes distintos piden la misma imagen por primera vez, se recalcula cada vez (no se persiste). Con 9 imágenes y el tráfico actual, no es un problema real; queda documentado como mejora futura si el catálogo crece mucho.

### Option B — Miniatura persistida en columna nueva (`thumbnailData bytea`)

Generar la miniatura al subir la imagen (o vía backfill lazy) y guardarla en una nueva columna de `WorkImage`.

Pros:
- Cero costo de CPU en cada request (se sirve directo de la DB).

Cons:
- Requiere cambio de esquema (`synchronize: true` en este proyecto lo aplicaría automáticamente en el próximo boot — sin sistema de migraciones formal) y backfill para las 9 imágenes ya existentes.
- Mayor superficie de cambio para un beneficio que, a este volumen de tráfico/imágenes, no es medible.

## Recommendation

**Option A.** Coherente con el precedente ya sentado en `perf-001` (preferir no tocar el esquema cuando una alternativa sin migración resuelve el problema igual de bien), y el costo de CPU es despreciable frente a la ganancia de payload (-85%). Si el catálogo creciera a un volumen donde el recálculo por visita se vuelva un costo real (cientos de imágenes con tráfico alto), reconsiderar Option B o agregar una cache en memoria (LRU) delante del resize — no se implementa ahora por no estar justificado (YAGNI).

Paginación/virtualización: no se implementa. Umbral sugerido para reconsiderar: cuando un listado individual supere ~40-60 trabajos (grilla dejaría de caber cómodamente en 2-3 scrolls) — hoy son 3.

TanStack Query/SWR: no se adopta. `useCachedFetch` (de `front-002`) ya cubre el caso de uso pedido (revisita instantánea) sin dependencia nueva.

## Open questions

Ninguna abierta.

## Risks

- `sharp` es un binario nativo (libvips). Railway/Nixpacks lo soporta de forma estándar para apps Node/NestJS; se valida con `npm run build` + prueba manual contra el endpoint real antes de dar por cerrado.
- Ruta nueva bajo `/trabajo/:id/images/:imageId/thumbnail`: verificar que no colisione con el orden de rutas existente en Nest (no colisiona: distinto número de segmentos que `:id/images/:imageId`).
