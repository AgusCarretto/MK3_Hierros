# Features Ledger

Canonical list of user-visible behaviors.

## Not started

| ID | Behavior | Verify | State | Source | Notes |
|---|---|---|---|---|---|
| feat-001 | Public website shows a portfolio of works from backend data | `cd mk3_hierros_front && npm test -- --watchAll=false` | not_started | inferred | Validate data integration once API is wired end-to-end |
| feat-002 | Mobile app can list works and update work status | `cd mk3_hierros_android && npm run lint` | not_started | inferred | Add automated tests when mobile test harness is defined |
| feat-003 | Backend exposes work/category/image endpoints consumed by clients | `cd mk3_hierros_back && npm test` | not_started | inferred | Add e2e coverage for contract-critical routes |

## Active

| ID | Behavior | Verify | State | Source | Notes |
|---|---|---|---|---|---|
| feat-004 | Al navegar a `/trabajo/:id` el Hero de presentación no se muestra; solo navbar + contenido del trabajo | `cd mk3_hierros_front && npm test -- --watchAll=false` | active | exec-plan front-001 | Ver `docs/exec-plans/active/2026-05-30_front-001_hide-hero-on-work-detail.md` |

## Blocked

| ID | Behavior | Verify | State | Source | Notes |
|---|---|---|---|---|---|

## Failing

| ID | Behavior | Verify | State | Source | Notes |
|---|---|---|---|---|---|

## Passing

| ID | Behavior | Verify | State | Source | Notes |
|---|---|---|---|---|---|
