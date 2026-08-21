# Match Details Component Specification (Batch Generation & Static ETL Pipeline)

## 1. Objective & Architecture Overview
Generate static, self-contained, and fully consolidated JSON documents for all 104 matches of the FIFA World Cup 2026 application ("DOMINIO ESPAÑOL") to support the mobile-first Angular 18 + Ionic application. 
The application prioritizes **sub-millisecond load times ($O(1)$ reads)** and **zero client-side joins** on mobile devices by pre-aggregating match metadata, rosters (starters and subs), tactical pitch positioning, tournament progression logic, and chronological match events into flat static JSON files (`/assets/data/match-{matchId}.json`).

## 2. Core Business Rules & Architectural Optimizations

### 2.1. Empty Short Name Business Rule
*   When migrating teams or club rosters, if the `nombre_corto` (short name) column is `NULL`, empty (`''`), or contains whitespace-only characters, the ETL pipeline **MUST default to assigning the official team name (`nombre_oficial`) or official club name (`nombre_club`)**.

### 2.2. Strict String Sanitization (`TRIM(REPLACE(...))`)
*   Every string extracted from the relational PostgreSQL engine MUST pass through a two-tier sanitization sequence equivalent to the SQL pattern `TRIM(REPLACE(column, 'pattern', ''))`:
    1.  `REPLACE(col, pattern, '')`: Strips all non-printable control characters `[\x00-\x1f\x7f-\x9f]` and legacy encoding artifacts.
    2.  `TRIM(...)`: Removes accidental leading and trailing whitespace characters at string boundaries.

### 2.3. Flat Model & 1:1 Historical Name Denormalization
*   Empirical data profiling of the source database confirmed that club historical names follow a strict **1:1 cardinality** (at most one historical name per entity).
*   To prevent relational overhead and eliminate runtime joins, historical names are preserved as simple scalar attributes directly within the denormalized document.

---

## 3. Match Document Schema Contract (`match-{id}.json`)

Each match JSON file in `public/assets/data/match-{match_id}.json` (1 to 104) contains:
- **Root Metadata**: `matchId`, `id`, `home`, `away`, `homeTeam`, `awayTeam`, `homeTeamFifaCode`, `awayTeamFifaCode`, `homeTeamName`, `awayTeamName`, `stage`, `phase`, `date`, `stadium`, `location`, `attendance`, `status` ("Finalizado").
- **Final Score**: `homeScore`, `awayScore` (dynamically calculated from `GOL` entity adhering to 3NF).
- **Tactical Formations**: `homeFormation`, `awayFormation` (e.g., `"4-3-3"`, `"4-2-3-1"`, `"4-4-2"`, `"5-3-2"`, `"3-4-2-1"`, `"5-4-1"`, `"4-1-4-1"`).
- **Tournament Progression**:
    - If the team advances: `"homeStatus": "SIGUIENTE"` with `"homeNextMatchId": "{id}"`.
    - If the team is eliminated: `"homeStatus": "ELIMINADA"` with `"homeNextMatchId": null`.
    - Match 104 (Final): `"homeStatus": "FINALIZADO"`, `"awayStatus": "FINALIZADO"`.
- **Coaches & Referees**:
    - `homeCoach`, `homeCoachName`, `awayCoach`, `awayCoachName` (populated from `CUERPO_TECNICO` / `ENTRENADOR`).
    - `referee`, `refereeName`, `refereeCountry`, `refereeFifaCode` (populated from `EQUIPO_ARBITRAL` / `ARBITRO`).
- **Lineups (`lineups.home` and `lineups.away`)**:
    - Full 26-player roster per team (11 starters with `isStarter: true` + 15 substitutes with `isStarter: false`).
    - Exact tactical positions mapped to Ionic CSS Grid selectors (`GK, CB, LCB, RCB, LB, RB, LWB, RWB, CDM, LDM, RDM, CM, LCM, RCM, LM, RM, CAM, LAM, RAM, LW, RW, ST, CF, LS, RS, LF, RF` for starters, and `'PL'` for bench).
    - Player shirt URL: `assets/players/{team}-{dorsal}-{LASTNAME}.png`.
- **Chronological Events (`events`)**:
    - Ordered ascending by `minute`, `extraMinute`, `order`.
    - Types: `GOL`, `TARJETA`, `SUSTITUCION`.
    - Strict name alignment: `playerInName` and `playerOutName` in substitution events match the `lastName` field in `lineups` to drive 3D CSS pitch flip animations and bench substitutions.

---

## 4. Acceptance & QA Criteria
1. **Zero Client-Side Joins**: Angular `MatchDetailsComponent` renders the full score card, interactive timeline, and 3D pitch lineup by loading only `/assets/data/match-{id}.json`.
2. **Complete Roster Integrity**: 104 static match JSON files exist in `public/assets/data/`, each containing exactly 26 players per squad (11 starters + 15 bench).
3. **No Styling / Design Alteration**: All CSS grid selectors, flip keyframes, and HTML structures remain untouched.
