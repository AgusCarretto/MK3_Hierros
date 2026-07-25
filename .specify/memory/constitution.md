# MK3 Hierros Constitution

Este archivo no es la fuente de autoridad de este repo. La autoridad real vive en `AGENTS.md` (entry point para cualquier agente), `ARCHITECTURE.md` y `docs/decisions/`. Este archivo resume esos principios para que las skills `speckit-*` los respeten; ante cualquier discrepancia, gana `AGENTS.md`/`docs/decisions/`.

## Core Principles

### I. Repo-first
Si no está en el repo, no existe. Todo contexto necesario para razonar, implementar o revisar trabajo debe quedar como código o documentación versionada. Ver `AGENTS.md`.

### II. Phase-gated harness
No hay código sin un exec-plan aprobado en `docs/exec-plans/active/`; no hay exec-plan sin análisis en `docs/analysis/`; no hay análisis sin bootstrap de sesión. Ver `docs/processes/harness.md` y `docs/PLANS.md`.

### III. Monorepo como un solo sistema
`mk3_hierros_back/`, `mk3_hierros_front/` y `mk3_hierros_android/` comparten conceptos de dominio (Work, Category, WorkImage, status lifecycle). Cualquier cambio a esos conceptos debe evaluar impacto en los tres proyectos. Ver `ARCHITECTURE.md`.

### IV. spec-kit es una herramienta, no la autoridad
Las skills `speckit-*` se usan como apoyo de redacción para las fases Investigation y Plan del harness. El artefacto que gatilla las phase gates sigue siendo `docs/analysis/*.md` (Investigation) y el ExecPlan en `docs/exec-plans/active/*.md` bajo el contrato de `docs/PLANS.md` (Plan). Ante conflicto entre `specs/<slug>/plan.md` y el ExecPlan correspondiente, gana el ExecPlan. `speckit-implement` solo se corre con el ExecPlan en `status: approved`. Ver `docs/decisions/003-spec-kit-integration.md` y `docs/processes/spec-kit.md`.

## Additional Constraints

Provider-agnostic: el harness y esta constitution deben seguir siendo válidos para cualquier agente de código (Copilot, Claude, Codex, Gemini), no solo Claude Code.

## Development Workflow

Brief → Investigation → Findings review → Decisions → Plan → Execution, según `docs/processes/harness.md`. Al cerrar sesión, correr el checklist de `docs/decisions/002-session-exit.md`.

## Governance

Esta constitution es un resumen derivado; no se edita como fuente primaria. Cambios de fondo a los principios se hacen en `AGENTS.md`/`CLAUDE.md`/`docs/decisions/` y después se reflejan acá.

**Version**: 1.0.0 | **Ratified**: 2026-07-24 | **Last Amended**: 2026-07-24
