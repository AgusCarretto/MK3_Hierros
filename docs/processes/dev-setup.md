# Developer Setup (Monorepo)

## Prerequisites

- Node.js compatible with each subproject.
- npm available.
- Java/Android SDK for Android builds.

## Install dependencies

Run per package:

- `cd mk3_hierros_back && npm install`
- `cd mk3_hierros_front && npm install`
- `cd mk3_hierros_android && npm install`

## Common commands

Backend:

- Dev: `cd mk3_hierros_back && npm run start:dev`
- Build: `cd mk3_hierros_back && npm run build`
- Test: `cd mk3_hierros_back && npm test`
- Lint: `cd mk3_hierros_back && npm run lint`

Frontend (Vite):

- Dev: `cd mk3_hierros_front && npm run dev`
- Build: `cd mk3_hierros_front && npm run build`
- Preview build: `cd mk3_hierros_front && npm run preview`
- Test: `cd mk3_hierros_front && npm test`
- Lint: `cd mk3_hierros_front && npm run lint`

Android:

- Dev: `cd mk3_hierros_android && npm run start`
- Android run: `cd mk3_hierros_android && npm run android`
- Lint: `cd mk3_hierros_android && npm run lint`

## Deployment targets

- Backend target: Railway (`mk3_hierros_back`).
- Frontend target: GitHub Pages (`mk3_hierros_front`).

## Deployment-aware checks

- Backend changes: verify Railway-required environment variables and API boot in production mode.
- Frontend changes: verify `homepage` and static paths remain compatible with GitHub Pages routing.
- Contract changes: confirm frontend/mobile API base URLs remain aligned with deployed backend.

## Suggested verification convention

For change sets spanning multiple packages, run:

1. Backend tests and lint.
2. Frontend tests.
3. Android lint.

Then update affected feature states in `docs/FEATURES.md`.
