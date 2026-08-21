/**
 * @file hero-cover.component.ts
 * @author Sergio Romera Rupérez
 * @description Hero cover component for the home page, displaying the main World Cup 2026 banner.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-hero-cover',
  standalone: true,
  imports: [CommonModule, RouterModule, IonButton, IonIcon],
  templateUrl: './hero-cover.component.html',
  styleUrls: ['./hero-cover.component.scss']
})
export class HeroCoverComponent {
  constructor(private router: Router) {}

  navigateToMatches(): void {
    this.router.navigate(['/partidos']);
  }
}
