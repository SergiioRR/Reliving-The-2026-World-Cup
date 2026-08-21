/**
 * @file home.component.ts
 * @author Sergio Romera Rupérez
 * @description Angular component or service module for the World Cup 2026 application.
 */

import { Component } from '@angular/core';
import { HeroCoverComponent } from './hero-cover/hero-cover.component';
import { LandingNarrativeComponent } from './landing-narrative/landing-narrative.component';
import { NextWorldCupCountdownComponent } from './next-worldcup-countdown/next-worldcup-countdown.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroCoverComponent,
    LandingNarrativeComponent,
    NextWorldCupCountdownComponent
  ],
  template: `
    <!-- 3. Hero cover: black background, NY skyline, ⭐⭐ crest, trophy -->
    <app-hero-cover></app-hero-cover>

    <!-- 3.5 Landing Narrative Blocks (Eternity & Legend Cards) -->
    <app-landing-narrative></app-landing-narrative>

    <!-- 5. Countdown to 2030 + monetization slot -->
    <app-next-worldcup-countdown></app-next-worldcup-countdown>
  `
})
export class HomeComponent {}
