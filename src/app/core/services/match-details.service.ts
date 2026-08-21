/**
 * @file match-details.service.ts
 * @author Sergio Romera Rupérez
 * @description Component for displaying detailed match information, statistics, and lineups.
 */

import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface MatchDetails {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  stadium: string;
  stage: string;
  referee: string;
  attendance: string;
  homeCoach: string;
  awayCoach: string;
  homeStatus?: 'SIGUIENTE' | 'ELIMINADA' | 'FINALIZADO' | 'CAMPEÓN' | 'SUBCAMPEÓN' | 'TERCERO' | 'CUARTO';
  awayStatus?: 'SIGUIENTE' | 'ELIMINADA' | 'FINALIZADO' | 'CAMPEÓN' | 'SUBCAMPEÓN' | 'TERCERO' | 'CUARTO';
  homeNextMatchId?: string;
  awayNextMatchId?: string;
  // Compatibility attributes
  homeTeamFifaCode?: string;
  awayTeamFifaCode?: string;
  phase?: string;
  groupLetter?: string;
  location?: string;
  refereeName?: string;
  refereeFifaCode?: string;
  homeCoachName?: string;
  awayCoachName?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  status?: string;
  homeFormation?: string;
  awayFormation?: string;
  shootout?: ShootoutKick[];
  penaltyScoreText?: string | null;
}

export interface ShootoutKick {
  player: string;
  status: 'SCORED' | 'MISSED';
}

export interface PlayerDetails {
  id: string;
  name: string;
  lastName: string;
  number: number;
  isStarter: boolean;
  position: string;
  team: string; // fifa code
  isCaptain?: boolean;
  shirtUrl?: string;
}

