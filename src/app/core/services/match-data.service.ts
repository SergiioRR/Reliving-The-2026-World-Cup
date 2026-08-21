/**
 * @file match-data.service.ts
 * @author Sergio Romera Rupérez
 * @description Core service handling data fetching, state management, or external API interactions.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
  homeLineup: PlayerLineup[];
  awayLineup: PlayerLineup[];
  events: MatchEvent[];
}

@Injectable({
  providedIn: 'root'
})
export class MatchDataService {
  
  // Enforce Empty Short Name Rule: if short name is empty, fallback to official club name
  public getTeamDisplayName(shortName: string | null | undefined, officialName: string): string {
    if (!shortName || shortName.trim().length === 0) {
      return officialName;
    }
    return shortName;
  }

  // Zero Frontend Runtime Joins: Return pre-joined NoSQL document structure
  public getMatchesByPhase(phase: string): Observable<DenormalizedMatch[]> {
    // Mock data mimicking denormalized Firestore JSON document
    const mockMatches: DenormalizedMatch[] = [
      {
        id: 'match-1',
        phase: 'Fase de Grupos',
        group: 'A',
        homeTeamFifaCode: 'esp',
        awayTeamFifaCode: 'por',
        homeTeamName: 'España',
        awayTeamName: 'Portugal',
        date: '2026-06-15T15:00:00Z',
        homeLineup: [
          { id: 'p1', name: 'Simón', number: 1, isStarter: true, position: 'GK' },
          { id: 'p2', name: 'Rodri', number: 16, isStarter: true, position: 'MID' },
          { id: 'p3', name: 'Morata', number: 7, isStarter: false, position: 'FWD' }
        ],
        awayLineup: [
          { id: 'p4', name: 'Costa', number: 1, isStarter: true, position: 'GK' }
        ],
        events: [
          { id: 'e1', minute: 12, type: 'GOL', description: 'Gol de Rodri', teamId: 'esp' },
          { id: 'e2', minute: 45, type: 'TARJETA', description: 'Tarjeta Amarilla', teamId: 'por' },
          { id: 'e3', minute: 60, type: 'SUSTITUCION', playerOut: 'p2', playerIn: 'p3', description: 'Cambio España', teamId: 'esp' }
        ]
      }
    ];
    
    return of(mockMatches.filter((m: DenormalizedMatch) => m.phase === phase));
  }
}
