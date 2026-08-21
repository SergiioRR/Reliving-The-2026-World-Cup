/**
 * @file team-stats.component.ts
 * @author Sergio Romera Rupérez
 * @description Component for displaying specific team statistics and metrics.
 */

import { Component, ChangeDetectionStrategy, signal, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { AnalyticsService } from '../../core/services/analytics.service';

export interface StatTeam {
  teamName: string;
  value: number | string;
  country?: string;
}

export interface StatCategory {
  title: string;
  teams: StatTeam[];
}

@Component({
  selector: 'app-team-stats',
  standalone: true,
  imports: [CommonModule, RouterModule, IonGrid, IonRow, IonCol, ScrollAnimateDirective],
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamStatsComponent implements OnInit {

  public statCategories = signal<StatCategory[]>([]);
  private analytics = inject(AnalyticsService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    this.analytics.trackStatsConsulted();
    if (isPlatformBrowser(this.platformId)) {
      try {
        const res = await fetch('/assets/data/team-stats.json');
        if (res.ok) {
          const data = await res.json();
          this.statCategories.set(data);
        }
      } catch (e) {
        console.error('Error fetching team stats', e);
      }
    }
  }
}
