# ExecPlan Specification

This file defines the minimum contract for every exec-plan in this repository.

## Required frontmatter

Each plan must include frontmatter with:

- `id`: short identifier.
- `title`: human-readable title.
- `status`: `draft`, `approved`, `in_progress`, `completed`, or `blocked`.
- `created`: ISO date.
- `updated`: ISO date.
- `owners`: list of maintainers.
- `features`: list of feature IDs from `docs/FEATURES.md`.
- `covers`: list of file globs/paths expected to change.

If a plan is feature-less, set:

- `features: []`
- `feature-less-reason: <one line>`

## Required sections

1. Purpose
2. Problem statement
3. Context and orientation
4. Scope (in/out)
5. Plan of work
6. Concrete steps
7. Validation and acceptance
8. Idempotence and rollback
9. Decision log
10. Surprises and discoveries
11. Progress
12. Outcomes and retrospective

## Lifecycle

- New plans start in `docs/exec-plans/active/`.
- On completion, move plan to `docs/exec-plans/completed/` and set `status: completed`.
- Keep progress updated as work advances.

## Quality bar

A plan is execution-ready when:

- It is self-contained.
- Terms of art are defined.
- Validation commands are explicit.
- Dependencies and risks are listed.
- `covers` is realistic and specific.
