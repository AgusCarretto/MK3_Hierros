# 003 - Integración de GitHub spec-kit como herramienta gobernada

## Status

Accepted

## Context

Ya existen desarrollos previos organizados con el harness actual (`docs/exec-plans/completed/`, `docs/decisions/001-*`, `002-*`, `docs/analysis/2026-05-30_*`). Se pidió sumar GitHub spec-kit (CLI `specify`, comandos `/speckit-*`, skills de Claude Code) como herramienta, con la condición de que el harness actual siga siendo la autoridad y lo use hacia adelante. Ver análisis completo en `docs/analysis/2026-07-24_spec-kit-integration.md`.

## Decision

- Instalar spec-kit (`specify-cli` vía `uv`) y su integración de Claude Code (`.claude/skills/speckit-*`, `.specify/`, `specs/`).
- Los comandos `/speckit-specify` y `/speckit-clarify` se usan como herramienta de redacción para la fase Investigation, pero el artefacto que gatilla el gate sigue siendo `docs/analysis/*.md`.
- Los comandos `/speckit-plan` y `/speckit-tasks` se usan para la fase Plan, pero el artefacto que gatilla el gate sigue siendo el ExecPlan en `docs/exec-plans/active/*.md` bajo el contrato de `docs/PLANS.md`.
- `/speckit-analyze` se usa como apoyo de Findings review; no genera un artefacto de autoridad nuevo.
- `/speckit-implement` (fase Execution) solo se ejecuta cuando el ExecPlan correspondiente tiene `status: approved`, igual que cualquier otra ejecución bajo este harness.
- Ante conflicto entre `specs/<slug>/plan.md` (spec-kit) y el ExecPlan (`docs/exec-plans/`), el ExecPlan es la fuente de verdad.
- `.specify/memory/constitution.md` remite a `AGENTS.md`, `ARCHITECTURE.md` y `docs/decisions/` como fuente de autoridad real, en vez de duplicar principios.
- No se toca ni se reformatea el trabajo previo (`docs/exec-plans/completed/`, `docs/decisions/001-*`, `002-*`, `docs/analysis/2026-05-30_*`).

## Consequences

Positive:

- spec-kit queda disponible como tooling estructurado sin perder el punto único de verdad para las phase gates.
- El trabajo previo permanece válido e intacto.
- La regla de desempate documentada evita que `specs/*.md` compita con el ExecPlan como fuente de autoridad.

Negative:

- Dos formatos de archivo conviven durante Investigation/Plan (`specs/*.md` como borrador, `docs/` como contrato); requiere disciplina para no confundirlos.
- Nueva dependencia externa (`uv`, `specify-cli`) a mantener/actualizar.
