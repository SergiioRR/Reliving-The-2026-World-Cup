# SKILL: WCAG 2.1 AA/AAA Accessibility Expert

## 1. Color Contrast & Visual Hierarchy
- **Minimum Contrast Ratios:** Strictly enforce a minimum contrast ratio of **4.5:1** for standard body text and **3:1** for large headings, UI borders, and graphical icons to meet **WCAG 2.1 AA/AAA** standards.
- **Hero Branding Legibility:** Ensure the hero title **"DOMINIO ESPAÑOL"** and the **August 19, 2026** target launch date maintain maximum contrast against background hero graphics or tournament imagery.
- **Color Independence:** Never use color as the sole visual indicator for interactive states, match outcomes, or tournament stage progression.

## 2. Accessible Motion & Animated Header Marquee
- **Reduced Motion Compliance (`prefers-reduced-motion`):** Always check OS-level motion preferences using media queries. If the user has enabled reduced motion, automatically pause continuous loops such as the infinite top-bar national flag marquee.
- **Safe Animations:** Ensure no UI animation flashes more than three times per second to prevent seizures.

## 3. Keyboard Navigation, Touch Targets & Screen Readers
- **Keyboard & Focus Traps:** All interactive components (tournament stage dropdown menus, match timeline selectors, Gemini chatbot drawer) must be fully operable via keyboard (`tabindex`, visible focus rings, and proper Esc key dismissal).
- **Mobile Touch Targets:** Enforce a minimum touch target size of **44x44px** on mobile viewports for all Ionic buttons, dropdowns, and interactive jersey kits.
- **Semantic HTML & ARIA Labels:**
  - Use semantic HTML5 and native Ionic accessible components.
  - Interactive icons and visual emojis must have descriptive accessibility labels. Specifically, the substitution emoji indicator (`🔄`) in the match timeline MUST include: `aria-label="Player substitution"`.

## 4. Mobile Viewport Stability & CLS = 0
- **Zero Horizontal Overflow:** Audit mobile viewports from 320px to 430px wide to guarantee no horizontal scrollbars occur (`overflow-x: hidden`).
- **Cumulative Layout Shift (CLS = 0):** Require fixed minimum dimensions (`min-height: 90px`) on non-intrusive monetization containers (Google AdSense and sponsorship blocks) so they never push content down unexpectedly when rendering.