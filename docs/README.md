# Docs Catalog

Central index for harness artifacts in this monorepo.

## Tag vocabulary

Domain tags:

`#mk3-hierros` `#monorepo` `#backend` `#frontend` `#android` `#works` `#categories` `#work-images` `#status-lifecycle`

Technology tags:

`#nestjs` `#typeorm` `#postgresql` `#react` `#expo` `#react-native` `#railway` `#github-pages`

Type tags:

`#plan` `#analysis` `#decision` `#process` `#architecture` `#security` `#tech-debt` `#reference`

## Repo-root anchors

- `AGENTS.md` - cross-agent entry point. Tags: `#mk3-hierros` `#monorepo` `#process`
- `ARCHITECTURE.md` - monorepo architecture map. Tags: `#architecture` `#backend` `#frontend` `#android`
- `SECURITY.md` - security baseline. Tags: `#security` `#backend` `#frontend` `#android`

## Core specs

- `docs/PLANS.md` - ExecPlan contract. Tags: `#plan` `#process`
- `docs/FEATURES.md` - behavior ledger. Tags: `#mk3-hierros` `#plan`

## Processes

- `docs/processes/harness.md` - operating manual. Tags: `#process` `#ai-harness`
- `docs/processes/dev-setup.md` - local setup and commands. Tags: `#process` `#monorepo`
- `docs/processes/spec-kit.md` - how spec-kit skills map to harness phases and artifacts. Tags: `#process` `#ai-harness`

## Decisions

- `docs/decisions/001-harness-design.md` - harness decision record. Tags: `#decision` `#ai-harness`
- `docs/decisions/002-session-exit.md` - session close-out decision. Tags: `#decision` `#process`
- `docs/decisions/003-spec-kit-integration.md` - spec-kit integrated as a harness-governed tool. Tags: `#decision` `#ai-harness`

## Architecture views

- `docs/architecture/monorepo-context.md` - detailed cross-package context. Tags: `#architecture` `#monorepo`

## Deployment context

- `docs/processes/dev-setup.md` - deployment targets and deployment-aware checks. Tags: `#process` `#railway` `#github-pages`

## Tooling

- `.specify/memory/constitution.md` - spec-kit constitution, mirrors `AGENTS.md`/`ARCHITECTURE.md`/`docs/decisions/`. Tags: `#process` `#ai-harness`
- `.claude/skills/speckit-*` - spec-kit skills for Claude Code (specify, clarify, plan, tasks, analyze, checklist, implement). Tags: `#ai-harness`
- `specs/<slug>/` - spec-kit working drafts (spec.md, plan.md, tasks.md) per feature; not authoritative, see `docs/processes/spec-kit.md`. Tags: `#ai-harness`

## Templates

- `docs/analysis/_template.md` - analysis template. Tags: `#analysis` `#process`
- `docs/exec-plans/_template.md` - exec-plan template. Tags: `#plan` `#process`

## Ledgers

- `docs/tech-debt-tracker.md` - tech debt ledger. Tags: `#tech-debt`

## References

- `docs/references/README.md` - external references convention. Tags: `#reference`

## Generated

- `docs/generated/README.md` - generated artifacts convention. Tags: `#process`
