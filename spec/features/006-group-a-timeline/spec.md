# Spec: Group A Match Timeline with Golden Stadium Nodes (FWC 2026)

## 1. Mission & Scope
Render the primary group-stage timeline view (starting with **GROUP A**) for the 2026 World Cup mobile application. The UI must replicate the Stitch Beta alternating layout, implement a smooth yellow-to-black header fade, display "GRUPO A", and **dynamically fetch match data from Google Firestore**. Additionally, each match node must integrate the official golden-trophy venue logo from the Figma Community vector kit via MCP.

## 2. UI/UX & Visual Requirements (Mobile-First & Ionic Native)
*   **Header Fade Gradient:**
    *   The top container must display a vibrant gold/yellow background (`#D4AF37` / `#E5C158`) that smoothly transitions vertically via CSS `linear-gradient(to bottom, #E5C158, #0A0A0A)` into the deep black page background (`#0A0A0A`).
    *   Display the uppercase title: **"GRUPO A"**.
*   **Central Golden Timeline & Golden Stadium Nodes:**
    *   A continuous vertical gold line (`#D4AF37`) along the Y-axis.
    *   **Golden Stadium Asset Binding:** At each timeline intersection, render a circular node embedding the official World Cup 2026 stadium logo featuring the **golden World Cup trophy** variant (from the official Figma Community Vector Kit, node `0-1`). The logo must dynamically match the `ESTADIO` (`NOMBRE`, `CIUDAD`) field in the match JSON document.
*   **Alternating Match Card Layout:**
    *   Using Angular's `@for` control flow, match cards (`<ion-card>`) must alternate sides relative to the central golden timeline:
        *   Even index (`i % 2 === 0`): Positioned to the **right**.
        *   Odd index (`i % 2 === 1`): Positioned to the **left**.
    *   Card content: Status badge (`FT`, `LIVE`, or kickoff time), official national team flags, 3-letter ISO country codes (`COD_ISO_PAIS`), hyphen separator, and scoreline.
    *   Bottom CTA link: **"VER DETALLES ->"** routed via Angular/Ionic navigation.

## 3. Data Requirements & Firestore Integration
*   **No Hardcoded Data:** Static mock arrays are strictly prohibited.
*   **Denormalized JSON Consumption:**
    *   Inject `FirestoreService` to query the `matches` collection, filtering by `group == 'A'` and ordered chronologically by match date or `NUM_PARTIDO_FIFA`.
    *   Each JSON document embeds venue data (`ESTADIO`), team data (`EQ_LOCAL`, `EQ_VISITANTE`, flags, `COD_FIFA_SELECCION`), and scorelines.

## 4. Accessibility (WCAG 2.1 AAA/AA Compliance)
*   Ensure a minimum contrast ratio of **4.5:1** for all text against the yellow header fade and dark card backgrounds.
*   Provide descriptive `aria-label` attributes on every interactive card and detail button (e.g., `aria-label="Ver detalles del partido España contra Portugal, marcador final 1 a 2"`).