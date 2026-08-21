# SKILL: Ionic & Angular 18+ Mobile-First Specialist

## 1. Component Architecture & Standalone Conventions
- **Strict Standalone Components:** Every Angular component MUST be declared with `standalone: true`. Never use legacy `@NgModule` declarations.
- **Granular Ionic Imports:** Import only the specific UI components needed from `@ionic/angular/standalone` (e.g., `IonHeader`, `IonToolbar`, `IonContent`, `IonCard`, `IonTimeline`, `IonItem`, `IonButton`) to optimize tree-shaking and bundle size.
- **Strict TypeScript:** Enforce strong typing across all component properties and methods. Do not use `any`.

## 2. Branding & Hero Interface ("DOMINIO ESPAÑOL")
- **Hero Typography:** Prominently feature the brand identity **"DOMINIO ESPAÑOL"** above the fold on the main dashboard, commemorating Spain's World Cup victory month.
- **Target Launch Goal:** Visually integrate the non-negotiable target date (**August 19, 2026**) within the hero introductory section or countdown timer.

## 3. Interactive Match Timelines & Lineups
- **Timeline UI:** Structure match events (goals, cards, substitutions) using native mobile timeline patterns (`<ion-timeline>` or accessible custom Ionic list structures).
- **SVG Jersey Kits:** Render starting lineups and bench players using clean SVG jersey graphics exported from Figma.
- **Substitution Animations & Emojis:** When rendering a substitution event, animate the jersey kit swap and display the semantic emoji indicator `🔄`. You MUST include an explicit accessibility attribute: `aria-label="Player substitution"`.

## 4. WCAG 2.1 AA/AAA Accessibility & CLS Protection
- **Contrast Ratio:** Maintain a minimum contrast ratio of **4.5:1** for normal text and **3:1** for large headings and graphical interface components.
- **Reduced Motion Support:** Respect the user's OS accessibility preferences using `prefers-reduced-motion`. If enabled, automatically pause infinite animations such as the header's continuous national flag marquee.
- **Zero Cumulative Layout Shift (CLS = 0):** Always reserve fixed minimum heights (`min-height: 90px`) for non-intrusive monetization containers (Google AdSense and sponsorship slots) to prevent layout shifts on mobile devices.