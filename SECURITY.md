# Security Baseline

## Scope

This document defines minimum security checks for the MK3 Hierros monorepo.

## Data and access

- Backend must validate input at controllers/DTO boundaries.
- Avoid exposing internal errors or stack traces to clients.
- Restrict CORS and environment-driven secrets in production.

## API hardening

- Validate and sanitize upload inputs.
- Enforce content type and size limits for image uploads.
- Add rate-limiting for public write endpoints when enabled.

## Dependency hygiene

- Run dependency audits regularly for all three projects.
- Patch critical vulnerabilities before release.

## Operational checks

- Confirm environment variables are not committed.
- Verify production logging does not leak sensitive data.
- Track security debt in `docs/tech-debt-tracker.md`.

## Deployment hardening

- Railway (backend): validate secret management, production env vars, and CORS origin allowlist for deployed clients.
- GitHub Pages (frontend): avoid embedding secrets at build time and validate public asset exposure is intentional.

## Incident notes

Use `docs/decisions/` for high-impact security decisions and `docs/analysis/` for incident/postmortem investigations.
