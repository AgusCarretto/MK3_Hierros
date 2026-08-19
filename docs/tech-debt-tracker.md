# Tech Debt Tracker

## High

| ID | Date | Area | Description | Status | Owner | Notes |
|---|---|---|---|---|---|---|
| td-001 | 2026-08-19 | mk3_hierros_back | `TypeOrmModule.forRootAsync` en `app.module.ts` tenía `synchronize: true` sin guard por entorno (el comentario en el código decía "esto no se usa en producción" pero era el mismo config siempre). Cualquier boot del backend — local o en Railway — con entities que difirieran del schema real disparaba ALTER/CREATE automáticos, sin sistema de migraciones formal. | mitigated | backend | Riesgo confirmado real durante la validación de perf-002 (boot local contra Postgres de producción vía proxy). Mitigado en `back-001` (`docs/exec-plans/completed/2026-08-19_back-001_guard-typeorm-synchronize.md`): `synchronize` ahora requiere `DB_SYNCHRONIZE=true` explícito (default `false`, seguro). El fix de fondo — reemplazar `synchronize` por un sistema de migraciones formal — sigue abierto, ver td-004. |

## Medium

| ID | Date | Area | Description | Status | Owner | Notes |
|---|---|---|---|---|---|---|
| td-002 | 2026-08-19 | mk3_hierros_back | `GET /trabajo/byStatus/:status` y `GET /trabajo/getByCategoryFinished/:categoryId` exponen públicamente `price` y `finalPrice` (costos internos) sin autenticación. | open | backend | Detectado originalmente en `docs/analysis/2026-08-17_works-images-performance.md` (hallazgo colateral, fuera de alcance de perf-002) y re-confirmado al inspeccionar la respuesta real de producción durante la validación de perf-002. No es un problema de performance; requiere su propio análisis (¿ocultar el campo en la respuesta pública? ¿endpoint separado para vista interna?). |
| td-003 | 2026-08-19 | mk3_hierros_back | `mk3_hierros_back/.env.example` documentaba variables `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`, pero `app.module.ts` lee `PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE`. El ejemplo no servía para levantar el backend local. | fixed | backend | Bloqueó la validación end-to-end de perf-002 durante la implementación inicial. Corregido en la misma sesión (trivial, no afecta comportamiento). |

## Low

| ID | Date | Area | Description | Status | Owner | Notes |
|---|---|---|---|---|---|---|
| td-004 | 2026-08-19 | mk3_hierros_back | No hay sistema de migraciones formal (`typeorm migration:generate`/`migration:run`); el schema se mantiene solo con `synchronize` (ahora opt-in vía `DB_SYNCHRONIZE`, ver td-001). | open | backend | Fix de fondo identificado como Option C en `docs/analysis/2026-08-19_synchronize-true-guard.md`, deliberadamente fuera de alcance de `back-001` por superficie de cambio grande (migración inicial que capture el schema real de prod, DataSource de CLI, paso de deploy en Railway). Encarar con su propio análisis/plan cuando el volumen de cambios de schema lo justifique. |
