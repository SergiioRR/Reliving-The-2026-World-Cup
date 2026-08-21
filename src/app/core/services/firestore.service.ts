/**
 * @file firestore.service.ts
 * @author Sergio Romera Rupérez
 * @description Core service handling data fetching, state management, or external API interactions.
 */

import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export interface PlayerLineup {
  id: string;
  name: string;
  number: number;
  isStarter: boolean;
  position: string;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'GOL' | 'TARJETA' | 'SUSTITUCION';
  playerIn?: string;
  playerOut?: string;
  description: string;
  teamId: string;
}

export interface DenormalizedMatch {
  id: string;
  phase: string;
  group: string | null;
  homeTeamFifaCode: string;
  awayTeamFifaCode: string;
  homeTeamName: string;
  awayTeamName: string;
  date: string;
  stadium?: {
    name: string;
    city: string;
    country_iso: string;
  };
  score?: {
    home: number;
    away: number;
    penaltiesHome?: number;
    penaltiesAway?: number;
    redCardHome?: boolean;
    redCardAway?: boolean;
    status: string;
  };
  homeLineup: PlayerLineup[];
  awayLineup: PlayerLineup[];
  events: MatchEvent[];
  summary?: {
    image: string;
    title: string;
    text: string;
    badge?: string;
    badgePosition?: 'left' | 'right';
  };
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private fetchJson<T>(url: string): Observable<T> {
    const cb = new Date().getTime();
    return from(
      fetch(`${url}?cb=${cb}`).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} fetching ${url}`);
        return r.json() as Promise<T>;
      })
    );
  }

  /**
   * Simulates a Firestore query by fetching the denormalized JSON
   * extracted via the MCP/Docker Postgres extraction process.
   */
  public getGroupMatches(groupId: string): Observable<DenormalizedMatch[]> {
    const groupLower = groupId.toLowerCase();
    return this.fetchJson<DenormalizedMatch[]>(`/assets/data/matches-group-${groupLower}.json`).pipe(
      map(matches => matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())),
      shareReplay(1)
    );
  }

  /**
   * Fetches the knockout matches for a specific phase.
   */
  public getKnockoutMatches(phase: string): Observable<DenormalizedMatch[]> {
    const phaseLower = phase.toLowerCase();
    return this.fetchJson<DenormalizedMatch[]>(`/assets/data/matches-${phaseLower}.json`).pipe(
      map(matches => matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())),
      shareReplay(1)
    );
  }

  public async consultarPartido(id: string): Promise<string> {
    return this.fetchAndMinify(`https://firestore.googleapis.com/v1/projects/mundial-2026-web-5b963/databases/(default)/documents/partidos/${id}`);
  }

  public async consultarJugador(id: string): Promise<string> {
    return this.fetchAndMinify(`https://firestore.googleapis.com/v1/projects/mundial-2026-web-5b963/databases/(default)/documents/jugadores/${id}`);
  }

  public async consultarSeleccion(id: string): Promise<string> {
    return this.fetchAndMinify(`https://firestore.googleapis.com/v1/projects/mundial-2026-web-5b963/databases/(default)/documents/selecciones/${id}`);
  }

  public async consultarPichichiTorneo(): Promise<string> {
    return this.fetchAndMinify(`https://firestore.googleapis.com/v1/projects/mundial-2026-web-5b963/databases/(default)/documents/torneos/estadisticas`);
  }

  public async consultarRankingsIndividuales(): Promise<string> {
    try {
      const response = await fetch('/assets/data/tournament-stats.json');
      if (!response.ok) return '{"error":"No encontrado"}';
      return await response.text();
    } catch(e) { return '{"error":"Error"}'; }
  }

  public async consultarEstadisticasSelecciones(): Promise<string> {
    try {
      const response = await fetch('/assets/data/team-stats.json');
      if (!response.ok) return '{"error":"No encontrado"}';
      return await response.text();
    } catch(e) { return '{"error":"Error"}'; }
  }

  /**
   * Busca datos pre-calculados en el JSON generado desde la base de datos PostgreSQL.
   * Contiene 673 consultas sobre goles, asistencias, estadios, árbitros, selecciones, etc.
   * El parámetro 'query' debe ser una palabra clave en español (ej: "Mbappé", "goleadores", "penaltis").
   */
  public async consultarDatosGenerales(query: string): Promise<string> {
    try {
      const response = await fetch('/assets/data/chatbot-data.json');
      if (!response.ok) return '{"error":"Datos no disponibles"}';
      const allData: Record<string, any[]> = await response.json();
      const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      let lowerQuery = normalize(query);
      const matching: Record<string, any[]> = {};

      // Explicit routing for age queries based on prefix
      if (lowerQuery.startsWith('edad:')) {
        const nameQuery = lowerQuery.replace('edad:', '').trim();
        for (const [key, rows] of Object.entries(allData)) {
          if (!normalize(key).includes('edad exacta')) continue;
          const filtered = rows.filter(row =>
            Object.values(row).some(v => v != null && normalize(String(v)).includes(nameQuery))
          );
          if (filtered.length > 0) matching[key] = filtered.slice(0, 5);
        }
        if (Object.keys(matching).length === 0) return '{"resultado":"No se encontraron datos de edad para esa persona"}';
        return JSON.stringify(matching);
      }

      // First pass: match by section key name (skip empty sections)
      for (const [key, rows] of Object.entries(allData)) {
        if (rows.length === 0) continue;
        const normKey = normalize(key);
        if (normKey.includes(lowerQuery)) {
          // If section is large, filter rows by query match within values
          if (rows.length > 10) {
            const filtered = rows.filter(row =>
              Object.values(row).some(v => v != null && normalize(String(v)).includes(lowerQuery))
            );
            matching[key] = filtered.length > 0 ? filtered.slice(0, 20) : rows.slice(0, 10);
          } else {
            matching[key] = rows;
          }
        }
      }

      // Second pass: if nothing found by key, search within row values across all sections
      if (Object.keys(matching).length === 0) {
        let count = 0;
        for (const [key, rows] of Object.entries(allData)) {
          if (count >= 5) break;
          const filtered = rows.filter(row =>
            Object.values(row).some(v => v != null && normalize(String(v)).includes(lowerQuery))
          );
          if (filtered.length > 0) {
            matching[key] = filtered.slice(0, 10);
            count++;
          }
        }
      }

      if (Object.keys(matching).length === 0) return '{"resultado":"No se encontraron datos para esa búsqueda"}';
      return JSON.stringify(matching);
    } catch(e) { return '{"error":"Error al buscar datos"}'; }
  }

  private async fetchAndMinify(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) return '{"error":"No encontrado"}';
      const data = await response.json();
      return JSON.stringify(this.parseFirestoreDocument(data));
    } catch (e) {
      return '{"error":"Error de conexión"}';
    }
  }

  private parseFirestoreDocument(doc: any): any {
    const parsed: any = {};
    if (!doc || !doc.fields) return parsed;
    for (const [key, value] of Object.entries(doc.fields) as any[]) {
      parsed[key] = this.parseFirestoreValue(value);
    }
    return parsed;
  }

  private parseFirestoreValue(value: any): any {
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
    if (value.doubleValue !== undefined) return parseFloat(value.doubleValue);
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.arrayValue !== undefined) {
      return (value.arrayValue.values || []).map((v: any) => this.parseFirestoreValue(v));
    }
    if (value.mapValue !== undefined) {
      return this.parseFirestoreDocument({ fields: value.mapValue.fields });
    }
    if (value.nullValue !== undefined) return null;
    return value;
  }
}
