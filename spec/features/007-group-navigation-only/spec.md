# Spec: Golden Curved Bottom Navigation Controls (FWC 2026) - ADDITIVE ONLY

## 1. Mission & Scope
Implement the `<app-group-navigation>` floating bottom controls for the World Cup 2026 Group Stage view. **CRITICAL CONSTRAINT: Do NOT modify, refactor, or touch the existing `<app-group-timeline>` header fade, alternating match cards, or golden stadium nodes.** This is a strictly additive UI component designed to float above the existing timeline.

## 2. UI/UX & Styling Requirements (Mobile-First & Ionic Native)
*   **Golden Pill Aesthetic with Curved Corners:**
    *   Bottom-Left & Bottom-Right buttons (`<ion-fab>` or fixed floating `<ion-footer>` at `bottom: 16px`).
    *   Solid premium gold background (`#D4AF37`), deep black high-contrast text and icons (`#0A0A0A`).
    *   **Curved Corners (`border-radius`):** Enforce a smooth pill border radius (`border-radius: 16px`).
    *   **Visual Highlight / Glow:** Strong elevation shadow (`box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6)`) so buttons float cleanly over scrolling cards.

## 3. Boundary-Aware Routing Rules (Angular Router)
*   **Start Limit (Group A):**
    *   Left Button: Displays **"<- INICIO"** -> Routes to `/home` (Main Dashboard).
    *   Right Button: Displays **"GRUPO B ->"** -> Routes to Group B timeline.
*   **Standard Transitions (Groups B through K):**
    *   Left Button: Displays **"<- GRUPO [PREV]"** -> Routes to previous group.
    *   Right Button: Displays **"GRUPO [NEXT] ->"** -> Routes to next group.
*   **End Limit (Group L):**
    *   Left Button: Displays **"<- GRUPO K"** -> Routes to Group K timeline.
    *   Right Button: Displays **"DIECISÉISAVOS ->"** -> Routes to `/knockouts/round-of-32`.

## 4. Accessibility (WCAG 2.1 AAA/AA Compliance)
*   Minimum interactive touch target size of **48x48px**.
*   Text contrast ratio between `#0A0A0A` and `#D4AF37` must exceed **4.5:1**.
*   Descriptive `aria-label` attributes on both controls (e.g., `aria-label="Volver a la página de Inicio"` or `aria-label="Avanzar a la fase de Dieciséisavos"`).