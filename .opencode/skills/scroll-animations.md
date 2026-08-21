# Skill: Animaciones de Scroll en Ionic + Angular (scroll-animations)

## Propósito
Instruye al agente para implementar efectos de entrada y salida basados en scroll en los componentes `<app-eternity-tournament>` y `<app-legend-world-cup>` sin degradar el rendimiento móvil[cite: 2].

## Reglas de Implementación
1. **SCSS Nativizado (`animation-timeline: view()`):**
   * Priorizar CSS moderno utilizando `animation-timeline: view()` para que las tarjetas aumenten su opacidad de 0 a 1 al entrar al viewport y disminuyan de 1 a 0 al salir por la parte superior.
2. **Fallback con IntersectionObserver en Angular 18+:**
   * Si el navegador móvil no soporta `animation-timeline`, implementar una directiva Standalone `@Directive` en TypeScript estricto que observe las tarjetas e inyecte clases CSS (`.is-visible`, `.is-leaving`).