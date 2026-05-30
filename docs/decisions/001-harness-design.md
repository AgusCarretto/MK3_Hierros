# 001 - Harness Engineering for MK3 Hierros

## Status

Accepted

## Context

MK3 Hierros is a monorepo with backend, web, and mobile projects sharing domain concepts. Without a harness, agents can drift by changing one package and missing impact in others.

## Decision

- Adopt a repository-first harness where AGENTS and docs are the durable control plane.
- Use a phase-gated workflow: brief -> analysis -> decisions -> plan -> execution.
- Keep plan and decision artifacts in `docs/`.
- Require cross-package impact checks for shared domain changes.
- Keep the harness provider-agnostic so it works with any coding agent.

## Consequences

Positive:

- Better consistency across backend/web/mobile.
- Lower context loss between sessions.
- More predictable review and delivery flow.

Negative:

- Higher initial process overhead for small tasks.
- Requires discipline to keep docs updated.
