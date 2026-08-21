# /init-db
**Description:** Autonomously audits the PostgreSQL relational schema (25 3NF tables), validates the 1:1 physical design cardinality on `CLUB`, and verifies the ETL migration readiness toward Google Cloud Firestore.

## Agent Execution Steps (Build Mode)
1. **Connect to PostgreSQL MCP:** Invoke the `postgres-mundial2026` MCP server to inspect the `mundial_futbol` database.
2. **Verify Schema & Row Counts:**
   - Confirm the existence of the 3NF relational tables (including `PARTIDO`, `SELECCIÓN`, `CLUB`, `EVENTO`, `GOL`, `TARJETA`, `SUSTITUCION`).
   - Ensure exactly **104 rows in `PARTIDO`** (complete tournament schedule) and **48 rows in `SELECCIÓN`** (participating teams)[cite: 5].
3. **Validate Composite Primary Keys:** Verify that `PARTIDO` is keyed by the composite primary key `(ANYO_MUNDIAL, NUM_PARTIDO_FIFA)`[cite: 5].
4. **Audit 1:1 Physical Design Rule:** Confirm that `nombre_historico` is modeled as a simple scalar attribute inside `CLUB`/`EQUIPO`, validating that the independent `OTROS_NOMBRES` table was discarded after profiling source cardinality[cite: 5].
5. **Check ETL Readiness:** Output a summary confirming that match events (lineups, substitutions, goals, cards) can be cleanly aggregated into single denormalized JSON documents per match ($O(1)$ Firestore reads) without runtime client-side JOINs.