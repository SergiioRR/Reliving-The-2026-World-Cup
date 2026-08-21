/**
 * @file match-details.component.ts
 * @author Sergio Romera Rupérez
 * @description Component for displaying detailed match information, statistics, and lineups.
 */

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonCard, IonCardContent, IonSegment, IonSegmentButton, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { catchError, of } from 'rxjs';
import { MatchDetailsService, MatchDetails, DetailedMatchEvent, PlayerDetails } from '../../core/services/match-details.service';

@Component({
  selector: 'app-match-details',
  standalone: true,
  imports: [
    CommonModule, 
    IonCard, 
    IonCardContent, 
    IonSegment, 
    IonSegmentButton, 
    IonLabel, 
    IonIcon
  ],
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss']
})
export class MatchDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute); 
  private matchDetailsService = inject(MatchDetailsService);
  private location = inject(Location);
  private router = inject(Router);

  // Signals for state management
  public matchDetails = signal<MatchDetails | null>(null);
  public matchEvents = signal<DetailedMatchEvent[]>([]);
  public lineups = signal<{ home: PlayerDetails[], away: PlayerDetails[] }>({ home: [], away: [] });
  public loadError = signal<boolean>(false);
  public debugMatchId = signal<string>('');
  public debugStatus = signal<string>('pending');
  public currentSegment = signal<'eventos' | 'alineaciones'>('eventos');

  // Computed signals for derived state
  public homeStarters = computed(() => this.lineups().home.filter(p => p.isStarter));
  public awayStarters = computed(() => this.lineups().away.filter(p => p.isStarter));
  public homeSubs = computed(() => this.lineups().home.filter(p => !p.isStarter));
  public awaySubs = computed(() => this.lineups().away.filter(p => !p.isStarter));

  public homeGoals = computed(() => {
    const details = this.matchDetails();
    if (!details) return [];
    return this.matchEvents().filter(e => e.type === 'GOL' && e.teamId === details.homeTeamFifaCode);
  });

  public awayGoals = computed(() => {
    const details = this.matchDetails();
    if (!details) return [];
    return this.matchEvents().filter(e => e.type === 'GOL' && e.teamId === details.awayTeamFifaCode);
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const matchId = params.get('id') || '1';
      this.debugMatchId.set(matchId);
      
      // Reset state on every route change
      this.matchDetails.set(null);
      this.matchEvents.set([]);
      this.lineups.set({ home: [], away: [] });
      this.loadError.set(false);
      this.debugStatus.set('loading...');
      this.currentSegment.set('eventos');

      this.matchDetailsService.getMatchDetails(matchId).pipe(
        catchError(err => {
          this.loadError.set(true);
          this.debugStatus.set('ERROR: ' + err.message);
          return of(null);
        })
      ).subscribe(data => {
        if (data) {
          this.matchDetails.set(data);
          this.debugStatus.set('loaded: ' + data.homeTeamFifaCode + ' vs ' + data.awayTeamFifaCode);
        } else {
          this.debugStatus.set('null data (error)');
          this.loadError.set(true);
        }
      });

      this.matchDetailsService.getLineups(matchId).pipe(
        catchError(() => of({ home: [], away: [] }))
      ).subscribe(data => {
        this.lineups.set(data);
      });

      this.matchDetailsService.getMatchEvents(matchId).pipe(
        catchError(() => of([]))
      ).subscribe(data => {
        this.matchEvents.set(data);
      });
    });
  }

  segmentChanged(event: any) {
    this.currentSegment.set(event.detail.value);
  }

  getShortScorerName(name?: string): string {
    if (!name) return '';
    if (name.trim().toLowerCase() === 'vini jr.') return 'Vini Jr.';
    const parts = name.trim().split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : name;
  }

  private toTitleCase(str: string): string {
    return str.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getShirtNameForEvent(event: DetailedMatchEvent): string {
    if (!event.scorerName) return '';

    // ─── Overrides: players known by their first name ───────────────
    // Prevents the shirt lookup from false matching against other players.
    const firstNameOverrides: Record<string, string> = {
      'raúl':    'Raúl',
      'raul':    'Raúl',
    };
    const rawLower = event.scorerName.toLowerCase().trim();
    if (firstNameOverrides[rawLower]) return firstNameOverrides[rawLower];
    // ────────────────────────────────────────────────────────────────────────

    const details = this.matchDetails();
    if (!details) return this.toTitleCase(this.getShortScorerName(event.scorerName));

    const isHomeScoring = event.teamId === details.homeTeamFifaCode;
    const playerTeamIsHome = event.isOwnGoal ? !isHomeScoring : isHomeScoring;
    
    const starters = playerTeamIsHome ? this.homeStarters() : this.awayStarters();
    const subs = playerTeamIsHome ? this.homeSubs() : this.awaySubs();
    const allPlayers = [...starters, ...subs];

    const scorerName = event.scorerName.toLowerCase();
    
    // Find matching player — minimum 3 characters guard to prevent
    // false positives with short initials ("r", "ra", etc.)
    const matchedPlayer = allPlayers.find(p => {
      const pLast = p.lastName?.toLowerCase() ?? '';
      const pName = p.name?.toLowerCase() ?? '';
      return (
        (pLast.length >= 3 && (pLast.includes(scorerName) || scorerName.includes(pLast))) ||
        (pName.length >= 3 && (pName.includes(scorerName) || scorerName.includes(pName)))
      );
    });

    if (matchedPlayer && matchedPlayer.shirtUrl) {
      const parts = matchedPlayer.shirtUrl.split('/');
      const filename = parts.pop() || '';
      const withoutExt = filename.replace('.png', '');
      const nameParts = withoutExt.split('-');
      if (nameParts.length >= 3) {
        const shirtName = nameParts.slice(2).join('-').replace(/_/g, ' ');
        let finalName = this.toTitleCase(shirtName);
        if (finalName === 'Mbappe') finalName = 'Mbappé';
        if (finalName === 'Dembele') finalName = 'Dembélé';
        if (finalName === 'Doue') finalName = 'Doué';
        finalName = finalName.replace('Munoz', 'Muñoz');
        finalName = finalName.replace('Quinones', 'Quiñones');
        return finalName;
      }
    }

    // Fallback if not found or no shirt URL
    return this.toTitleCase(this.getShortScorerName(event.scorerName));
  }


  getShirtUrl(player: any): string {
    if (player.shirtUrl) {
      const parts = player.shirtUrl.split('/');
      let filename = parts.pop() || '';
      filename = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const filenameParts = filename.split('.');
      const ext = filenameParts.length > 1 ? filenameParts.pop() : '';
      const baseName = filenameParts.join('.').toUpperCase();
      filename = ext ? `${baseName}.${ext}` : baseName;
      parts.push(filename);
      return parts.join('/');
    }
    let lastName = player.lastName || '';
    lastName = lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    lastName = lastName.replace(/\s+/g, '_').toUpperCase();
    return `assets/players/${player.team}-${player.number}-${lastName}.png`;
  }

  onShirtImgError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.style.display = 'none';
    }
  }

  onRefereeFlagError(event: Event, code?: string) {
    const img = event.target as HTMLImageElement;
    if (img && code) {
      const upper = code.toUpperCase();
      if (!img.src.endsWith(`Flag-${upper}.svg`)) {
        img.src = `assets/flags/Flag-${upper}.svg`;
      }
    }
  }

  getRefereeFlag(code?: string): string {
    if (!code) return '';
    const lowerCode = code.toLowerCase().trim();
    if (lowerCode === 'svn' || lowerCode === 'eslovenia' || lowerCode === 'slovenia') return 'assets/flags/slovenia.png';
    if (lowerCode === 'hon' || lowerCode === 'hnd' || lowerCode === 'honduras') return 'assets/flags/honduras.png';
    if (lowerCode === 'chi' || lowerCode === 'chl' || lowerCode === 'chile') return 'assets/flags/chile.png';
    if (lowerCode === 'ven' || lowerCode === 'venezuela') return 'assets/flags/venezuela.png';
    if (lowerCode === 'slv' || lowerCode === 'el salvador' || lowerCode === 'elsalvador') return 'assets/flags/elsalvador.png';
    if (lowerCode === 'chn' || lowerCode === 'china') return 'assets/flags/china.png';
    if (lowerCode === 'rou' || lowerCode === 'rom' || lowerCode === 'rumania') return 'assets/flags/rumania.png';
    if (lowerCode === 'uae' || lowerCode === 'eau' || lowerCode === 'are') return 'assets/flags/eau.png';
    if (lowerCode === 'pol' || lowerCode === 'polonia') return 'assets/flags/polonia.png';
    if (lowerCode === 'ita' || lowerCode === 'italia') return 'assets/flags/italia.png';
    if (lowerCode === 'gab' || lowerCode === 'gabon' || lowerCode === 'gabón') return 'assets/flags/gabon.png';
    if (lowerCode === 'mtn' || lowerCode === 'mauritania' || lowerCode === 'mrt') return 'assets/flags/mauritania.png';
    if (lowerCode === 'uzb' || lowerCode === 'uzbekistan' || lowerCode === 'uzbekistán') return 'assets/flags/uzbekistan.png';
    if (lowerCode === 'gbr' || lowerCode === 'eng') return 'assets/flags/Flag-ENG.svg';
    if (lowerCode === 'deu' || lowerCode === 'ger' || lowerCode === 'germany' || lowerCode === 'alemania') return 'assets/flags/Flag-GER.svg';
    if (lowerCode === 'swe' || lowerCode === 'suecia') return 'assets/flags/suecia.png';
    if (lowerCode === 'prt' || lowerCode === 'por' || lowerCode === 'portugal') return 'assets/flags/Flag-POR.svg';
    if (lowerCode === 'ury' || lowerCode === 'uru' || lowerCode === 'uruguay') return 'assets/flags/Flag-URU.svg';
    if (lowerCode === 'nld' || lowerCode === 'ned' || lowerCode === 'netherlands' || lowerCode === 'holanda') return 'assets/flags/Flag-NED.svg';
    if (lowerCode === 'dza' || lowerCode === 'alg' || lowerCode === 'algeria' || lowerCode === 'argelia') return 'assets/flags/Flag-ALG.svg';
    return `assets/flags/Flag-${code.toUpperCase()}.svg`;
  }

  private namesMatch(player: PlayerDetails, eventName: string): boolean {
    if (!eventName) return false;
    const pLastName = player.lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const pName = player.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const evName = eventName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    if (pLastName === evName || pName === evName || `${pName} ${pLastName}` === evName) {
      return true;
    }
    
    const pWords = `${pName} ${pLastName}`.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length >= 3);
    const evWords = evName.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length >= 3);
    
    if (pWords.length === 0 || evWords.length === 0) return false;
    if (!pWords.some(pw => evWords.some(ew => pw === ew))) return false;

    const evInitialMatch = evName.match(/(?:^|\s)([a-z])\./);
    if (evInitialMatch) {
      const evInit = evInitialMatch[1];
      const pInitFromLast = pLastName.match(/(?:^|\s)([a-z])\./);
      const pInit = pInitFromLast ? pInitFromLast[1] : pName[0];
      if (evInit !== pInit) return false;
    }
    return true;
  }

  private findBestPlayerMatch(teamLineup: any[], eventName: string): any {
    if (!eventName) return undefined;
    const evName = eventName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    
    let match = teamLineup.find(p => (p.lastName || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() === evName);
    if (match) return match;
    
    match = teamLineup.find(p => (p.name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() === evName);
    if (match) return match;
    
    match = teamLineup.find(p => `${p.name} ${p.lastName}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() === evName);
    if (match) return match;

    const fuzzyMatches = teamLineup.filter(p => this.namesMatch(p, eventName));
    return fuzzyMatches[0];
  }

  getSubstitutedBy(player: PlayerDetails): PlayerDetails | undefined {
    const events = this.matchEvents();
    const details = this.matchDetails();
    if (!events.length || !details) return undefined;
    
    const teamLineup = this.lineups()[player.team === details.homeTeamFifaCode ? 'home' : 'away'];
    const teamSubEvents = events.filter(e => e.type === 'SUSTITUCION' && e.teamId === player.team);
    
    for (const e of teamSubEvents) {
      const bestMatchOut = this.findBestPlayerMatch(teamLineup, e.playerOutName || '');
      if (bestMatchOut && bestMatchOut.number === player.number) {
        return this.findBestPlayerMatch(teamLineup, e.playerInName || '');
      }
    }
    return undefined;
  }

  getSubstitutedFor(player: PlayerDetails): PlayerDetails | undefined {
    const events = this.matchEvents();
    const details = this.matchDetails();
    if (!events.length || !details) return undefined;
    
    const teamLineup = this.lineups()[player.team === details.homeTeamFifaCode ? 'home' : 'away'];
    const teamSubEvents = events.filter(e => e.type === 'SUSTITUCION' && e.teamId === player.team);
    
    for (const e of teamSubEvents) {
      const bestMatchIn = this.findBestPlayerMatch(teamLineup, e.playerInName || '');
      if (bestMatchIn && bestMatchIn.number === player.number) {
        return this.findBestPlayerMatch(teamLineup, e.playerOutName || '');
      }
    }
    return undefined;
  }

  goBack() {
    this.location.back();
  }

  goToNextMatch(nextMatchId?: string) {
    if (nextMatchId) {
      this.router.navigate(['/match', nextMatchId]);
    }
  }
}
