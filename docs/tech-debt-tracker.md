# Tech Debt Tracker

## High

| ID | Date | Area | Description | Status | Owner | Notes |
|---|---|---|---|---|---|---|
| td-001 | 2026-08-19 | mk3_hierros_back | `TypeOrmModule.forRootAsync` en `app.module.ts` tiene `synchronize: true` sin guard por entorno (el comentario en el código dice "esto no se usa en producción" pero es el mismo config siempre). Cualquier boot del backend — local o en Railway — con entities que difieran del schema real dispara ALTER/CREATE automáticos, sin sistema de migraciones formal. | open | backend | Riesgo confirmado real durante la validación de perf-002 (boot local contra Postgres de producción vía proxy). Se mitigó ad-hoc verificando `git diff main...HEAD -- src/Entity/` antes de bootear, pero no hay protección estructural. Reemplazar por migraciones formales o al menos condicionar `synchronize` a `NODE_ENV !== 'production'`. |

## Medium

| ID | Date | Area | Description | Status | Owner | Notes |
|---|---|---|---|---|---|---|
| td-002 | 2026-08-19 | mk3_hierros_back | `GET /trabajo/byStatus/:status` y `GET /trabajo/getByCategoryFinished/:categoryId` exponen públicamente `price` y `finalPrice` (costos internos) sin autenticación. | open | backend | Detectado originalmente en `docs/analysis/2026-08-17_works-images-performance.md` (hallazgo colateral, fuera de alcance de perf-002) y re-confirmado al inspeccionar la respuesta real de producción durante la validación de perf-002. No es un problema de performance; requiere su propio análisis (¿ocultar el campo en la respuesta pública? ¿endpoint separado para vista interna?). |
| td-003 | 2026-08-19 | mk3_hierros_back | `mk3_hierros_back/.env.example` documentaba variables `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`, pero `app.module.ts` lee `PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE`. El ejemplo no servía para levantar el backend local. | fixed | backend | Bloqueó la validación end-to-end de perf-002 durante la implementación inicial. Corregido en la misma sesión (trivial, no afecta comportamiento). |

## Low

| ID | Date | Area | Description | Status | Owner | Notes |
|---|---|---|---|---|---|---|
