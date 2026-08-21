/**
 * @file eternity-card.component.ts
 * @author Sergio Romera Rupérez
 * @description Landing narrative component to tell the story of the World Cup.
 */

import { Component } from '@angular/core';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { ScrollAnimateDirective } from '../../../../../core/directives/scroll-animate.directive';

@Component({
  selector: 'app-eternity-card',
  standalone: true,
  imports: [IonCard, IonCardContent, ScrollAnimateDirective],
  templateUrl: './eternity-card.component.html',
  styleUrls: ['./eternity-card.component.scss']
})
export class EternityCardComponent {}
