# Using spec-kit inside this harness

GitHub spec-kit is installed in this repo (`specify-cli` via `uv`, skills in `.claude/skills/speckit-*`). It is a drafting tool subordinate to the harness defined in `docs/processes/harness.md` and `docs/PLANS.md`. See `docs/decisions/003-spec-kit-integration.md` for why it was integrated this way instead of replacing the existing contract.

## Rule of thumb

spec-kit skills help you *write* the artifacts. They are not the artifacts the phase gates check. The gate-satisfying artifact is always the one under `docs/`.

## Phase → command → artifact of authority

| Harness phase | spec-kit skill | What it produces | Artifact of authority |
|---|---|---|---|
| Investigation | `speckit-specify` | `specs/<slug>/spec.md` | `docs/analysis/YYYY-MM-DD_<topic>.md` |
| Investigation (optional) | `speckit-clarify` | Q&A appended to `spec.md` | folded into the same analysis doc |
| Findings review (optional) | `speckit-analyze` | consistency report across spec/plan/tasks | none — advisory only |
| Plan | `speckit-plan` + `speckit-tasks` | `specs/<slug>/plan.md`, `tasks.md` | `docs/exec-plans/active/YYYY-MM-DD_<id>_<slug>.md` (frontmatter + 12 sections per `docs/PLANS.md`) |
| Plan (optional) | `speckit-checklist` | quality checklist | informs the ExecPlan's "Validation and acceptance" section |
| Execution | `speckit-implement` | code changes from `tasks.md` | only run once the matching ExecPlan has `status: approved` |

`speckit-constitution` and `speckit-converge` are not part of the normal flow here: project principles live in `AGENTS.md`/`ARCHITECTURE.md`/`docs/decisions/`, mirrored (not duplicated) in `.specify/memory/constitution.md`. `speckit-taskstoissues` is unused unless the team starts tracking work in GitHub Issues.

## Tie-break rule

If `specs/<slug>/plan.md` or `spec.md` ever says something different from the corresponding `docs/exec-plans/active/*.md` or `docs/analysis/*.md`, **the `docs/` artifact wins**. Update `specs/` to match, or note the divergence in the ExecPlan's "Decision log".

## Worked example

1. Brief: user asks for a new feature.
2. Investigation: run `speckit-specify` to draft `specs/<slug>/spec.md`; distill it into `docs/analysis/YYYY-MM-DD_<topic>.md` (required sections: Problem statement, Context, Findings, Options, Recommendation, Open questions, Risks).
3. Decisions: if the analysis surfaces an architectural choice, write `docs/decisions/NNN-<title>.md` as usual.
4. Plan: run `speckit-plan` + `speckit-tasks`; use their output to write `docs/exec-plans/active/YYYY-MM-DD_<id>_<slug>.md` with `status: draft`, then get it approved (`status: approved`).
5. Execution: run `speckit-implement` only now. Update the ExecPlan's Progress section as work lands.
6. Session exit: move the ExecPlan to `docs/exec-plans/completed/`, update `docs/README.md` and `docs/FEATURES.md` per `docs/decisions/002-session-exit.md`.

## What was preserved

Nothing about this integration touches or reformats prior work: `docs/exec-plans/completed/2026-05-30_front-001_*.md`, `2026-05-30_perf-001_*.md`, `docs/decisions/001-*.md`, `002-*.md`, `docs/analysis/2026-05-30_*.md` remain exactly as they were, in their original format, outside the spec-kit workflow.
