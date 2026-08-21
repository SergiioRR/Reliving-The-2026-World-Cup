# SPEC 003: Main Navigation, Tournament Phase Menu & Match Timeline with Animated Lineup Substitutions

## 1. Overview & Objectives
- **Feature Name:** Tournament Phase Navigation & Interactive Match Timeline (`003-nav-and-timeline`).
- **Goal:** Implement a mobile-first Angular 18+ Standalone navigation system and match presentation UI using native Ionic Framework components (`@ionic/angular/standalone`). It must allow users to browse World Cup 2026 phases, inspect match timelines (`<ion-list>`, `<ion-item>`), and visualize starting lineups with interactive player substitutions (`🔄`) over community-provided Figma jersey kits.
- **Brand Alignment:** Maintain the core visual identity around **"DOMINIO ESPAÑOL"** across all phase headers and match spotlights.

## 2. Functional & Architecture Requirements
- **Tournament Phase Navigation:**
  - Structure a responsive navigation menu covering all official tournament stages: **Fase de Grupos** (with expandable dropdowns/accordions for groups A–L), **Dieciseisavos** (Round of 32), **Octavos** (Round of 16), **Cuartos** (Quarterfinals), **Semifinales** (Semifinals), **3º/4º puesto**, and **Final**.
  - Use native Ionic navigation and segment controls (`IonSegment`, `IonAccordionGroup`, `IonAccordion`) for smooth touch interactions.
- **Match Timeline Presentation:**
  - Display match events chronologically using Ionic list structures (`<ion-list>`, `<ion-item>`) with clear visual iconography for goals, yellow/red cards, and substitutions.
  - All match data must be consumed from single denormalized Firestore JSON documents per match (guaranteeing O(1) read performance without runtime joins).
- **Interactive Lineups & Animated Substitutions (`🔄`):**
  - Render soccer field visual layouts showing starting XI lineups and substitute benches using Figma-exported jersey/player kit graphics (`src/assets/kits/`).
  - As the user scrubs through or plays the match timeline, player substitutions must dynamically animate: the outgoing player transitions out while the incoming player transitions onto the pitch accompanied by a prominent **`🔄`** visual indicator and smooth CSS keyframe transforms.

## 4. WCAG 2.1 AA/AAA Accessibility & Resilience
- **Contrast Compliance:** All text elements (match scores, player names, minute markers) MUST maintain a minimum contrast ratio of **4.5:1** against pitch/background colors.
- **Touch Targets:** Interactive elements (phase buttons, timeline scrubbers, lineup cards) MUST meet or exceed the **44x44 px** minimum touch target dimension.
- **Motion Accessibility:** CSS transform animations for substitutions MUST listen to `@media (prefers-reduced-motion: reduce)` and switch to an instant state change if enabled.

## 5. Acceptance Criteria (Verification Checklist)
- [ ] Component architecture uses `standalone: true` and granular symbols from `@ionic/angular/standalone`.
- [ ] Navigation menu successfully filters matches across all 7 tournament phases (Group Stage through Final).
- [ ] Match timeline renders chronological events (`GOL`, `TARJETA`, `SUSTITUCION`) cleanly from a single Firestore JSON document.
- [ ] Lineup view renders Figma jersey kit assets without hardcoded SVG paths.
- [ ] Triggering a substitution event visually displays the `🔄` indicator and animates the player swap (or instantly swaps when `prefers-reduced-motion` is active).
- [ ] Text contrast ratios check out >= 4.5:1 and touch targets measure >= 44x44 px.