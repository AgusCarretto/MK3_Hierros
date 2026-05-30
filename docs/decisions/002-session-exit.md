# 002 - Session Exit Checklist

## Status

Accepted

## Context

Session closure often leaves undocumented decisions or partial progress, causing context loss for the next agent.

## Decision

On explicit close-out requests, run a session-exit checklist:

1. Execute relevant verification commands.
2. Update plan progress and status.
3. Move completed plans.
4. Update docs index for new artifacts.
5. Capture unresolved follow-ups in tech debt or decisions.

## Consequences

- Better handoff quality between sessions.
- Reduced hidden chat-only context.
