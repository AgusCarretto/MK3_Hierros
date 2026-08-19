---
id: back-001
title: Guardar synchronize de TypeORM detrás de un opt-in explícito
status: completed
created: 2026-08-19
updated: 2026-08-19
owners:
  - backend
features: []
feature-less-reason: Cambio interno de configuración/seguridad de infraestructura, sin comportamiento visible para usuarios de los clientes web/mobile.
covers:
  - mk3_hierros_back/src/app.module.ts
  - mk3_hierros_back/.env.example
  - docs/processes/dev-setup.md
  - docs/tech-debt-tracker.md
---

# Guardar synchronize de TypeORM detrás de un opt-in explícito

## Purpose

Que ningún boot del backend (local o en Railway) pueda alterar el schema de la base de datos real por accidente. Hoy `synchronize: true` corre siempre, sin guard, y ya obligó a una mitigación manual ad-hoc durante `perf-002`.

## Problem statement

Ver análisis completo: `docs/analysis/2026-08-19_synchronize-true-guard.md`.

Resumen: `TypeOrmModule.forRootAsync` en `app.module.ts` tiene `synchronize: true` incondicional (el comentario "esto no se usa en producción" es falso — es el mismo config en todos los entornos). Se elige Option B del análisis: una variable de entorno dedicada `DB_SYNCHRONIZE` (default `false`, opt-in explícito con `'true'`), en vez de atarlo a `NODE_ENV` (Option A, depende de una convención de Railway no verificable desde este repo) o migrar a un sistema de migraciones formal (Option C, fuera de alcance — queda registrado en `docs/tech-debt-tracker.md` td-001 como follow-up).

## Context and orientation

Análisis: `docs/analysis/2026-08-19_synchronize-true-guard.md`.

Archivos afectados:
- `mk3_hierros_back/src/app.module.ts` — el `useFactory` de `TypeOrmModule.forRootAsync` (línea ~34).
- `mk3_hierros_back/.env.example` — agregar `DB_SYNCHRONIZE`.
- `docs/processes/dev-setup.md` — documentar que el desarrollo local necesita `DB_SYNCHRONIZE=true` (no hay migraciones; sin la variable, las tablas no se crean/actualizan solas).
- `docs/tech-debt-tracker.md` — cerrar td-001.

Decisión del usuario (no técnica, de producto/infra): mantener el sync activo en Railway. Esto requiere que el usuario agregue `DB_SYNCHRONIZE=true` en las variables de entorno del servicio backend en Railway — acción fuera de este repo, que el propio usuario debe ejecutar en el dashboard (no es algo que este plan pueda o deba automatizar).

## Scope

### In scope

- Cambiar `synchronize: true` por `synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true'` en `app.module.ts`.
- Agregar `DB_SYNCHRONIZE=${DB_SYNCHRONIZE}` a `.env.example` y al `.env` local de esta sesión (para no romper el flujo de desarrollo local en curso).
- Documentar la variable nueva en `docs/processes/dev-setup.md`.
- Cerrar td-001 en `docs/tech-debt-tracker.md`.

### Out of scope

- Sistema de migraciones formal (Option C del análisis) — queda como follow-up en td-001, no se implementa acá.
- Cualquier cambio a las entities o al schema en sí.
- Setear la variable en el dashboard de Railway — acción manual del usuario, fuera de este repo.
- El resto de los hallazgos de deuda técnica (`td-002`, exposición de `price`/`finalPrice`) — no se toca en este plan.

## Plan of work

1. Cambiar el `useFactory` de TypeORM para leer `DB_SYNCHRONIZE` en vez de hardcodear `true`.
2. Actualizar `.env.example` y el `.env` local.
3. Documentar en `dev-setup.md`.
4. Validar: `npm run build` sin errores; boot local real contra la Postgres de producción (ya tenemos la conexión de la sesión anterior) confirmando que con `DB_SYNCHRONIZE=true` sigue sincronizando igual que antes (sin diffs de schema, dado que las entities no cambiaron) y que sin la variable (o en `false`) NO dispara sync — probado apagándola una vez.
5. Actualizar `docs/tech-debt-tracker.md` (td-001 → fixed) una vez validado.

## Concrete steps

- [x] 1. `app.module.ts`: reemplazar `synchronize: true, // Esto no se usa en producción.` por `synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',` (sin el comentario viejo, que era falso).
- [x] 2. `mk3_hierros_back/.env.example`: agregar línea `DB_SYNCHRONIZE=${DB_SYNCHRONIZE}`.
- [x] 3. `mk3_hierros_back/.env` (local, gitignorado): agregar `DB_SYNCHRONIZE=true` para no interrumpir el flujo de desarrollo local en curso.
- [x] 4. `docs/processes/dev-setup.md`: agregar nota en la sección de backend explicando `DB_SYNCHRONIZE` (qué hace, por qué default `false`, que desarrollo local la necesita en `true` porque no hay migraciones).
- [x] 5. `cd mk3_hierros_back && npm run build` — sin errores de TypeScript.
- [x] 6. Boot local contra Postgres real con `DB_SYNCHRONIZE=true`: confirmado con `logging: true` temporal — se ve la ronda completa de ~17 queries de introspección de schema (`information_schema`, `pg_constraint`, `pg_index`, `pg_enum`, etc.) envuelta en una transacción, sin ALTER/CREATE porque no hay diff (esperado).
- [x] 7. Boot local con `DB_SYNCHRONIZE` ausente: confirmado con el mismo `logging: true` — cero queries de schema entre la inicialización de `ConfigModule` y `TypeOrmCoreModule`. Diferencia empírica clara entre ambos casos, no solo inferida.
- [x] 8. `docs/tech-debt-tracker.md`: td-001 actualizado a `mitigated` (no `fixed` puro — el fix de fondo, migraciones formales, queda abierto como td-004 nuevo), con nota apuntando a este plan.
- [x] 9. Avisado al usuario en el mismo turno en que se le preguntó (antes de escribir este plan): falta el paso manual en Railway (`DB_SYNCHRONIZE=true` en las variables del servicio) antes o junto con el próximo deploy — sin eso, producción deja de sincronizar schema a partir del próximo deploy. Pendiente de que el usuario lo ejecute en el dashboard de Railway.

