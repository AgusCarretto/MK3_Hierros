# 2026-08-19 - Guardar `synchronize: true` de TypeORM detrás de un opt-in explícito

## Problem statement

`TypeOrmModule.forRootAsync` en `mk3_hierros_back/src/app.module.ts` corre con `synchronize: true` sin ningún guard por entorno. Cada boot del proceso Nest (local, Railway, o cualquier otro) hace que TypeORM diffee las entities contra el schema real de Postgres y aplique automáticamente los `ALTER`/`CREATE` necesarios para igualarlos — sin revisión, sin logging explícito, sin forma de deshacerlo salvo restaurar un backup. No hay sistema de migraciones formal en el proyecto.

Se pide eliminar (o al menos mitigar) el riesgo de que un boot del backend contra la base de datos real aplique cambios de schema no intencionados.

## Context

- `mk3_hierros_back/src/app.module.ts:34`: `synchronize: true, // Esto no se usa en producción.` — el comentario es incorrecto: es el mismo objeto de configuración en todos los entornos, no hay branching por `NODE_ENV` ni por ninguna otra variable.
- Confirmado como riesgo real (no solo teórico) durante `perf-002` (`docs/exec-plans/completed/2026-08-17_perf-002_works-image-thumbnails.md`): para validar el endpoint de thumbnail hubo que bootear el backend local contra la Postgres de producción real (vía proxy TCP de Railway). Antes de hacerlo se verificó `git diff main...HEAD -- src/Entity/` para confirmar que no había cambios de entity pendientes en la rama — mitigación manual, no estructural.
- El proyecto no define `NODE_ENV` en ningún lado del repo versionado (`package.json`, ni en código): `grep -rn "NODE_ENV" src/` no tiene resultados. `mk3_hierros_back/package.json` solo tiene `start:dev` (vía `nest start --watch`) y `start:prod` (`node dist/main`) — ninguno de los dos setea `NODE_ENV` explícitamente.
- Railway/Nixpacks suele setear `NODE_ENV=production` automáticamente en el build de apps Node, pero esto es un comportamiento de la plataforma, no algo versionado en este repo — por el principio operativo del harness ("si no está en el repo, no existe"), no se puede asumir como garantía sin verificarlo contra el dashboard de Railway.
- No hay sistema de migraciones (`typeorm migration:*`) configurado en el proyecto: no hay carpeta `migrations/`, no hay `DataSource` con `migrationsRun`, no hay script en `package.json` para generarlas o correrlas.

## Findings

1. El riesgo es real y ya se materializó como necesidad de mitigación manual en `perf-002` — no es un problema hipotético.
2. Migrar a un sistema de migraciones formal (TypeORM `migration:generate`/`migration:run`) es la solución correcta a largo plazo, pero es un cambio de superficie grande: requiere generar una migración inicial que capture el schema actual exacto de producción (para no perder ni reordenar nada), wiring de un `DataSource` de CLI separado del de la app, un paso de `migration:run` en el pipeline de deploy de Railway antes de levantar la app, y documentación de un flujo nuevo de "cambié una entity → genero migración → la reviso → la corro". No es proporcional a "evitar que un boot local rompa producción por accidente" y merece su propio análisis/plan si se decide encararlo.
3. Atar el guard a `NODE_ENV !== 'production'` es la forma más común de resolver esto, pero depende de que Railway efectivamente setee `NODE_ENV=production` — algo que no está verificado ni versionado en este repo. Si por lo que sea no estuviera seteado (o cambiara de convención de despliegue en el futuro), el guard callaría en falso-negativo: `synchronize` seguiría corriendo en producción exactamente igual que hoy, sin que nadie lo note.
4. Una variable de entorno dedicada y explícita (p. ej. `DB_SYNCHRONIZE`), con default `false` cuando no está seteada, no depende de ninguna convención de plataforma no verificable: el comportamiento seguro (no sincronizar) es el default en cualquier entorno donde no se setee explícitamente, incluido Railway tal cual está hoy. El costo es que el desarrollo local necesita que quien lo levante agregue `DB_SYNCHRONIZE=true` a su `.env` — cambio de una línea, a documentar en `docs/processes/dev-setup.md`.

## Options

### Option A — Gate por `NODE_ENV !== 'production'`

