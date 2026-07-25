# 2026-07-24 - Integración de GitHub spec-kit en el harness

## Problem statement

Sumar GitHub spec-kit (toolkit de Spec-Driven Development) como herramienta del harness de agentes de este repo, de modo que el harness actual (fases, phase gates, artefactos en `docs/`) siga siendo la autoridad y use spec-kit hacia adelante, sin invalidar ni reformatear el trabajo ya hecho (`docs/exec-plans/completed/`, `docs/decisions/001-*`, `002-*`, `docs/analysis/2026-05-30_*`).

## Context

Harness actual (`AGENTS.md`, `CLAUDE.md`, `docs/processes/harness.md`, `docs/PLANS.md`):

- Fases: Brief → Investigation → Findings review → Decisions → Plan → Execution.
- Gates: no analysis sin bootstrap, no exec-plan sin analysis, no código sin exec-plan aprobado.
- Contrato de ExecPlan (`docs/PLANS.md`): frontmatter (`id`, `title`, `status`, `created`, `updated`, `owners`, `features`, `covers`) + 12 secciones fijas.
- Artefactos existentes en `docs/decisions/`, `docs/exec-plans/completed/`, `docs/analysis/` que deben permanecer intactos.
- Provider-agnostic: pensado para cualquier agente (Copilot, Claude, Codex, Gemini).

## Findings

Investigación sobre spec-kit (release actual `v0.14.2`, docs oficiales en `github.github.io/spec-kit`, repo `github/spec-kit`):

- Es un toolkit de "Spec-Driven Development": especificaciones ejecutables que preceden la implementación. Agnóstico de agente (30+ integraciones).
- CLI `specify`, instalado con `uv tool install specify-cli` (requiere `uv`; no estaba instalado en esta máquina, sí Python 3.12 en `C:\Python312`).
- `specify init --here --integration claude --script sh --force` inicializa en el directorio actual (necesario `--force` porque el repo no está vacío).
- Para Claude Code, genera **skills** en `.claude/skills/speckit-*` (no comandos sueltos en `.md`), más `.specify/` (templates, `memory/constitution.md`, scripts) y `specs/<slug>/` (spec.md, plan.md, tasks.md por feature).
- Comandos: `/speckit-constitution`, `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-analyze`, `/speckit-checklist`, `/speckit-implement`, `/speckit-converge`, `/speckit-taskstoissues`.
- No hay assets de release descargables por agente en `v0.14.2` (versiones previas sí tenían zips); la única vía soportada es el CLI.
- Ya no requiere red en cada uso post-instalación; la instalación sí necesita red (PyPI/GitHub).

## Options

### Option A - Reemplazar el contrato actual por el de spec-kit

Adoptar `specs/<slug>/spec.md`/`plan.md`/`tasks.md` como los artefactos que gatillan las phase gates, dejando de usar `docs/analysis/` y `docs/exec-plans/` para trabajo nuevo.

Pros:
- Un solo sistema de archivos de planificación, sin duplicación.
- Aprovecha al máximo el tooling de spec-kit (constitution, analyze, checklist).

Cons:
- Contradice el pedido explícito: el usuario quiere que el harness actual mande y englobe, no que sea reemplazado.
- Invalida el formato de todo el trabajo previo (aunque esté completado, rompe la continuidad del sistema documental).
- Pierde el contrato específico de este repo (monorepo impact rule, features ledger) que spec-kit no modela igual.

### Option B - Instalar sin integrar

Instalar spec-kit y dejar sus skills disponibles, pero sin mapearlas a las fases del harness ni a los gates.

Pros:
- Cambio mínimo, bajo riesgo.
- Cero fricción de mantenimiento de docs.

Cons:
- No cumple "que el harness lo utilice de ahora en más" — quedaría como herramienta suelta que cualquiera podría usar para saltear el proceso (ej. correr `/speckit-implement` sin ExecPlan aprobado).
- No hay guía de cuándo usarlo vs. el flujo actual.

### Option C - Envolver: spec-kit como herramienta gobernada (recomendada)

Instalar spec-kit; sus comandos se documentan como la herramienta de redacción estructurada para las fases Investigation y Plan, pero los artefactos que gatillan las phase gates siguen siendo `docs/analysis/*.md` y `docs/exec-plans/active/*.md` con el contrato de `docs/PLANS.md`. Mapeo:

| Fase del harness | Comando spec-kit | Artefacto de autoridad |
|---|---|---|
| Investigation | `/speckit-specify`, `/speckit-clarify` | `docs/analysis/*.md` |
| Findings review | `/speckit-analyze` | (sin artefacto nuevo, solo validación) |
| Plan | `/speckit-plan`, `/speckit-tasks` | `docs/exec-plans/active/*.md` (contrato `docs/PLANS.md`) |
| Execution | `/speckit-implement` | Solo si el ExecPlan tiene `status: approved` |

En caso de conflicto entre `specs/<slug>/plan.md` y el ExecPlan correspondiente, gana el ExecPlan.

Pros:
- Cumple literalmente el pedido: el harness envuelve y gobierna, spec-kit es una herramienta interna.
- No toca ni reinterpreta el trabajo previo.
- Mantiene un único punto de verdad para las phase gates (`docs/exec-plans/active/`), evitando que `/speckit-implement` se use para saltear la aprobación.

Cons:
- Requiere mantener dos formatos de archivo en paralelo (`specs/*.md` como borrador, `docs/exec-plans` como contrato) — hay que documentar la regla de desempate para que no genere confusión.
- Overhead de documentación inicial (varios docs a tocar).

## Recommendation

Option C. Es la única que satisface la condición explícita del usuario (harness actual como autoridad, spec-kit como herramienta) sin invalidar el trabajo previo.

## Open questions

- [ ] Ninguna abierta — resuelto en sesión vía plan mode (ver `docs/decisions/003-spec-kit-integration.md`).

## Risks

- Nueva dependencia externa (`uv`, `specify-cli`) que requiere red para instalar/actualizar; mitigado fijando versión de referencia (`v0.14.2`) en la documentación.
- Confusión de autoridad entre `specs/*.md` y el ExecPlan si la regla de desempate no se sigue; mitigado documentándola en `docs/processes/spec-kit.md`, `docs/processes/harness.md` y `docs/PLANS.md`.
- Riesgo de que alguien corra `/speckit-implement` sin ExecPlan aprobado; mitigado dejándolo explícito en `AGENTS.md`/`CLAUDE.md` como regla de gate, igual que el resto del harness (no hay enforcement técnico, es igual de "honor system" que el resto del harness actual).
