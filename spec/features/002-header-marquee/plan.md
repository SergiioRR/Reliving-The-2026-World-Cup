# PLAN: Animated Flag Marquee Header & "DOMINIO ESPAÑOL" Hero Branding (SPEC-001)

## 1. Architectural & Technical Approach
- **Objective:** Implement `HeaderMarqueeComponent` using Angular 18+ Standalone architecture and granular imports from `@ionic/angular/standalone`.
- **Layout Strategy:**
  - Provide a fixed top bar (`<ion-header>`) with a pre-calculated static height to ensure **Zero Cumulative Layout Shift (CLS = 0)**.
  - Render an infinite horizontal flag marquee strip at the top, immediately followed by the hero brand banner **"DOMINIO ESPAÑOL"** and the target release milestone **August 19, 2026** visible above the fold on mobile viewports.
- **Strict Typing:** Define a `NationalTeamFlag` TypeScript interface representing ISO codes, team names, and SVG image URLs.

## 2. Projected File Tree
```text
src/app/features/header-marquee/
├── header-marquee.component.ts       # Standalone component & strict TypeScript logic
├── header-marquee.component.html     # Accessible HTML5 markup with ARIA roles
├── header-marquee.component.scss     # CSS keyframes, overflow control, and WCAG rules
└── header-marquee.component.spec.ts  # Automated unit tests for rendering and contrast

## 3. Animation & Accessibility Strategy (WCAG 2.1 AA/AAA)

### Infinite Marquee (`overflow-x: hidden`):
* Use CSS `@keyframes marquee-scroll` with hardware-accelerated transforms (`transform: translate3d(...)`) for smooth mobile performance.
* Duplicate the flag list array dynamically or via CSS ribbon technique to prevent visual jumps during looping.

### Adaptive Motion (`prefers-reduced-motion: reduce`):
* Implement CSS media query rules so that when reduced motion is requested by the OS, the marquee animation halts (`animation: none`) and renders a static, accessible grid layout.

### Color Contrast Assurance:
* Verify that the **"DOMINIO ESPAÑOL"** typography against the toolbar background exceeds the **4.5:1** contrast ratio.

