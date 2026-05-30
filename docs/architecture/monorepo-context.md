# Monorepo Context Map

## Product flow

1. Backend manages canonical data for works, categories, and images.
2. Web consumes data for public showcase.
3. Android consumes and updates data for operations.

## Deployment context

- Backend is deployed on Railway.
- Frontend is deployed on GitHub Pages.
- Android app is operated via Expo/native mobile workflows.

Deployment-sensitive changes to API origin, CORS, static paths, SPA routing fallback, or environment variables must be reviewed against these targets.

## Backend context

- Framework: NestJS.
- Data layer: TypeORM entities under `mk3_hierros_back/src/Entity/`.
- Main domains:
  - Categories (`mk3_hierros_back/src/Categorias/`)
  - Works (`mk3_hierros_back/src/Trabajos/`)

## Frontend context

- Framework: React (CRA scripts).
- Main UI areas in `mk3_hierros_front/src/components/`.
- Domain constants/images in `mk3_hierros_front/src/assets/`.

## Android context

- Framework: Expo + React Native.
- API client in `mk3_hierros_android/services/api.ts`.
- Domain types in `mk3_hierros_android/types/`.
- Main screens/components in `mk3_hierros_android/components/` and `mk3_hierros_android/app/`.

## Shared domain entities

- Work
- Category
- WorkImage
- Work status

## Cross-package change examples

- If backend changes status enum names, update mobile status selector and web filters.
- If backend changes image payload shape, update mobile upload handling and web rendering.
- If backend route names change, update API client calls in mobile and web.
