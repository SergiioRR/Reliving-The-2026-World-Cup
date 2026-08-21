/**
 * @file header-marquee.component.ts
 * @author Sergio Romera Rupérez
 * @description Header marquee component displaying a continuous scroll of teams or messages.
 */

import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonButton, IonImg, IonBadge } from '@ionic/angular/standalone';
import { AnalyticsService } from '../../core/services/analytics.service';

export interface NationalTeamFlag {
  readonly codFifa: string;
  readonly name: string;
  readonly group: string;
}

const PARTICIPATING_TEAMS: readonly NationalTeamFlag[] = [
  { codFifa: 'GER', name: 'Alemania', group: 'e' },
  { codFifa: 'KSA', name: 'Arabia Saudí', group: 'h' },
  { codFifa: 'ALG', name: 'Argelia', group: 'j' },
  { codFifa: 'ARG', name: 'Argentina', group: 'j' },
  { codFifa: 'AUS', name: 'Australia', group: 'd' },
  { codFifa: 'AUT', name: 'Austria', group: 'j' },
  { codFifa: 'BEL', name: 'Bélgica', group: 'g' },
  { codFifa: 'BIH', name: 'Bosnia y Herzegovina', group: 'b' },
  { codFifa: 'BRA', name: 'Brasil', group: 'c' },
  { codFifa: 'CPV', name: 'Cabo Verde', group: 'h' },
  { codFifa: 'CAN', name: 'Canadá', group: 'b' },
  { codFifa: 'QAT', name: 'Catar', group: 'b' },
  { codFifa: 'COL', name: 'Colombia', group: 'k' },
  { codFifa: 'KOR', name: 'Corea del Sur', group: 'a' },
  { codFifa: 'CIV', name: 'Costa de Marfil', group: 'e' },
  { codFifa: 'CRO', name: 'Croacia', group: 'l' },
  { codFifa: 'CUW', name: 'Curazao', group: 'e' },
  { codFifa: 'ECU', name: 'Ecuador', group: 'e' },
  { codFifa: 'EGY', name: 'Egipto', group: 'g' },
  { codFifa: 'SCO', name: 'Escocia', group: 'c' },
  { codFifa: 'ESP', name: 'España', group: 'h' },
  { codFifa: 'USA', name: 'Estados Unidos', group: 'd' },
  { codFifa: 'FRA', name: 'Francia', group: 'i' },
  { codFifa: 'GHA', name: 'Ghana', group: 'l' },
  { codFifa: 'HAI', name: 'Haití', group: 'c' },
  { codFifa: 'ENG', name: 'Inglaterra', group: 'l' },
  { codFifa: 'IRQ', name: 'Irak', group: 'i' },
  { codFifa: 'IRN', name: 'Irán', group: 'g' },
  { codFifa: 'JPN', name: 'Japón', group: 'f' },
  { codFifa: 'JOR', name: 'Jordania', group: 'j' },
  { codFifa: 'MAR', name: 'Marruecos', group: 'c' },
  { codFifa: 'MEX', name: 'México', group: 'a' },
  { codFifa: 'NOR', name: 'Noruega', group: 'i' },
  { codFifa: 'NZL', name: 'Nueva Zelanda', group: 'g' },
  { codFifa: 'NED', name: 'Países Bajos', group: 'f' },
  { codFifa: 'PAN', name: 'Panamá', group: 'l' },
  { codFifa: 'PAR', name: 'Paraguay', group: 'd' },
  { codFifa: 'POR', name: 'Portugal', group: 'k' },
  { codFifa: 'CZE', name: 'República Checa', group: 'a' },
  { codFifa: 'COD', name: 'República Democrática del Congo', group: 'k' },
  { codFifa: 'SEN', name: 'Senegal', group: 'i' },
  { codFifa: 'RSA', name: 'Sudáfrica', group: 'a' },
  { codFifa: 'SWE', name: 'Suecia', group: 'f' },
  { codFifa: 'SUI', name: 'Suiza', group: 'b' },
  { codFifa: 'TUN', name: 'Túnez', group: 'f' },
  { codFifa: 'TUR', name: 'Turquía', group: 'd' },
  { codFifa: 'URU', name: 'Uruguay', group: 'h' },
  { codFifa: 'UZB', name: 'Uzbekistán', group: 'k' },
];

@Component({
  selector: 'app-header-marquee',
  standalone: true,
  imports: [CommonModule, RouterModule, IonButton, IonImg, IonBadge],
  templateUrl: './header-marquee.component.html',
  styleUrls: ['./header-marquee.component.scss']
})
export class HeaderMarqueeComponent {
  readonly teams: readonly NationalTeamFlag[] = PARTICIPATING_TEAMS;
  private readonly failedImages = signal<Set<string>>(new Set<string>());
  private analytics = inject(AnalyticsService);

  getSvgPath(codFifa: string): string {
    return `assets/flags/Flag-${codFifa}.svg`;
  }

  onImageError(codFifa: string): void {
    const currentFailures = new Set(this.failedImages());
    currentFailures.add(codFifa);
    this.failedImages.set(currentFailures);
  }

  hasFailed(codFifa: string): boolean {
    return this.failedImages().has(codFifa);
  }

  trackFlagClick(teamName: string): void {
    this.analytics.trackBannerFlagClicked(teamName);
  }
}
