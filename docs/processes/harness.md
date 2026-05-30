# Harness Operating Manual

This document describes how work should flow in this monorepo for any coding agent.

## Operating principle

If it is not in the repo, it does not exist.

## Session bootstrap

1. Read `AGENTS.md`.
2. Read `docs/README.md`.
3. Read `ARCHITECTURE.md` and `docs/architecture/monorepo-context.md`.
4. Scan active plans in `docs/exec-plans/active/`.
5. Scan decisions in `docs/decisions/`.
6. Map behavior changes to `docs/FEATURES.md`.

## Workflow phases

1. Brief
2. Investigation
3. Findings review
4. Decisions
5. Plan
6. Execution

Phases do not merge. Do not skip gates silently.

## Phase gates

- No code without approved plan.
- No plan without analysis.
- No analysis without bootstrap.
- On completion, move plan to completed and sync docs.

## Artifact paths

- Analysis: `docs/analysis/`
- Decisions: `docs/decisions/`
- Plans active/completed: `docs/exec-plans/active/`, `docs/exec-plans/completed/`
- References: `docs/references/`
- Generated: `docs/generated/`

## Monorepo impact rule

For changes in shared domain concepts (Work, Category, WorkImage, status lifecycle), assess impact in:

1. `mk3_hierros_back/`
2. `mk3_hierros_front/`
3. `mk3_hierros_android/`

No change is complete until all impacted packages and docs are updated.

## Session exit

On explicit close-out signals, run this checklist:

1. Build/lint for touched packages.
2. Update plan progress.
3. Move completed plans.
4. Update `docs/README.md` index for new docs.
5. Capture leftover chat context in durable docs.
