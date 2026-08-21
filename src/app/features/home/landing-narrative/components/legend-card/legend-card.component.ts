/**
 * @file legend-card.component.ts
 * @author Sergio Romera Rupérez
 * @description Landing narrative component to tell the story of the World Cup.
 */

import { Component } from '@angular/core';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { ScrollAnimateDirective } from '../../../../../core/directives/scroll-animate.directive';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';

@Component({
  selector: 'app-legend-card',
  standalone: true,
  imports: [IonCard, IonCardContent, IonIcon, ScrollAnimateDirective],
  templateUrl: './legend-card.component.html',
  styleUrls: ['./legend-card.component.scss']
})
export class LegendCardComponent {
  constructor() {
    addIcons({ star });
  }
}
