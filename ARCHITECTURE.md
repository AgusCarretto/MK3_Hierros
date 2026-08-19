# MK3 Hierros Architecture

## System purpose

MK3 Hierros is a monorepo with a shared business domain for job tracking in a workshop. The backend is the source of truth; web and mobile are clients consuming the same domain model.

## Monorepo map

- `mk3_hierros_back/` (NestJS + TypeORM)
- `mk3_hierros_front/` (React web)
- `mk3_hierros_android/` (Expo React Native)

## Deployment topology

- Backend deployment target: Railway (`mk3_hierros_back/`).
- Frontend deployment target: GitHub Pages (`mk3_hierros_front/`).
- Android deployment/distribution: mobile build pipeline (outside this repo's web/backend deploy flow).

Any change that affects runtime configuration, base URLs, routing, or static asset paths must include deployment impact validation for Railway and GitHub Pages.

## Backend

Primary entry points:

- `mk3_hierros_back/src/main.ts`
- `mk3_hierros_back/src/app.module.ts`

Domain modules:

- `mk3_hierros_back/src/Categorias/`
- `mk3_hierros_back/src/Trabajos/`
- `mk3_hierros_back/src/Entity/`

Responsibilities:

- Persist categories, works, and work images.
- Expose API used by web and mobile clients.
- Enforce domain transitions and update workflows.

## Frontend web

Primary entry points:

- `mk3_hierros_front/src/index.jsx`
- `mk3_hierros_front/src/App.jsx`

Key modules:

- `mk3_hierros_front/src/components/`
- `mk3_hierros_front/src/assets/constants/`

Responsibilities:

- Customer-facing catalog and contact/portfolio pages.
- Display work cards and work detail views.

## Android app

Primary entry points:

- `mk3_hierros_android/app/index.tsx`
- `mk3_hierros_android/services/api.ts`

Key modules:

- `mk3_hierros_android/components/`
- `mk3_hierros_android/types/`
- `mk3_hierros_android/assets/`

Responsibilities:

- Operational workflow for status updates.
- Work detail interactions and image handling.

## Cross-project contracts

Shared business concepts across all projects:

- Work
- Category
- WorkImage
- Work status lifecycle

When changing these concepts, update all of:

1. Backend entities/controllers/services.
2. Frontend API consumption and UI expectations.
3. Mobile API types/components and flows.
4. Documentation (`docs/README.md`, plan/analysis artifacts).

## Common change impact checklist

- Does the backend API shape change?
- Do web/mobile type definitions need updates?
- Do status transitions remain consistent across clients?
- Are migrations or seed updates required?
- Are tests/docs updated in all impacted packages?
