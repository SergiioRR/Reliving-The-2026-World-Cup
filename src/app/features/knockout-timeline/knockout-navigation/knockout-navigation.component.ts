/**
 * @file knockout-navigation.component.ts
 * @author Sergio Romera Rupérez
 * @description Timeline component displaying the knockout stage matches and progression.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonFab, IonFabButton, IonIcon, IonRippleEffect } from '@ionic/angular/standalone';

@Component({
  selector: 'app-knockout-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, IonFab, IonFabButton, IonIcon, IonRippleEffect],
  templateUrl: './knockout-navigation.component.html',
  styleUrls: ['./knockout-navigation.component.scss']
})
export class KnockoutNavigationComponent implements OnChanges {
  @Input() phase: string = '';

  prevLabel: string = '';
  prevRoute: string = '';
  prevAria: string = '';

  nextLabel: string = '';
  nextRoute: string = '';
  nextAria: string = '';

  ngOnChanges(): void {
    if (!this.phase) return;
    
    const phaseLower = this.phase.toLowerCase();

    if (phaseLower === 'dieciseisavos') {
      this.prevLabel = '← FASE DE GRUPOS';
      this.prevRoute = '/group/a';
      this.prevAria = 'Volver a la Fase de Grupos';

      this.nextLabel = 'OCTAVOS →';
      this.nextRoute = '/knockouts/octavos';
      this.nextAria = 'Avanzar a Octavos de Final';
    } else if (phaseLower === 'octavos') {
      this.prevLabel = '← DIECISEISAVOS';
      this.prevRoute = '/knockouts/dieciseisavos';
      this.prevAria = 'Volver a Dieciseisavos';

      this.nextLabel = 'CUARTOS →';
      this.nextRoute = '/knockouts/cuartos';
      this.nextAria = 'Avanzar a Cuartos de Final';
    } else if (phaseLower === 'cuartos') {
      this.prevLabel = '← OCTAVOS';
      this.prevRoute = '/knockouts/octavos';
      this.prevAria = 'Volver a Octavos de Final';

      this.nextLabel = 'SEMIFINALES →';
      this.nextRoute = '/knockouts/semifinales';
      this.nextAria = 'Avanzar a Semifinales';
    } else if (phaseLower === 'semifinales') {
      this.prevLabel = '← CUARTOS';
      this.prevRoute = '/knockouts/cuartos';
      this.prevAria = 'Volver a Cuartos de Final';

      this.nextLabel = '';
      this.nextRoute = '';
      this.nextAria = '';
    } else if (phaseLower === 'tercer-puesto') {
      this.prevLabel = '← SEMIFINALES';
      this.prevRoute = '/knockouts/semifinales';
      this.prevAria = 'Volver a Semifinales';

      this.nextLabel = '';
      this.nextRoute = '';
      this.nextAria = '';
    } else if (phaseLower === 'final') {
      this.prevLabel = '← SEMIFINALES';
      this.prevRoute = '/knockouts/semifinales';
      this.prevAria = 'Volver a Semifinales';

      this.nextLabel = '';
      this.nextRoute = '';
      this.nextAria = '';
    }
  }
}
