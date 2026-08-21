# AGENTS.md — World Cup 2026: "DOMINIO ESPAÑOL" Mobile-First App

This repository contains a mobile-first web application built to commemorate "El Mundial de Mi Vida" and the Spanish dominance ("DOMINIO ESPAÑOL"), with an unnegotiable target launch date of August 19, 2026.

## Stack
- Language: Strict TypeScript
- Frontend Framework: Angular 18+ Standalone Architecture
- UI Library: Ionic Framework (`@ionic/angular/standalone` using granular imports only)
- Styling: Tailwind CSS & Native CSS Keyframe Animations
- Database: PostgreSQL (Docker container, 25 3NF relational tables) migrated to Google Cloud Firestore via Python ETL scripts
- Accessibility Target: WCAG 2.1 AA/AAA strict compliance

## Commands
- `npm run start` — Starts the local Angular/Ionic development server
- `npm run test` — Runs unit tests (must pass before any commit or PR)
- `npm run lint` — Runs TypeScript and style linter checks
- `npm run build` — Builds the production bundle

## Project Structure
- `src/app/features/` — Standalone Angular feature components (e.g., `header-marquee`, `timeline`, `lineups`).
- `src/app/core/` — Core services, Firestore database connectors, and Gemini 1.5 Flash chatbot integrations.
- `spec/features/` — Spec-Driven Development (SDD) anchors (`spec.md`, `plan.md`, `tasks.md`).
- `scripts/` — Python migration and data-cleaning scripts (PostgreSQL to Firestore JSON documents).

## Conventions
- Standalone Only: Every Angular component MUST be declared as `standalone: true`.
- Granular Imports: NEVER import full Ionic modules; import only granular symbols (e.g., `IonHeader`, `IonToolbar`, `IonTitle`, `IonContent`).
- Accessibility First: Every UI component MUST maintain a contrast ratio >= 4.5:1 and support `@media (prefers-reduced-motion: reduce)`.
- Cumulative Layout Shift (CLS): Ensure zero layout shifts (CLS = 0) by defining static height and width dimensions for headers and hero banners.

## Do Not
- NEVER use `any` in TypeScript without explicit justification.
- NEVER commit `.env` or secret API key files to the repository.
- NEVER introduce horizontal scrollbars on mobile viewports (320px to 430px width).
- NEVER alter the historical database schema in `scripts/` without updating `README.md` technical decisions.

## Workflow
- Follow Spec-Driven Development (SDD): Do not generate production code without an approved `spec.md`, `plan.md`, and `tasks.md`.
- Operate in Plan Mode first for multi-file architectural changes before switching to Build Mode.
- Run local unit tests after completing each task to verify functionality.

## Documentation
- Refer to `README.md` for technical memoirs, PostgreSQL schema rules, string cleaning logic, and physical database design decisions.