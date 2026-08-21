# /a11y-audit
**Description:** Executes an automated static accessibility audit across all Angular templates and Ionic components to ensure strict **WCAG 2.1 AA/AAA** compliance and layout stability (**CLS = 0**).

## Agent Execution Steps (Build Mode)
1. **Contrast Ratio Audit:**
   - Scan all CSS/SCSS files and inline styles to verify that normal body text maintains a minimum contrast ratio of **4.5:1** against its background.
   - Confirm that large headings (including the hero branding **"DOMINIO ESPAÑOL"** and the **August 19, 2026** date) maintain at least a **3:1** contrast ratio.
2. **Interactive Controls & ARIA Verification:**
   - Inspect all `<ion-button>`, `<ion-item>`, dropdown selectors, and interactive SVG jersey kits to ensure they possess descriptive `aria-label` attributes.
   - Validate that semantic emoji indicators used in the match timeline (specifically `🔄` for substitutions) explicitly declare `aria-label="Player substitution"`.
   - Verify that all custom interactive controls are keyboard navigable with proper focus indicators and focus traps.
3. **Motion & Animation Accessibility:**
   - Confirm that any CSS keyframe animation or infinite loop (such as the header's national flag marquee) implements a `prefers-reduced-motion` media query fallback to pause animations automatically when requested by the user's OS.
4. **Layout Shift Protection (CLS = 0):**
   - Audit the non-intrusive monetization containers (Google AdSense and sponsorship slots) to guarantee they declare a fixed minimum height (`min-height: 90px`) so no content displacement occurs during page rendering.