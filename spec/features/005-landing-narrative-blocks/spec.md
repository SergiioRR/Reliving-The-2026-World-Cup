# Technical Specification: Landing Narrative Blocks & Scroll Animations (005-landing-narrative-blocks)

## 1. Mission and Scope
Develop the mobile-first narrative section (`<app-landing-narrative>`) using Angular 18+ Standalone Components and Ionic Framework (`@ionic/angular/standalone`) to display the two dark-mode editorial blocks below the Hero section. The component must implement highly responsive scroll-driven entrance and exit animations while leaving clean content placeholders for the user's final text and images.

## 2. Visual Architecture & Layout (From Stitch Beta Mockup)
* **Theme & Palette:** Strict dark mode background (`#000000` to `#0A0A0A`), using golden yellow accents (`#FFCC00`) for badges, labels, and icons, and pure white (`#FFFFFF`) for primary typography to ensure WCAG 2.1 AA/AAA contrast ratios (>= 4.5:1).
* **Block 1 (`<app-eternity-card>`):**
  * Horizontal/Stacked editorial card featuring an image placeholder container on the left/top and a structured narrative text area on the right/bottom.
  * Includes a pill badge placeholder (`#FFCC00` text/border), a main headline placeholder, and two descriptive paragraph slots.
* **Block 2 (`<app-legend-card>`):**
  * Split promotional card featuring key statistical highlights on the left/top (e.g., big stat callout `"7"`, subtitle, and golden star icon placeholder) and a vertical poster placeholder container on the right/bottom (`"DOMINIO ESPAÑOL 2026"` poster).
* **Content Placeholders:** All image containers (`<div class="image-placeholder">`) and text nodes must use semantic Angular `@Input()` bindings or clean dummy slots so the author can inject custom photography and historical copy later without altering the layout structure.

## 3. Scroll-Driven Animations (Entrance & Exit Transitions)
* **Cinematic Scroll Behavior:** Cards must feel alive during vertical scrolling:
  * **Below Viewport (Pre-entrance):** Initial state set to `opacity: 0` and `transform: translateY(48px) scale(0.98)`.
  * **Entering Viewport (0% - 30% intersection):** Smooth fade-in and upward translation to `opacity: 1` and `transform: translateY(0) scale(1)`.
  * **Active Reading Zone (30% - 70% intersection):** Fully visible and stable (`opacity: 1`).
  * **Exiting Viewport Upwards (70% - 100% intersection):** Progressive fade-out (`opacity: 0.15` to `0`) as the card scrolls past the upper screen edge.
* **Technical Implementation:**
  * Prioritize modern native CSS Scroll-Driven Animations (`animation-timeline: view(); animation-range: entry 0% cover 30%, exit 70% cover 100%;`).
  * Provide an Angular 18+ Standalone IntersectionObserver directive (`@Directive`) as a performant mobile fallback to toggle `.is-visible` and `.is-exiting` CSS classes without causing DOM reflows.

## 4. Engineering Constraints & WCAG Compliance
* **TypeScript Strictness:** Explicitly prohibit the use of `any` types across all directives and component properties.
* **Ionic Standalone:** Do not import the monolithic `IonicModule`; import only required Standalone primitives (`IonCard`, `IonCardHeader`, `IonCardContent`, `IonIcon`) from `@ionic/angular/standalone`.
* **Touch Target Accessibility:** All clickable cards or interactive badges must enforce a minimum interactive bounding box of **44x44 px**.

## 5. Acceptance Criteria (Verification Checklist)
* [ ] Both dark-mode editorial cards render cleanly on a 393px mobile viewport without horizontal scrolling (`overflow-x: hidden`).
* [ ] Cards smoothly fade in from bottom when scrolling down and fade out when leaving the top of the viewport.
* [ ] Text and image placeholders are decoupled from structural CSS, allowing instant asset swapping.
* [ ] Contrast ratios between golden/white text placeholders and dark card backgrounds exceed 4.5:1.