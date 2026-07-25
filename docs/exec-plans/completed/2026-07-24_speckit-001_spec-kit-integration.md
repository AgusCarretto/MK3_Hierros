---
id: speckit-001
title: Integrar GitHub spec-kit como herramienta gobernada por el harness
status: completed
created: 2026-07-24
updated: 2026-07-24
owners:
  - Mateo Tambasco
features: []
feature-less-reason: Cambio de tooling/proceso del harness de agentes, no comportamiento de producto visible para usuarios finales.
covers:
  - AGENTS.md
  - CLAUDE.md
  - docs/PLANS.md
  - docs/README.md
  - docs/processes/harness.md
  - docs/processes/spec-kit.md
  - docs/decisions/003-spec-kit-integration.md
  - .specify/**
  - specs/**
  - .claude/skills/speckit-*
---

# Integrar GitHub spec-kit como herramienta gobernada por el harness

## Purpose

Sumar GitHub spec-kit al harness de este repo como herramienta de redacción estructurada para las fases Investigation y Plan, manteniendo el harness actual (`docs/exec-plans`, `docs/PLANS.md`, phase gates) como única autoridad para gatillar código.

## Problem statement

El usuario tiene desarrollos previos organizados con el harness actual y pidió agregar spec-kit "como herramienta del harness", con el harness envolviéndolo y usándolo de ahora en más, sin perder ni reformatear lo ya hecho.

## Context and orientation

- Harness actual: `AGENTS.md` / `CLAUDE.md` (casi idénticos), `docs/processes/harness.md` (fases y gates), `docs/PLANS.md` (contrato ExecPlan).
- Trabajo previo a preservar sin tocar: `docs/exec-plans/completed/2026-05-30_front-001_*.md`, `2026-05-30_perf-001_*.md`, `docs/decisions/001-*.md`, `002-*.md`, `docs/analysis/2026-05-30_*.md`.
- Decisión de diseño ya tomada: `docs/decisions/003-spec-kit-integration.md` (Option C - envolver).
- Análisis previo: `docs/analysis/2026-07-24_spec-kit-integration.md`.
- Entorno: Windows, sin `uv` instalado; Python 3.12 disponible en `C:\Python312`; Bash tool = Git Bash (POSIX sh) disponible además de PowerShell.

## Scope

### In scope

- Instalar `uv` y `specify-cli`.
- Ejecutar `specify init --here --integration claude --script sh --force` en la raíz del repo.
- Ajustar `.specify/memory/constitution.md` para remitir a `AGENTS.md`/`ARCHITECTURE.md`/`docs/decisions/`.
- Documentar la integración en `AGENTS.md`, `CLAUDE.md`, `docs/processes/harness.md`, `docs/PLANS.md`, `docs/README.md`.
- Crear `docs/processes/spec-kit.md` con la guía de uso y tabla de mapeo fase→comando.

### Out of scope

- Migrar `docs/exec-plans/completed/`, `docs/decisions/001-*`, `002-*`, `docs/analysis/2026-05-30_*` al formato de spec-kit.
- Tocar `docs/FEATURES.md`.
- Cambiar el contrato de frontmatter/secciones de `docs/PLANS.md`.
- Cualquier trabajo de producto en `mk3_hierros_back/front/android`.

## Plan of work

1. Instalar dependencias (`uv`, `specify-cli`).
2. Inicializar spec-kit en el repo existente.
3. Alinear `constitution.md` con la autoridad real del repo.
4. Documentar la integración en todos los puntos de entrada del harness (AGENTS.md/CLAUDE.md/harness.md/PLANS.md/README.md) más una guía dedicada.
5. Validar que nada del trabajo previo se haya tocado y que el flujo quede consistente.

## Concrete steps

- [x] `python -m pip install --user uv`
- [x] `uv tool install specify-cli` (fallback: `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.14.2` si PyPI falla) — no fue necesario, PyPI tenía `specify-cli==0.14.2`
- [x] `specify init --here --integration claude --script sh --force` en la raíz del repo
- [x] Editar `.specify/memory/constitution.md` generado para remitir a `AGENTS.md`, `ARCHITECTURE.md`, `docs/decisions/`
- [x] Agregar sección "Tooling" a `AGENTS.md` y `CLAUDE.md`
- [x] Agregar mapeo fase→comando a `docs/processes/harness.md`
- [x] Crear `docs/processes/spec-kit.md`
- [x] Agregar nota de sourcing a `docs/PLANS.md`
- [x] Agregar entradas nuevas al catálogo de `docs/README.md`
- [x] `uv tool update-shell` para persistir `.local/bin` en el PATH del usuario (necesario fuera de la sesión de este agente)
- [x] Validar (ver sección siguiente)

## Validation and acceptance

- `specify --version`
- `ls .claude/skills` muestra skills `speckit-*`
- `git status` / `git diff --stat` confirma que `docs/exec-plans/completed/`, `docs/decisions/001-*.md`, `002-*.md`, `docs/analysis/2026-05-30_*.md`, `docs/FEATURES.md` no figuran como modificados
- Lectura cruzada de `AGENTS.md`, `CLAUDE.md`, `docs/processes/harness.md`, `docs/PLANS.md`, `docs/processes/spec-kit.md`: todos coinciden en que el ExecPlan es la autoridad final ante conflicto con `specs/*.md`

## Idempotence and rollback

- Reinstalación: `specify init --here --force` es idempotente (regenera archivos gestionados por spec-kit).
- Rollback completo: `uv tool uninstall specify-cli`; borrar `.specify/`, `specs/`, `.claude/skills/speckit-*`; `git checkout --` sobre los docs tocados en este plan.

## Decision log

- Se eligió Option C (envolver) sobre reemplazar o instalar sin integrar. Ver `docs/decisions/003-spec-kit-integration.md`.
- Instalación de `uv` vía `pip install` en lugar del instalador remoto (`irm ... | iex`) para evitar ejecutar un script de red sin revisión, aprovechando que ya hay Python 3.12 instalado.
- `--script sh` elegido porque el Bash tool (Git Bash) es el shell más usado en la sesión de este agente, aunque PowerShell también está disponible.

## Surprises and discoveries

- spec-kit `v0.14.2` ya no publica zips de release por agente; la única vía de instalación es el CLI vía `uv`.
- Para Claude Code, spec-kit no genera comandos de barra sueltos sino **skills** en `.claude/skills/speckit-*`.

## Progress

- 2026-07-24: Analysis, ADR y este ExecPlan creados y aprobados en la misma sesión (vía plan mode). Instalación, documentación y validación completadas en la misma sesión.

## Outcomes and retrospective

- spec-kit `v0.14.2` quedó instalado y operable (`specify --version` → `specify 0.14.2`), con skills en `.claude/skills/speckit-*` (nombres reales con guion: `speckit-specify`, no `speckit.specify` como se asumió inicialmente en el análisis; corregido en todos los docs).
- `specs/` no se creó todavía porque spec-kit lo genera recién al primer uso de `speckit-specify`; no afecta el resultado, queda documentado en `docs/processes/spec-kit.md`.
- `git status` confirmó que `docs/exec-plans/completed/`, `docs/decisions/001-*`, `002-*`, `docs/analysis/2026-05-30_*` y `docs/FEATURES.md` no fueron tocados.
- Validación completa: `specify --version` corre, `.claude/skills/` tiene los 10 skills esperados, PATH persistido con `uv tool update-shell`.
