# 2026-05-30 - Performance frontend ↔ backend

## Problem statement

El sistema tiene cinco problemas de performance críticos distribuidos entre el frontend React y el backend NestJS que aumentan la latencia percibida, el consumo de recursos en Railway y la cantidad de requests HTTP innecesarios.

## Context

Archivos relevantes:

**Backend**
- `mk3_hierros_back/src/Entity/WorkImage.entity.ts` — imagen almacenada como `bytea` en PostgreSQL
- `mk3_hierros_back/src/Trabajos/trabajo.service.ts` — `getAll` y `getById` cargan relación `images` completa
- `mk3_hierros_back/src/Trabajos/workImage.service.ts` — sirve imagen sin `Cache-Control`
- `mk3_hierros_back/src/Trabajos/trabajo.controller.ts` — endpoint de imagen sin headers de cache

**Frontend**
- `mk3_hierros_front/src/components/WorkCard.jsx` — fetch por imagen en cada tarjeta (N+1)
- `mk3_hierros_front/src/components/workDetail.jsx` — dos fetches secuenciales independientes
- `mk3_hierros_front/src/App.js` — todas las rutas cargadas en el bundle inicial

## Findings

### 1. Imágenes almacenadas como `bytea` en PostgreSQL (Crítico)
`WorkImage.imageData` guarda el binario completo en la base de datos. Cada request de imagen:
- ejecuta un SELECT sobre la tabla `work_images` trayendo el buffer completo
- lo serializa en el proceso Node
- lo envía como HTTP response sin cache

Sin CDN ni almacenamiento externo (S3, Cloudinary, etc.), la base de datos actúa como servidor de archivos estáticos. Solución a largo plazo: migrar a object storage externo. Solución a corto plazo: agregar `Cache-Control` para que el browser no repita la misma descarga.

### 2. N+1 requests en la grilla de trabajos (Alto)
`OurWork` obtiene la lista de trabajos con un fetch. Luego cada `WorkCard` hace un fetch adicional a `/trabajo/${id}/images` para obtener el ID de la imagen de portada. Con 20 trabajos en pantalla = 21 requests HTTP. El backend podría resolver esto incluyendo `previewImageId` en el response de la lista, sin enviar el buffer.

### 3. `relations: ['images']` en queries de lista (Alto)
`getAll()` y `getById()` hacen JOIN con `work_images` incluyendo la columna `imageData` (bytea). En una query de lista eso es completamente innecesario: solo se necesitan los metadatos (`id`, `order`) o nada. Esto aumenta el payload y el uso de memoria en el proceso Node.

### 4. Dos fetches secuenciales en detalle de trabajo (Medio)
`workDetail.jsx` espera el resultado de `GET /trabajo/:id` antes de iniciar `GET /trabajo/:id/images`. Ambos son independientes entre sí y pueden ejecutarse en paralelo con `Promise.all`.

### 5. Sin `Cache-Control` en respuestas de imagen (Medio)
`getWorkImage()` responde sin headers de cache. El browser descarga la misma imagen en cada visita. Las imágenes subidas a un trabajo no cambian (no hay endpoint de update de imagen), por lo que pueden cachearse indefinidamente en el cliente.

## Options

### Para hallazgo 1 (bytea)
- **A (corto plazo):** Agregar `Cache-Control: public, max-age=31536000, immutable` en el endpoint de imagen. Sin cambio de infraestructura.
- **B (largo plazo):** Migrar a object storage externo (Cloudinary, S3). Requiere cambio de entidad, migración de DB, nuevas variables de entorno. Fuera de scope inmediato.

### Para hallazgo 2 (N+1)
- **A:** Agregar `previewImageId` en el response de `getByStatus` / `getByCategoryFinished` mediante subquery o join selectivo (solo metadatos, no bytea).
- **B:** Nuevo campo `previewImageId` en la entidad `Work` (redundancia controlada). Más simple pero requiere mantener consistencia.

### Para hallazgo 3 (relations innecesario en lista)
- Eliminar `relations: ['images']` en `getAll()`. En `getById()` se puede dejar ya que es el detalle.

### Para hallazgo 4 (fetches secuenciales)
- Reemplazar los dos `await fetch` consecutivos por `Promise.all([fetch(...), fetch(...)])`.

### Para hallazgo 5 (Cache-Control)
- Agregar header en el controller: `res.set('Cache-Control', 'public, max-age=31536000, immutable')`.

## Recommendation

Priorizar por impacto y reversibilidad:

1. `Cache-Control` en imágenes (máximo impacto, mínimo riesgo, 1 línea de código).
2. Eliminar `relations: ['images']` en `getAll()` (reduce payload y memoria en Railway inmediatamente).
3. Parallelizar fetches en `workDetail.jsx` (reduce latencia perceptible en la vista más importante).
4. Resolver N+1 en `WorkCard` añadiendo `previewImageId` al response de lista (requiere cambio en servicio + frontend).
5. Migrar imágenes a object storage — plannear para el futuro como decisión de arquitectura.

## Open questions

- [ ] ¿Existe algún caso donde una imagen sea actualizada después de subida? Si no, `immutable` es seguro.
- [ ] ¿El plan de Railway tiene límite de ancho de banda que haga urgente la migración a object storage?

## Risks

- Eliminar `relations: ['images']` en `getAll` puede romper consumidores que esperen `work.images` en la lista (revisar Android).
- `Cache-Control: immutable` requiere que las URLs de imagen sean estables; lo son porque usan el `imageId` de DB.
