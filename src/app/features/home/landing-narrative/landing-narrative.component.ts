/**
 * @file landing-narrative.component.ts
 * @author Sergio Romera Rupérez
 * @description Landing narrative component to tell the story of the World Cup.
 */

import { Component } from '@angular/core';
import { EternityCardComponent } from './components/eternity-card/eternity-card.component';
import { LegendCardComponent } from './components/legend-card/legend-card.component';

import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

@Component({
  selector: 'app-landing-narrative',
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, EternityCardComponent, LegendCardComponent],
  templateUrl: './landing-narrative.component.html',
  styleUrls: ['./landing-narrative.component.scss']
})
export class LandingNarrativeComponent {}
