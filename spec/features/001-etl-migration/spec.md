# Feature Specification: 001-etl-migration (PostgreSQL to Denormalized Firestore JSON)

## 1. Overview & Architectural Intent
The `001-etl-migration` feature defines the Spec-Driven Development (SDD) contract for extracting data from the source relational PostgreSQL database (`BD_MUNDIAL_FUTBOL_RELACIONAL`), cleansing and profiling string fields, and transforming the relational data into denormalized NoSQL document collections in Google Cloud Firestore.

The overarching performance objective for the "World Cup of My Life" mobile-first web app is **sub-millisecond read latency** over mobile networks. Client-side joins, relational queries, or multi-document fetch chains in Angular/Ionic are strictly prohibited. Every match MUST be fully consolidated into a **single complex JSON document** inside the `partidos` collection.

---

## 2. Source & Target Database Architecture

### 2.1. Source Relational Schema (PostgreSQL)
The source schema (`BD_MUNDIAL_FUTBOL_RELACIONAL`) contains relational tables requiring multi-table joins:
- `PARTIDO` (match metadata: tournament year, match number, date, stadium, local/visitor teams, score, etc.)
- `ESTADIO` & `CIUDAD` & `PAIS` (venue details)
- `ALINEACION` & `CONVOCATORIA` & `JUGADOR` & `PERSONA` (starters, substitutes, captain status, jersey numbers, player profiles)
- `EVENTO` with specialized event tables: `GOL`, `TARJETA`, `SUSTITUCION`, `PENALTI`
- `ESTADISTICAS_PARTIDO` (possession, shots, corners, fouls)
- `SELECCION` & `EQUIPO` / `CLUB`

### 2.2. Physical Design Decision: 1:1 Historical Name Integration
- **Context & Conceptual Design:** In the initial conceptual/logical entity-relationship modeling phase, historical club names were modeled as an independent table (`OTROS_NOMBRES`) to strictly satisfy First Normal Form (1NF).
- **Empirical Data Profiling (`ligahost`):** Data profiling against the real source data revealed an absolute **1:1 cardinality** (a club possesses at most one historical name in the dataset).
- **Physical Denormalization:** To eliminate unnecessary join overhead and improve read throughput, the independent `OTROS_NOMBRES` table is dissolved. The historical name is stored as a **simple attribute** (`historical_name` / `nombre_historico`) directly inside the `EQUIPO`/`CLUB` table and Firestore document.

---

## 3. Data Cleaning & Sanitization Rules (ETL Pipeline)

### 3.1. Empty Short Name Business Rule
- When migrating teams or clubs, if the `nombre_corto` (short name) column is NULL, empty (`''`), or contains only whitespace characters, the ETL pipeline **MUST default to assigning the official club/team name (`nombre_oficial` / official club name)**.
- **Rule Evaluation:**
  ```python
  short_name = clean_string(row.get("nombre_corto"))
  if not short_name:
      short_name = clean_string(row.get("nombre_oficial")) or "UNKNOWN_CLUB"
  ```

### 3.2. Technical Sanitization: `TRIM(REPLACE(...))`
- **Requirement:** Every string extracted from PostgreSQL MUST pass through a sanitization function implementing the SQL-equivalent pattern `TRIM(REPLACE(string, 'unwanted_pattern', ''))`.
- **Technical Explanation:**
  - `REPLACE(val, unwanted_char, '')` searches and strips unwanted non-printable control characters, legacy encoding artifacts, or spurious symbols by replacing them with an empty string (`''`).
  - `TRIM(...)` subsequently strips any accidental leading and trailing whitespace characters left after substitution.
  - Ensuring clean, trimmed strings prevents visual layout breaking in Angular/Ionic mobile components (`ion-card`, `ion-timeline`).

---

## 4. Target Denormalized Firestore Schema (`partidos` Collection)

Each document in the `partidos` collection MUST conform to the following JSON schema:

```json
{
  "match_id": "2026_M64_FINAL",
  "tournament_year": 2026,
  "match_number": 64,
  "stage": "FINAL",
  "date_utc": "2026-08-19T20:00:00Z",
  "stadium": {
    "name": "Estadio Azteca",
    "city": "Ciudad de México",
    "country_iso": "MEX",
    "capacity": 87523
  },
  "teams": {
    "local": {
      "fifa_code": "ESP",
      "official_name": "Selección Española de Fútbol",
      "short_name": "España",
      "flag_svg_url": "assets/flags/esp.svg",
      "historical_club_name": "España"
    },
    "visitor": {
      "fifa_code": "ARG",
      "official_name": "Selección Argentina de Fútbol",
      "short_name": "Argentina",
      "flag_svg_url": "assets/flags/arg.svg",
      "historical_club_name": "Argentina"
    }
  },
  "score": {
    "local": 3,
    "visitor": 1,
    "status": "FINISHED"
  },
  "lineups": {
    "local": {
      "starters": [
        { "player_id": "P101", "jersey_number": 1, "name": "Unai Simón", "position": "GK", "is_captain": false },
        { "player_id": "P109", "jersey_number": 19, "name": "Lamine Yamal", "position": "FW", "is_captain": false }
      ],
      "substitutes": [
        { "player_id": "P123", "jersey_number": 10, "name": "Dani Olmo", "position": "MF" }
      ]
    },
    "visitor": {
      "starters": [],
      "substitutes": []
    }
  },
  "timeline_events": [
    {
      "order": 1,
      "minute": 24,
      "stoppage_minute": 0,
      "period": "FIRST_HALF",
      "type": "GOAL",
      "team_fifa_code": "ESP",
      "player_id": "P109",
      "player_name": "Lamine Yamal",
      "assist_player_name": "Pedri",
      "detail": "LEFT_FOOT"
    },
    {
      "order": 2,
      "minute": 68,
      "stoppage_minute": 0,
      "period": "SECOND_HALF",
      "type": "SUBSTITUTION",
      "team_fifa_code": "ESP",
      "player_in_name": "Dani Olmo",
      "player_out_name": "Nico Williams",
      "reason": "TACTICAL",
      "ui_icon": "🔄"
    }
  ],
  "statistics": {
    "possession_percentage": { "local": 58, "visitor": 42 },
    "total_shots": { "local": 14, "visitor": 9 },
    "shots_on_target": { "local": 7, "visitor": 3 },
    "corners": { "local": 6, "visitor": 4 }
  }
}
```

---

## 5. Acceptance Criteria (QA Verification)
1. **Zero Client-Side Joins:** Angular/Ionic components must render the entire Match Timeline and Figma Jersey Lineups by fetching only a single document from `partidos/{match_id}`.
2. **Empty Short Name Handling:** Automated ETL test suites must verify that any row with a NULL or whitespace `nombre_corto` is replaced by `nombre_oficial`.
3. **String Cleansing:** No string field in Firestore may contain leading/trailing whitespaces or unescaped control symbols.
4. **Physical Design Integrity:** `historical_name` is present as a scalar string attribute without querying external historical tables.