## Validation and acceptance

- `cd mk3_hierros_back && npm run build` sin errores.
- Boot local contra la DB real con `DB_SYNCHRONIZE=true`: mismo comportamiento de arranque que antes de este cambio (sin diffs de schema, porque no hay cambios de entity pendientes).
- Boot local contra la DB real con `DB_SYNCHRONIZE` ausente/`false`: arranca sin intentar sincronizar (confirmado por ausencia de logs de sync de TypeORM, o inspeccionando que el flag efectivamente llega en `false` al `TypeOrmModule`).
- `.env.example` y `dev-setup.md` reflejan la variable nueva.
- `docs/tech-debt-tracker.md` td-001 actualizado.

## Idempotence and rollback

- Cambio de una línea de config + una variable de entorno nueva — 100% reversible volviendo `synchronize` a `true` hardcodeado si hiciera falta.
- No hay cambio de schema ni de datos — nada que limpiar.
- Rollback de un solo commit si algo no anda.

## Decision log

- Se elige Option B del análisis (variable dedicada `DB_SYNCHRONIZE`) en vez de Option A (`NODE_ENV`) porque no depende de una convención de plataforma (Railway seteando `NODE_ENV=production`) que no está verificada ni versionada en este repo.
- El usuario decidió explícitamente mantener el sync activo en Railway (no apagarlo de entrada), lo cual implica una acción manual suya en el dashboard de Railway que este plan no puede ejecutar ni verificar por sí mismo — se deja como paso explícito de aviso (paso 9) en vez de asumir que se hizo.
- Plan aprobado directamente (`status: approved`): el usuario eligió este foco de trabajo de una lista de opciones que le ofrecí, y ya resolvió la única decisión de producto/infra abierta (mantener sync en Railway) antes de escribir este plan — mismo criterio que `perf-002` para saltear el estado `draft`.
- Sistema de migraciones formal (Option C) queda deliberadamente fuera de alcance — se registra como el fix correcto a largo plazo en `docs/tech-debt-tracker.md` (td-001), a encarar con su propio análisis cuando el volumen de cambios de schema lo justifique.

## Surprises and discoveries

- `logging: ['schema']` (solo eventos de schema) no alcanzó para distinguir empíricamente los dos casos: como no hay ningún diff de schema pendiente (entities ya coinciden con la DB real), `synchronize: true` computa el diff pero no emite ningún ALTER/CREATE — cero líneas de log en ambos casos (con y sin la variable), aunque por motivos distintos (uno no corre el diff, el otro lo corre y da vacío). Hubo que subir a `logging: true` (todas las queries) para ver la ronda de introspección (`SELECT version()`, `information_schema.columns`, `pg_constraint`, `pg_index`, `pg_enum`, `typeorm_metadata`, todo envuelto en `START TRANSACTION`/`COMMIT`) que solo aparece cuando `synchronize` está activo, sin importar si termina aplicando cambios o no. El `logging: true` era temporal, solo para esta validación — no queda en el código.

## Progress

Completado. Los 9 pasos cerrados: cambio de config aplicado y compilando limpio, validado empíricamente en ambos sentidos contra la Postgres real (activo vs. inactivo), documentación y tech-debt tracker actualizados. Queda un paso fuera de este repo, a cargo del usuario: agregar `DB_SYNCHRONIZE=true` en las variables de Railway antes del próximo deploy.

## Outcomes and retrospective

El guard quedó verificado con evidencia directa (no solo lectura de código): se vio la diferencia real en las queries que Postgres recibe con la variable puesta y sin ella. El riesgo que motivó este plan — un boot local o de CI contra la base real alterando el schema sin que nadie lo note — queda mitigado sin tocar el flujo de desarrollo local actual (con `DB_SYNCHRONIZE=true` en el `.env` local, todo sigue igual que antes).

Punto abierto real: si el usuario no agrega `DB_SYNCHRONIZE=true` en Railway antes del próximo deploy, producción deja de sincronizar schema silenciosamente (el deploy no va a fallar, solo va a dejar de aplicar cambios de entity futuros). Esto no es un defecto del plan — es la consecuencia directa de la decisión de producto que tomó el usuario (mantener sync activo) combinada con que no existe forma de fijar variables de Railway desde este repo. Debe verificarse manualmente antes de mergear/deployar esta rama.
