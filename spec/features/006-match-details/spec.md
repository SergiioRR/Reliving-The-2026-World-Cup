# Specification: MatchDetailsComponent (Timeline & Lineups)

## 1. Context & Objective
The `MatchDetailsComponent` displays the chronological events (Timeline) and the tactical formations (Lineups) of a World Cup 2026 match. The component must be fully reactive, using Angular 18 Signals for state management, and optimized for mobile devices with strict TypeScript typing.

## 2. Acceptance Criteria
* **State Management:** All component state (`matchDetails`, `matchEvents`, `lineups`, `currentSegment`, `loadError`, `debugStatus`) must be managed using Angular 18 `signal()` and `computed()`.
* **Control Flow:** The HTML template must use modern Angular 18 control flow (`@if`, `@for`) instead of legacy structural directives (`*ngIf`, `*ngFor`).
* **Asynchronous Data Handling:** The TS controller must resolve all RxJS observables (e.g., `getMatchDetails`, `getLineups`, `getMatchEvents`) and update the respective Signals using `.set()`. No RxJS subscriptions should exist in the template.
* **Design & Animations:** The existing CSS Grid for the football pitch and the SCSS keyframe animations must remain fully functional and intact.
* **Accessibility & UI:** The design must respect the "DOMINIO ESPAÑOL" premium UI scheme (dark mode, golden accents).

## 3. Data Model
* The component consumes flat JSON structures (e.g., `match-5.json`) served by the `MatchDetailsService`.
* Data cleanliness is guaranteed by the backend (trimmed strings, no empty team names).