```ts
synchronize: configService.get<string>('NODE_ENV') !== 'production',
```

Pros:
- Patrón estándar, cero variables nuevas que documentar.

Cons:
- Depende de que `NODE_ENV=production` esté efectivamente seteado en Railway — no verificable desde este repo, y si no lo está (hoy o en el futuro), el guard no protege nada y el comportamiento actual (inseguro) continúa sin ningún cambio visible.
- Atar `synchronize` a `NODE_ENV` general acopla dos cosas independientes: el nivel de logging/optimización de Node (`NODE_ENV`) y la política de sincronización de schema. Un cambio futuro a `NODE_ENV` por cualquier otro motivo tendría un efecto colateral silencioso sobre el schema.

### Option B — Variable dedicada `DB_SYNCHRONIZE`, opt-in explícito, default `false`

```ts
synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
```

Pros:
- Seguro por default en cualquier entorno donde no esté seteada explícitamente — incluida la Railway actual, sin depender de ninguna convención de plataforma no verificable.
- Desacoplada de `NODE_ENV`: un cambio a `NODE_ENV` por cualquier otro motivo no puede tener efecto colateral sobre el schema.
- Explícita en el log/config: cualquiera que lea el `.env` local ve exactamente si el sync está prendido o no, sin tener que saber qué vale `NODE_ENV` en cada entorno.

Cons:
- Requiere actualizar `mk3_hierros_back/.env.example` y `docs/processes/dev-setup.md` para que el flujo de desarrollo local no se rompa (si alguien clona el repo y no agrega la variable, su backend local no sincroniza el schema — confuso la primera vez si no está documentado).

### Option C — Migrar a sistema de migraciones formal (elimina `synchronize` del todo)

Pros:
- Es la solución "correcta" a largo plazo: cambios de schema revisables, versionados, reproducibles, sin sorpresas en boot.

Cons:
- Superficie de cambio grande (ver Findings #2): migración inicial que capture el schema real de producción, wiring de CLI DataSource, paso de deploy nuevo en Railway, documentación de flujo nuevo. Requiere su propio análisis/plan — no es proporcional para resolver "un boot accidental no debería tocar prod".

## Recommendation

**Option B.** Resuelve el riesgo concreto (boot accidental altera prod) con un cambio de una línea + documentación, sin depender de una convención de plataforma no verificable desde este repo (a diferencia de Option A), y sin la superficie de cambio grande de Option C. Se registra Option C como el follow-up correcto a largo plazo — queda anotado en `docs/tech-debt-tracker.md` (td-001) para revisar por separado cuando el volumen de cambios de schema lo justifique.

Cambios concretos:
- `mk3_hierros_back/src/app.module.ts`: `synchronize` pasa a leer `DB_SYNCHRONIZE` (default `false`, string `'true'` para activar).
- `mk3_hierros_back/.env.example`: agregar `DB_SYNCHRONIZE=${DB_SYNCHRONIZE}`.
- `docs/processes/dev-setup.md`: documentar que el desarrollo local necesita `DB_SYNCHRONIZE=true` en `.env` para que TypeORM cree/actualice las tablas (no hay migraciones).
- `docs/tech-debt-tracker.md`: actualizar td-001 a `fixed` (o `mitigated`, ver nota) una vez aplicado.

## Open questions

- [ ] Confirmar con el usuario si Railway ya tiene o no una variable `DB_SYNCHRONIZE`/`NODE_ENV` seteada hoy — si no, hay que agregarla ahí (en el dashboard de Railway, fuera de este repo) para que producción siga sincronizando como hasta ahora tras este cambio, o decidir a propósito que producción deje de sincronizar de acá en más (lo cual, dado que no hay migraciones, congelaría la capacidad de aplicar cambios de schema en producción hasta resolver Option C).

## Risks

- Si se aplica Option B y no se setea `DB_SYNCHRONIZE=true` en las variables de entorno de Railway, producción deja de sincronizar schema en el próximo deploy. Sin sistema de migraciones, eso significa que cualquier cambio de entity futuro no se aplicaría solo con el deploy — quedaría silenciosamente desincronizado hasta que alguien lo note. Este riesgo se resuelve respondiendo la open question antes de mergear, no en el código.
