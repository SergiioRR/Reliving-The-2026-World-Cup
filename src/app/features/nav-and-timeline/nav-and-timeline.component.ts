/**
 * @file nav-and-timeline.component.ts
 * @author Sergio Romera Rupérez
 * @description Angular component or service module for the World Cup 2026 application.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonSegment, IonSegmentButton, IonAccordionGroup,
  IonAccordion, IonList, IonItem, IonLabel, IonIcon
} from '@ionic/angular/standalone';
import { MatchDataService, DenormalizedMatch, MatchEvent } from '../../core/services/match-data.service';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-nav-and-timeline',
  standalone: true,
  imports: [
    CommonModule,
    IonSegment, IonSegmentButton, IonAccordionGroup,
    IonAccordion, IonList, IonItem, IonLabel
  ],
  templateUrl: './nav-and-timeline.component.html',
  styleUrls: ['./nav-and-timeline.component.scss']
})
export class NavAndTimelineComponent implements OnInit {
  public selectedPhase: string = 'Fase de Grupos';
  public matches: DenormalizedMatch[] = [];
  public animatingSubstitutions: Record<string, boolean> = {};

  constructor(
    private matchDataService: MatchDataService,
    private analyticsService: AnalyticsService
  ) { }

  public ngOnInit(): void {
    this.loadMatches();
  }

  public onPhaseChange(event: Event): void {
    const customEvent = event as CustomEvent;
    this.selectedPhase = customEvent.detail.value as string;
    this.loadMatches();
  }

  private loadMatches(): void {
    this.matchDataService.getMatchesByPhase(this.selectedPhase).subscribe((data: DenormalizedMatch[]) => {
      this.matches = data;
    });
  }

  public triggerSubstitution(eventId: string): void {
    this.analyticsService.trackSubstitutionViewed();
    this.animatingSubstitutions[eventId] = true;
    setTimeout(() => {
      this.animatingSubstitutions[eventId] = false;
    }, 1000);
  }

  public getKitUrl(fifaCode: string, type: 'home' | 'away'): string {
    return `assets/kits/${fifaCode.toLowerCase()}_${type}.svg`;
  }

  public getDisplayName(shortName: string | null | undefined, officialName: string): string {
    return this.matchDataService.getTeamDisplayName(shortName, officialName);
  }
}
