# 🏆 REVIVE EL MUNDIAL DE NORTEAMÉRICA — "DOMINIO ESPAÑOL" 2026

> **A mobile-first Angular/Ionic web application commemorating Spain's triumph at the 2026 FIFA World Cup.**

| | |
|---|---|
| **Launch Date** | August 19, 2026 |
| **Brand Identity** | DOMINIO ESPAÑOL |
| **Academic Context** | 3rd Year Computer Engineering Portfolio — Universidad de Zaragoza (EINA) |
| **Live URL** | Firebase App Hosting (Angular SSR) |

---

## Table of Contents

1. [Vision & Concept](#1-vision--concept)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Features & Components](#4-features--components)
5. [Data Architecture & ETL Pipeline](#5-data-architecture--etl-pipeline)
6. [AI Chatbot — Naranjito](#6-ai-chatbot--naranjito)
7. [Design System & Accessibility](#7-design-system--accessibility)
8. [Database Schema (PostgreSQL 3NF)](#8-database-schema-postgresql-3nf)
9. [Data Engineering Decisions](#9-data-engineering-decisions)
10. [Scripts & Tooling](#10-scripts--tooling)
11. [Commands](#11-commands)
12. [Deployment](#12-deployment)

---

## 1. Vision & Concept

This is a personal commemorative web application built to immortalize Spain's dominant performance at the 2026 FIFA World Cup — hosted across the United States, Canada, and Mexico. The app tells the story of the tournament from a Spanish perspective, blending historical football data with an immersive, premium mobile experience.

The core branding concept, **"DOMINIO ESPAÑOL"**, is expressed across every UI layer: from the animated victory marquee at the top of the screen to the golden (#F1BF00) accent color used throughout the interface.

**Key Product Goals:**
- Deliver a **cinematic, narrative-driven** experience of the 2026 World Cup
- Provide **detailed match data** for all 104 games of the tournament
- Enable fans to explore **group tables, knockout brackets, lineups, and statistics**
- Offer an **AI-powered chatbot** (Naranjito) capable of answering natural language questions about the tournament
- Maintain strict **WCAG 2.1 AA/AAA** accessibility compliance

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Language | **TypeScript** (strict mode — `any` is prohibited) |
| Frontend Framework | **Angular 18+** (Standalone Components Architecture) |
| UI Component Library | **Ionic Framework** (`@ionic/angular/standalone`, granular imports only) |
| Styling | **Tailwind CSS** + Native CSS Keyframe Animations |
| Source Database | **PostgreSQL** (Docker container, 25 relational 3NF tables) |
| Production Database | **Google Cloud Firestore** (NoSQL, denormalized documents) |
| ETL Pipeline | **Python 3** (`scripts/export_match.py`, `scripts/run_chatbot_queries.py`) |
| AI Chatbot | **Google Gemini 1.5 Flash** API (15 RPM quota, LocalStorage caching) |
| Deployment | **Firebase App Hosting** (Angular SSR + CDN) |
| Design Tooling | **Figma** (MCP integration via Antigravity IDE + Stitch Beta) |

---

## 3. Project Structure

```
mundial-2026-web/
│
├── public/
│   └── assets/
│       ├── data/               # 104 match JSON files + chatbot-data.json
│       ├── flags/              # SVG team flags (48 nations)
│       ├── groups/             # SVG group bracket graphics (A–L)
│       ├── images/             # Hero images, narrative artwork
│       ├── players/            # Player shirt image assets
│       ├── icons/              # App icons and favicon
│       └── team_colors.json    # National team primary/secondary colors
│
├── scripts/
│   ├── export_match.py         # PostgreSQL → JSON export (104 match files)
│   └── run_chatbot_queries.py  # PostgreSQL → chatbot-data.json (660 SQL queries)
│
├── src/
│   └── app/
│       ├── app.routes.ts       # Application routing configuration
│       ├── app.config.ts       # Firebase + Ionic + Router providers
│       │
│       ├── core/
│       │   ├── services/
│       │   │   ├── firestore.service.ts      # Firestore read layer
│       │   │   ├── match-data.service.ts     # Match JSON loader (local assets)
│       │   │   ├── match-details.service.ts  # Full match detail aggregation
│       │   │   └── chat.service.ts           # Gemini API + cache + RAG context
│       │   └── directives/
│       │       └── scroll-animate.directive.ts  # Intersection Observer scroll animations
│       │
│       ├── shared/
│       │   └── ad-banner.component.ts        # Reserved AdSense slot (CLS = 0)
│       │
│       └── features/
│           ├── header-marquee/               # Sticky animated victory banner + flags
│           ├── home/
│           │   ├── hero-cover/               # Full-screen hero image with Spain branding
│           │   ├── landing-narrative/        # Scroll narrative (eternity-card, legend-card)
│           │   ├── home-scroll-sections/     # Main data sections (groups, knockout, stats)
│           │   ├── next-worldcup-countdown/  # Countdown timer to Aug 19, 2026 launch
│           │   └── main-menu/                # Bottom navigation / section links
│           ├── nav-and-timeline/             # Tournament navigation shell
│           ├── group-timeline/               # Group stage bracket + standings
│           ├── group-navigation/             # Group selector tabs (A–L)
│           ├── knockout-timeline/            # Visual knockout bracket (R32 to Final)
│           ├── knockout-navigation/          # Knockout round selector
│           ├── main-matches/                 # Match list grid (all 104 matches)
│           ├── match-details/                # Full match detail view
│           ├── team-stats/                   # Per-team statistics dashboard
│           ├── tournament-stats/             # Global tournament statistics
│           ├── chatbot/                      # Naranjito AI chatbot interface
│           └── legal/                        # Privacy, Accessibility & Legal Notice pages
│
├── consultaParaChatbot.sql     # 660 hand-crafted PostgreSQL queries for chatbot context
├── AGENTS.md                   # AI agent constitution (rules, conventions, workflow)
└── README.md                   # This file
```

---

## 4. Features & Components

### 4.1 Header Marquee
A sticky animated banner at the top of every screen:
- **Victory text strip** (red background, #F1BF00 text): scrolling marquee celebrating Spain with the "DOMINIO ESPAÑOL" message
- **Flags strip**: scrolling marquee of SVG flags for all 48 participating nations
- Respects `prefers-reduced-motion` — converts to a static centered message when motion is disabled
- Navigation buttons to scroll between main sections

### 4.2 Hero Cover
Full-screen cinematic hero section:
- High-impact background image with Spain branding overlay
- "DOMINIO ESPAÑOL" headline with animated CSS entrance effects
- Fixed height dimensions to guarantee CLS = 0

### 4.3 Landing Narrative
Scroll-driven storytelling section:
- **eternity-card**: Highlight cards for Spain's key tournament moments
- **legend-card**: Profile cards for Spain's legendary players
- Entrance animations powered by `scroll-animate.directive.ts` (Intersection Observer)

### 4.4 Countdown Timer
Live countdown to the launch date (August 19, 2026):
- Days / Hours / Minutes / Seconds with #F1BF00 accent numbers
- Blinking colon separators
- Footer navigation links to legal pages

### 4.5 Group Timeline
Interactive group stage display:
- All 12 groups (A–L), 48 teams
- SVG group infographic cards
- Team standings with status badges
- Tap a group to see detailed results

### 4.6 Knockout Timeline
Visual tournament bracket:
- Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final
- Spain's path highlighted in national colors (#AA151B / #F1BF00)

### 4.7 Main Matches
Grid of all 104 World Cup 2026 matches:
- Match cards with teams, score, date, and stadium
- Status badges: Scheduled / Finished / **CAMPEÓN** / Runner-Up / Third Place
- Filter by group or knockout round

### 4.8 Match Details
The most detailed view in the app:
- **Starting lineups** with player shirts, names, numbers, and positions
- **Goal timeline** (scorer, minute, type: open play / penalty / own goal)
- **Substitutions** and **disciplinary cards** timeline
- **Match statistics**: possession, shots, corners, fouls, offsides
- **Penalty shootout** table for applicable matches
- Tab navigation: Summary / Lineups / Events / Statistics

### 4.9 Statistics
Two dedicated dashboards:
- **Team Stats** (`/team-stats`): Per-team goals, possession, shots, discipline
- **Tournament Stats** (`/tournament-stats`): Top scorers, assists, fair play table, attendance

### 4.10 Chatbot — Naranjito
AI assistant powered by Google Gemini 1.5 Flash (see §6 for full detail):
- Natural language Q&A about any aspect of the tournament
- Orange-themed UI (#FF8C00) distinct from the main #F1BF00 accent
- Typing animation, message timestamps, Naranjito avatar

### 4.11 Legal Pages
Three routes sharing one component (content injected via route data):
- `/privacidad` — Privacy Policy
- `/accesibilidad` — Accessibility Statement
- `/aviso-legal` — Legal Notice

---

## 5. Data Architecture & ETL Pipeline

```
[PostgreSQL 3NF]  (25 tables, Docker, Port 5432)
        │
        ▼  scripts/export_match.py
[JSON Files]  →  public/assets/data/match-{1..104}.json
        │
        ▼  scripts/run_chatbot_queries.py
[JSON File]   →  public/assets/data/chatbot-data.json
        │
        ▼  Angular asset HTTP loader  (offline-first, O(1))
[Ionic + Angular 18+ Frontend]  ◄──►  [Gemini 1.5 Flash (RAG + Cache)]
```

Each of the 104 match files is a fully denormalized document containing the match header, both lineups, all events (goals, cards, substitutions, penalties), and per-team statistics — eliminating the need for any client-side relational joins.

---

## 6. AI Chatbot — Naranjito

The chatbot implements a **Retrieval-Augmented Generation (RAG)** pattern:

1. **Context Assembly**: `chatbot-data.json` (660 pre-computed query tables) is loaded on initialization and formatted into a structured system prompt block.
2. **Gemini API Call**: User messages are sent to the model with the full context prepended, enabling accurate, grounded answers.
3. **LocalStorage Cache**: Every unique query + response pair is cached with a 24-hour TTL. Repeated questions are answered instantly without consuming API quota.
4. **Rate Limit Protection**: Request debouncing (500ms) and a per-session counter protect the 15 RPM free-tier quota.
5. **Error Handling**: API errors, quota exhaustion, and network failures produce graceful Spanish-language fallback messages.

---

## 7. Design System & Accessibility

### Color Palette

| Token | Value | Usage |
|---|---|---|
| Primary accent | `#F1BF00` | Highlights, borders, numbers, gold text |
| Spain red | `#AA151B` | Marquee background, knockout brackets |
| App background | `#0a0a0f` | Global dark background |
| Chatbot orange | `#FF8C00` | Chatbot title and send button (exclusive) |
| CAMPEÓN badge | `#FFD700` | Spain's champion status badge only |

### Typography
- **Headlines**: Montserrat 800–900, uppercase, tight letter-spacing
- **Body / UI**: Inter, legible at 14–16px on mobile

### WCAG 2.1 AA/AAA Compliance
- Minimum contrast ratio: **4.5:1** for all text
- Minimum touch target: **44×44px** for all interactive elements
- `prefers-reduced-motion`: marquee and scroll animations disabled; static fallbacks provided
- Explicit `aria-label` on all icon-only buttons and decorative elements
- Semantic HTML5 throughout (`<main>`, `<header>`, `<nav>`, `<section>`)
- No horizontal scrollbar on viewports 320–430px wide

### Layout Stability (CLS = 0)
- Fixed `height`/`width` on all hero banners and image containers

---

## 8. Database Schema (PostgreSQL 3NF)

The source database `Mundial_2026` contains **25 relational tables** in strict 3rd Normal Form:

| Table | Description |
|---|---|
| `MUNDIAL` | Tournament editions (year, name, host countries) |
| `ORGANIZA` | M:N — countries organizing each tournament |
| `PAIS` | Country master data (ISO code, name) |
| `CIUDAD` | Host cities (altitude, population) |
| `ESTADIO` | Stadiums (capacity, city, inauguration year) |
| `SELECCION` | National teams (FIFA code, confederation, colors) |
| `PARTICIPACION` | Team participation per World Cup (group, phase reached) |
| `CONVOCATORIA` | Player squad lists (club, dorsal, role) |
| `JUGADOR` | Player data (position, height, weight, dominant foot, debut year) |
| `PERSONA` | Base entity for all persons (name, DOB, nationality) |
| `ENTRENADOR` | Coach master data |
| `CUERPO_TECNICO` | Coaching staff assignments per tournament/team |
| `CLUB` | Football clubs (country, league, historical name) |
| `PARTIDO` | Match data (phase, date, stadium, attendance, temperature) |
| `ALINEACION` | Starting XI and substitutes per match |
| `EVENTO` | All match events with minute and period |
| `GOL` | Goal events (scorer, assister, body part, own goal flag) |
| `TARJETA` | Disciplinary cards (color, player/coach, reason) |
| `SUSTITUCION` | Substitution events (in/out players, reason) |
| `PENALTI` | Penalty events (taker, result, shootout flag) |
| `ESTADISTICA_PARTIDO_EQUIPO` | Per-team per-match statistics |
| `ARBITRO` | Referee data (category, confederation, VAR certified) |
| `EQUIPO_ARBITRAL` | Referee assignments per match and role |

---

## 9. Data Engineering Decisions

### 9.1 Empty Short Name Fallback
Several `SELECCION` and `CLUB` tuples had empty `nombre_corto` values. The ETL implements an automatic fallback: when the short name is empty/null/whitespace, it defaults to the full official name — preventing blank labels in the Ionic UI.

### 9.2 Physical Denormalization of Historical Names
The logical design included a separate `OTROS_NOMBRES` table for historical club name variants (strict 1NF). Real-data profiling revealed the cardinality was strictly **1:1**. Following physical design principles, the table was eliminated and `nombre_historico` was promoted to a scalar column inside `CLUB`, removing an unnecessary JOIN on every read.

### 9.3 Composite Key → Document ID Mapping
The relational schema uses composite keys `(ANYO_MUNDIAL, NUM_PARTIDO_FIFA)`. The ETL maps these to deterministic file names: `match-{N}.json` (e.g., `match-49.json` = FIFA match #49 of 2026).

### 9.4 Dynamic Score Calculation
The `PARTIDO` table (strict 3NF) stores no redundant score columns. The Python ETL computes final scores dynamically via SQL aggregation over `GOL JOIN CONVOCATORIA`, correctly attributing own goals to the opposing team.

### 9.5 String Sanitization
All strings from PostgreSQL are sanitized using a two-step pattern:
```sql
TRIM(REPLACE(column, 'Selección Nacional de', ''))
```
This removes boilerplate prefixes from official team names and strips whitespace artifacts, ensuring clean text across all mobile views.

---

## 10. Scripts & Tooling

### `scripts/export_match.py`
Connects to the local PostgreSQL Docker container (`server-mundial`) and exports all 104 match records as individual denormalized JSON files. Handles lineup ordering, event timeline sorting, penalty shootout reconstruction, and player asset path resolution.

### `scripts/run_chatbot_queries.py`
Executes **66 SQL queries** (from `consultaParaChatbot.sql`) and serializes results to `chatbot-data.json`. This file is the pre-computed knowledge base for Naranjito's RAG system.

```bash
# Ensure Docker container "server-mundial" is running on port 5432
python scripts/export_match.py
python scripts/run_chatbot_queries.py
```

---

## 11. Commands

```bash
npm run start    # Start local development server
npm run test     # Run unit tests (must pass before any commit)
npm run lint     # Run TypeScript + SCSS linter
npm run build    # Build production bundle
```

---

## 12. Deployment

```bash
# Authenticate with Firebase
npx firebase-tools login

# Deploy to Firebase App Hosting (Angular SSR)
npx firebase-tools deploy --only hosting
```

**Firebase Project:** `el-mundial-de-mi-vida`  
**Output dir:** `dist/el-mundial-de-mi-vida/browser`

---

## License

This project is an academic portfolio work. All football data is used for non-commercial, educational purposes. FIFA trademarks, team logos, and national flag imagery remain property of their respective rights holders.

© 2026 Sergio R. — Universidad de Zaragoza (EINA). All rights reserved.