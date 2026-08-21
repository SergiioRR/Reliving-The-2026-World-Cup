# CONSTITUTION: Technical Stack & Engineering Standards

## 1. Core Technology Stack
- **Programming Language:** Strict TypeScript (`"strict": true`). The use of `any` is strictly prohibited unless formally justified and documented.
- **Mobile-First Frontend:** Angular 18+ paired with Ionic Framework (`@ionic/angular/standalone`).
  - ALL components MUST be declared as standalone (`standalone: true`), importing granular symbols directly from `@ionic/angular/standalone`.
  - STRICTLY prioritize native Ionic UI components (`<ion-header>`, `<ion-toolbar>`, `<ion-content>`, `<ion-card>`, `<ion-timeline>`, `<ion-item>`, `<ion-button>`).
- **NoSQL Database:** Google Cloud Firestore (`partidos`, `selecciones`, `estadios`, `torneos`, `configuracion`).
  - **Zero Client-Side Relational JOINs:** Match events (starting lineups, bench players, jersey numbers, goals, cards, and substitutions) must be read in $O(1)$ time from denormalized JSON documents.
- **AI Chatbot Service:** Google Gemini 1.5 Flash API.
  - Implement client-side `LocalStorage` caching and request debouncing to protect the 15 RPM free-tier quota.

## 2. ETL Data Ingestion & Physical Schema Rules
- **String Sanitization (`TRIM(REPLACE(...))`):** All text strings extracted from PostgreSQL 3NF tables (`PARTIDO`, `SELECCIÓN`, `CLUB`) MUST undergo two-layer sanitization:
  1. `REPLACE(column, 'pattern', '')`: Strips non-printable control characters and encoding artifacts.
  2. `TRIM(...)`: Removes accidental residual leading and trailing whitespace.
- **Empty Short Name Fallback:** If `nombre_corto` is empty, null, or whitespace-only, automatically assign `nombre_oficial` / `nombre_club` by default.
- **1:1 Physical Denormalization:** Treat historical club names (`nombre_historico`) as a simple scalar attribute integrated into the main `CLUB`/`EQUIPO` entity and Firestore document, discarding separate historical tables.

## 3. WCAG 2.1 AA/AAA Accessibility & CLS Protection
- **Contrast Ratios:** Maintain a minimum contrast ratio of **4.5:1** for standard body text and **3:1** for headings and graphical elements.
- **Accessible ARIA Labels:** Interactive controls, buttons, and semantic emojis (specifically `🔄` for player substitutions) MUST declare explicit descriptive accessibility attributes: `aria-label="Player substitution"`.
- **Adaptive Motion:** Respect `prefers-reduced-motion` media queries by pausing continuous animations (such as the header's national flag marquee) when enabled by the mobile OS.