# Technical Specification: "DOMINIO ESPAÑOL" Hero Cover (004-hero-cover)

## 1. Mission and Scope
Develop the mobile-first Hero Cover component (`<app-hero-cover>`) using Angular 18+ Standalone Components and Ionic Framework (`@ionic/angular/standalone`) to commemorate Spain's victory in the 2026 World Cup. The component must ingest the exact visual layout from Figma and ensure strict WCAG 2.1 AA/AAA accessibility compliance.

## 2. Figma Source & Visual Layering (Z-Index Hierarchy)
* **Figma Design Node:** Ingest layout and spacing from `https://www.figma.com/design/xCPfP4uw8kGFxDWmVG8Lir/Home-Mobile-View?node-id=0-1&p=f&t=Oe56oIYyjTNVXnmp-0`.
* **Layer 1 (Background & River Contrast):** 
  * Background image: NYC Skyline (`assets/images/skyline1.jpg`).
  * Apply CSS `backdrop-filter: blur(6px)` to soften architectural detail.
  * Apply a vertical linear gradient overlay: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 40%, #000000 100%)`.
  * **Critical Accessibility Guardrail:** The bottom river section must transition into absolute black (`#000000`) to guarantee that any superimposed white/gold text achieves a contrast ratio >= 4.5:1 (WCAG 2.1 AA/AAA compliant).
* **Layer 2 (Sky Emblems):**
  * Superimpose two golden glowing stars (`assets/icons/star-glow.svg`) in the upper twilight sky above the NYC skyline, representing Spain's 2010 and 2026 World Cup titles.
* **Layer 3 (Floating Champions Cutout - NO BOTTOM BORDER):**
  * Central image: Transparent WEBP cutout of the Spanish national team lifting the trophy (`assets/images/spain-champions-cutout.webp`).
  * **Critical Blending Guardrail:** The image must NEVER have a hard horizontal bottom border, solid background box, or sharp cut. The bottom of the players' legs must seamlessly blend and dissolve into the `#000000` black gradient over the Hudson River, creating the visual illusion that the players are organically floating or standing over the water.
* **Layer 4 (Typography & Native CTA Button):**
  * Brand Label: `"DOMINIO ESPAÑOL EN NORTEAMÉRICA"` (Montserrat Bold, 14px, color: `#FFCC00`, letter-spacing: `+12%`).
  * Main Headline: `"La historia más grande del fútbol español, vivida en Norteamérica"` (Montserrat ExtraBold, 24px, color: `#FFFFFF` with `"vivida en Norteamérica"` highlighted in `#FFCC00`).
  * CTA Button: Native Ionic component `<ion-button shape="round" color="danger" class="cta-explore-btn">` with text `"Explorar FWC2026 →"`.
  * **Touch Target Standard:** The `.cta-explore-btn` CSS class must enforce `min-height: 48px` and `padding: 0 28px` to surpass the mandatory 44x44 px touch target area.

## 3. Technical Constraints
* **TypeScript Strictness:** Explicitly prohibit the use of `any` types.
* **Ionic Standalone:** Do not import `IonicModule`; import granular Standalone primitives (`IonButton`, `IonIcon`, `IonContent`) from `@ionic/angular/standalone`.
* **Routing:** Clicking the CTA button must navigate via Angular's `Router` to `/partidos` without layout shifts or regressions.

## 4. Verification & Acceptance Criteria
* [ ] The NYC skyline displays bright twilight tones while the bottom Hudson River gradient remains pure black (`#000000`) for >= 4.5:1 WCAG contrast.
* [ ] The `spain-champions-cutout.webp` image blends organically into the dark background with zero visible bottom horizontal boxes, borders, or cropping lines.
* [ ] The two golden stars render cleanly in the sky without overlapping mobile status bars or header marquees.
* [ ] All interactive buttons meet or exceed the 44x44 px minimum accessible touch area.