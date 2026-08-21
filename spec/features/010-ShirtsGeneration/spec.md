## 1. Specification: Player Shirt Asset Generation (Spec-Driven Development)

### Objective
Automate the mass generation of personalized player shirts for the World Cup 2026 application using base vector designs and player data.

### Input Data
*   **Base Vectors:** Figma shirt exports located in `assets/icons/shirts/`.
*   **Player Data:** CSV file located in `assets/players.csv` containing at minimum the player's name and squad number.
*   **Database Schema Context:** To cross-reference any missing data, use the provided relational schema:
    *   `CONVOCATORIA (ID_JUGADOR, ANYO_MUNDIAL, COD_FIFA_SELECCION, DORSAL, NOMBRE_CLUB)` .
    *   `SELECCIÓN (COD_FIFA, NOMBRE_OFICIAL, APODO, FECHA_FUNDACION, CONFEDERACIÓN, COD_ISO_PAIS)` .
    *   `JUGADOR (ID_JUGADOR, POSICIÓN, ALTURA, PESO, ANYO_DEBUT, PIERNA_DOMINANTE)` .
    *   `PERSONA (ID_PERSONA, NOMBRE_APELLIDOS, F_NACIMIENTO, COD_ISO_NACIONALIDAD)` .

### Output Requirements
*   **Destination:** All generated shirt images must be saved to `assets/players/`.
*   **Format:** Optimized PNG or SVG.
*   **Naming Convention:** `[COD_FIFA]-[DORSAL]-[LASTNAME].png` (e.g., `ESP-17-YAMAL.png`).

### Processing Rules
1.  Read the base shirt vector corresponding to the team.
2.  Overlay the squad number (`DORSAL`) in the center of the shirt using the official tournament font (golden accent).
3.  Overlay the player's name above the number.
4.  Ensure WCAG 2.1 contrast compliance if text is placed on light/dark shirt backgrounds.
