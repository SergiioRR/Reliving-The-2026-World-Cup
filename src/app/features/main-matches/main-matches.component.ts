/**
 * @file main-matches.component.ts
 * @author Sergio Romera Rupérez
 * @description Angular component or service module for the World Cup 2026 application.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';

@Component({
  selector: 'app-main-matches',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  templateUrl: './main-matches.component.html',
  styleUrls: ['./main-matches.component.scss']
})
export class MainMatchesComponent {
  private router = inject(Router);

  navigateToGroupA() {
    this.router.navigate(['/group/A']);
  }
}
