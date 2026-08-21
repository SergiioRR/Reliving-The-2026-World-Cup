# Specification: Feature 001 - Animated Header Marquee (DOMINIO ESPAÑOL)

## 1. Purpose & Scope
* **Goal:** Implement the top animated header marquee (`<app-header-marquee>`) for "El Mundial de mi vida" (World Cup 2026), featuring Spain's victory branding ("DOMINIO ESPAÑOL") and an infinite horizontal ticker of all 48 participating national teams from our relational `SELECCION` table.
* **Framework Stack:** Angular 18+ Standalone Components integrated with `@ionic/angular/standalone`.
* **Target Launch Date:** August 19, 2026 (Hard Deadline).

## 2. Visual Framing & Flag Anatomy Protection
* **Optical Protection Rule:** Circular flag containers (`44x44px`) MUST preserve critical national symbols (e.g., USA/Uruguay cantons, central crests) from clipping.
* **CSS Framing Strategy:** Apply `object-fit: cover` with an optical padding/scale buffer (`transform: scale(0.90)`) inside a bordered circular container (`border: 2px solid rgba(255, 204, 0, 0.4)`), OR apply fallback `object-fit: contain` on dark badges so 100% of the SVG emblem is legible.
* **SSOT Alignment:** Only render flags matching officially qualified teams from `SELECCION.COD_FIFA`.

## 3. Accessibility & Technical Standards (WCAG 2.1 AA/AAA Compliance)
* **TypeScript Strictness:** Prohibit `any` type across all interfaces and methods.
* **Touch Targets:** Minimum interactive area of 44x44 px for clickable flags routing to group matches.
* **Reduced Motion:** Enclose marquee animation within `@media (prefers-reduced-motion: reduce)` to pause movement if requested by user OS preferences.