export interface DetailedMatchEvent {
  id: string;
  order: number;
  minute: number | string;
  extraMinute?: number;
  type: 'GOL' | 'TARJETA' | 'SUSTITUCION' | 'PENALTI' | 'OTRO' | 'PENALTI_GOL' | 'PENALTI_FALLO';
  teamId: string;
  description: string;
  // Specific to GOL
  scorerName?: string;
  isOwnGoal?: boolean;
  // Specific to TARJETA
  cardColor?: 'AMARILLA' | 'ROJA' | 'DOBLE_AMARILLA';
  playerName?: string;
  // Specific to SUSTITUCION
  playerInName?: string;
  playerOutName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MatchDetailsService {

  private fetchJson(path: string): Observable<any> {
    const cb = new Date().getTime();
    return from(fetch(`${path}?cb=${cb}`).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status} for ${path}`);
      return r.json();
    }));
  }

  private resolveNumericId(matchId: string): string {
    if (!matchId) return '1';
    // Extracts numeric part if format is '2026_M28', 'match-28', '28', etc.
    const digits = matchId.replace(/^2026_M_?[A-Za-z]*_?/i, '').replace(/[^0-9]/g, '');
    return digits || matchId;
  }

  public getMatchDetails(matchId: string): Observable<MatchDetails> {
    const cleanId = this.resolveNumericId(matchId);
    return this.fetchJson(`/assets/data/match-${cleanId}.json`).pipe(
      map(data => ({
        ...data,
        id: (data.matchId || cleanId).toString(),
        homeTeam: data.home || data.homeTeam,
        awayTeam: data.away || data.awayTeam,
        homeTeamFifaCode: data.home || data.homeTeamFifaCode,
        awayTeamFifaCode: data.away || data.awayTeamFifaCode,
        homeScore: data.homeScore ?? 0,
        awayScore: data.awayScore ?? 0,
        shootout: (() => {
          let s: ShootoutKick[] = [];
          if (data.penalties) {
            const isAwayFirst = data.penalties.firstShooter === 'away' || data.penalties.firstTeam === 'away' || data.penalties.first === 'away';
            const maxKicks = Math.max(data.penalties.home?.length || 0, data.penalties.away?.length || 0);
            for (let i = 0; i < maxKicks; i++) {
              const firstKicks = isAwayFirst ? data.penalties.away : data.penalties.home;
              const secondKicks = isAwayFirst ? data.penalties.home : data.penalties.away;

              if (firstKicks && firstKicks[i]) {
                s.push({
                  player: firstKicks[i].player,
                  status: firstKicks[i].result === 'goal' ? 'SCORED' : 'MISSED'
                });
              }
              if (secondKicks && secondKicks[i]) {
                s.push({
                  player: secondKicks[i].player,
                  status: secondKicks[i].result === 'goal' ? 'SCORED' : 'MISSED'
                });
              }
            }
          } else if (data.shootout) {
            s = data.shootout;
          }
          return s;
        })(),
        penaltyScoreText: data.penalties ? `PEN ${data.penalties.homeScore} - ${data.penalties.awayScore}` : null,
        homeTeamName: data.homeTeamName || data.home,
        awayTeamName: data.awayTeamName || data.away,
        homeCoach: data.homeCoach || data.homeCoachName || 'Por Determinar',
        homeCoachName: data.homeCoachName || data.homeCoach || 'Por Determinar',
        awayCoach: data.awayCoach || data.awayCoachName || 'Por Determinar',
        awayCoachName: data.awayCoachName || data.awayCoach || 'Por Determinar',
        status: data.status || 'Finalizado',
        homeStatus: data.homeStatus || 'SIGUIENTE',
        awayStatus: data.awayStatus || 'SIGUIENTE',
        homeNextMatchId: data.homeNextMatchId || undefined,
        awayNextMatchId: data.awayNextMatchId || undefined,
        homeFormation: data.homeFormation || '4-3-3',
        awayFormation: data.awayFormation || '4-3-3',
        referee: data.refereeName || data.referee || 'Por Determinar',
        refereeName: data.refereeName || data.referee || 'Por Determinar',
        refereeFifaCode: data.refereeFifaCode || data.refereeCountry || 'FIFA',
        date: data.date || '2026-06-11T15:00:00Z',
        stadium: data.stadium || 'Estadio Mundialista',
        location: data.location || data.stadium || 'Ciudad',
        stage: data.stage || 'Fase de Grupos',
        phase: data.phase || 'GRUPOS',
        attendance: data.attendance ? data.attendance.toString() : '60000'
      }))
    );
  }

  public getLineups(matchId: string): Observable<{ home: PlayerDetails[], away: PlayerDetails[] }> {
    const cleanId = this.resolveNumericId(matchId);
    return this.fetchJson(`/assets/data/match-${cleanId}.json`).pipe(
      map(data => ({
        home: data.lineups?.home || [],
        away: data.lineups?.away || []
      }))
    );
  }

  public getMatchEvents(matchId: string): Observable<DetailedMatchEvent[]> {
    const cleanId = this.resolveNumericId(matchId);
    return this.fetchJson(`/assets/data/match-${cleanId}.json`).pipe(
      map(data => {
        let events: DetailedMatchEvent[] = data.events || [];
        
        if (data.penalties) {
          const isAwayFirst = data.penalties.firstShooter === 'away' || data.penalties.firstTeam === 'away' || data.penalties.first === 'away';
          const maxKicks = Math.max(data.penalties.home?.length || 0, data.penalties.away?.length || 0);
          let orderOffset = 1000;
          
          events.push({
            id: 'tanda-separator',
            order: orderOffset++,
            minute: '',
            type: 'OTRO',
            teamId: 'NONE',
            description: 'TANDA_SEPARATOR'
          });

          for (let i = 0; i < maxKicks; i++) {
            const firstTeam: 'home' | 'away' = isAwayFirst ? 'away' : 'home';
            const secondTeam: 'home' | 'away' = isAwayFirst ? 'home' : 'away';

            const pushKick = (team: 'home' | 'away') => {
              const kick = data.penalties[team]?.[i];
              if (kick) {
                events.push({
                  id: `pen-${team}-${i}`,
                  order: orderOffset++,
                  minute: 'PEN',
                  type: kick.result === 'goal' ? 'PENALTI_GOL' : 'PENALTI_FALLO',
                  teamId: team === 'home' ? (data.home || data.homeTeamFifaCode) : (data.away || data.awayTeamFifaCode),
                  description: 'Lanzamiento de penalti',
                  playerName: kick.player,
                  scorerName: kick.player
                });
              }
            };

            pushKick(firstTeam);
            pushKick(secondTeam);
          }
        }
        return events;
      })
    );
  }
}
