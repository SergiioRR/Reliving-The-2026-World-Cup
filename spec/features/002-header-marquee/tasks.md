# TASKS: Animated Flag Marquee Header & "DOMINIO ESPAÑOL" Hero Branding (SPEC-001)

- [x] **TASK-001: Component Scaffolding & Standalone Setup**
  - [x] Generate `HeaderMarqueeComponent` with `standalone: true`.
  - [x] Import only individual symbols from `@ionic/angular/standalone` (`IonHeader`, `IonToolbar`, `IonTitle`, `IonContent`).
  - [x] Ensure no entire Ionic modules are imported into the component.

- [x] **TASK-002: Strict TypeScript Modeling & Data Source**
  - [x] Create the `NationalTeamFlag` TypeScript interface (`id: string`, `name: string`, `svgUrl: string`, `altText: string`).
  - [x] Build an immutable array of participating national teams to feed the infinite marquee strip.

- [x] **TASK-003: Hero "DOMINIO ESPAÑOL" & Release Date Layout**
  - [x] Structure the template so that **"DOMINIO ESPAÑOL"** appears prominently above the fold on mobile viewports (320px–430px width) without vertical scrolling.
  - [x] Enforce static container dimensions to guarantee **CLS = 0**.

- [x] **TASK-004: Infinite Marquee Keyframe Implementation**
  - [x] Implement `@keyframes marquee-scroll` in SCSS for seamless horizontal looping.
  - [x] Apply `overflow-x: hidden` to the parent wrapper to prevent horizontal scrollbars on mobile devices.

- [x] **TASK-005: WCAG 2.1 AA/AAA Accessibility Compliance**
  - [x] Add `@media (prefers-reduced-motion: reduce)` rules to pause animations and switch to a static grid view.
  - [x] Ensure color contrast between text and header background meets or exceeds **4.5:1**.
  - [x] Add appropriate `aria-label` and `role="region"` attributes for screen readers.

- [x] **TASK-006: Automated Testing & Visual Verification**
  - [x] Write unit tests in `header-marquee.component.spec.ts` to verify component rendering without injection errors.
  - [x] Verify zero horizontal overflow across 320px mobile viewport widths.