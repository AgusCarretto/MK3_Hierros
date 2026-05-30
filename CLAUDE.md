# Agent Instructions

Repository entry point for any coding agent (Copilot, Claude, Codex, Gemini, or others).

## Operating principle

If it is not in the repo, it does not exist.

Any context needed to reason, implement, or review work must be written as versioned code or documentation in this repository.

## Monorepo scope

This repository contains three deliverables that must be treated as one system:

- `mk3_hierros_back/`: NestJS backend API with TypeORM entities and business modules.
- `mk3_hierros_front/`: React web catalog for customers.
- `mk3_hierros_android/`: React Native (Expo) mobile app for operational workflow.

Agents must evaluate impact across all three projects whenever a change touches shared domain concepts (work status, categories, images, API contracts).

## Session bootstrap

Before proposing code changes:

1. Read `docs/README.md`.
2. Read `ARCHITECTURE.md`.
3. Scan `docs/exec-plans/active/` and `docs/decisions/`.
4. Read only the docs tagged for the task.
5. If task touches behavior, map it to `docs/FEATURES.md`.

## Task classification

For each new request, classify as one of:

1. Change-producing: modifies shipped behavior or docs. Requires analysis doc + plan before code.
2. Investigation-only: questions or audits. No code edits.
3. Trivial: obvious non-behavioral edits (typos/wording). Can proceed directly.

If uncertain, treat as change-producing.

## Phase gates

- No code without an approved exec-plan in `docs/exec-plans/active/`.
- No exec-plan without analysis in `docs/analysis/`.
- No analysis before session bootstrap.
- On completion, move plan to `docs/exec-plans/completed/` with `status: completed`.

## Output locations

- Analysis: `docs/analysis/YYYY-MM-DD_<topic>.md`
- Decisions (ADR): `docs/decisions/NNN-<title>.md`
- Plans active: `docs/exec-plans/active/YYYY-MM-DD_<id>_<slug>.md`
- Plans completed: `docs/exec-plans/completed/`
- Process docs: `docs/processes/`
- Architecture views: `docs/architecture/`
- References: `docs/references/`
- Generated artifacts: `docs/generated/`
- Feature ledger: `docs/FEATURES.md`
- Tech debt: `docs/tech-debt-tracker.md`

## Working style

- Be direct and concise.
- Challenge weak assumptions.
- Do not silently skip phase gates.
- Keep docs synchronized with code changes.
