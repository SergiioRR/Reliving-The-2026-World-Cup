/**
 * @file statistics.component.ts
 * @author Sergio Romera Rupérez
 * @description Component for displaying detailed match information, statistics, and lineups.
 */

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonProgressBar, IonText } from '@ionic/angular/standalone';

export interface MatchStats {
  possession: { home: number, away: number };
  totalShots: { home: number, away: number };
  shotsOnTarget: { home: number, away: number };
  corners: { home: number, away: number };
  fouls: { home: number, away: number };
  saves: { home: number, away: number };
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonProgressBar, IonText],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent {
  /**
   * Datos estadísticos del partido.
   * Obligatorio para renderizar el componente.
   */
  @Input({ required: true }) stats!: MatchStats;
  
  @Input() homeTeamName: string = 'España';
  @Input() awayTeamName: string = 'Rival';

  /**
   * Transforma las estadísticas en un array iterable para la plantilla,
   * facilitando la renderización de las filas de progreso.
   */
  get statRows() {
    if (!this.stats) return [];
    
    return [
      { label: 'Posesión', home: this.stats.possession.home, away: this.stats.possession.away, isPercentage: true },
      { label: 'Tiros Totales', home: this.stats.totalShots.home, away: this.stats.totalShots.away, isPercentage: false },
      { label: 'Tiros a Puerta', home: this.stats.shotsOnTarget.home, away: this.stats.shotsOnTarget.away, isPercentage: false },
      { label: 'Córners', home: this.stats.corners.home, away: this.stats.corners.away, isPercentage: false },
      { label: 'Faltas', home: this.stats.fouls.home, away: this.stats.fouls.away, isPercentage: false },
      { label: 'Paradas', home: this.stats.saves.home, away: this.stats.saves.away, isPercentage: false },
    ];
  }

  /**
   * Calcula el ratio (0 a 1) para las barras de progreso de Ionic.
   * Si ambos valores son 0, retorna 0.5 para equilibrar visualmente.
   */
  getRatio(homeValue: number, awayValue: number, returnHome: boolean): number {
    const total = homeValue + awayValue;
    if (total === 0) return 0.5;
    return returnHome ? homeValue / total : awayValue / total;
  }
}
