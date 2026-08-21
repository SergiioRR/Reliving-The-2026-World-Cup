/**
 * @file group-timeline.component.ts
 * @author Sergio Romera Rupérez
 * @description Timeline component displaying the group stage matches.
 */

import { Component, inject, OnInit, Signal, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, DatePipe } from '@angular/common';
import { IonCard, IonCardContent, IonCardHeader, IonBadge, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, switchMap, catchError, of } from 'rxjs';
import { FirestoreService, DenormalizedMatch } from '../../core/services/firestore.service';
import { GroupNavigationComponent } from './group-navigation/group-navigation.component';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-group-timeline',
  standalone: true,
  imports: [CommonModule, RouterModule, IonCard, IonCardContent, IonCardHeader, IonBadge, IonIcon, GroupNavigationComponent, ScrollAnimateDirective],
  templateUrl: './group-timeline.component.html',
  styleUrls: ['./group-timeline.component.scss']
})
export class GroupTimelineComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private analytics = inject(AnalyticsService);
  
  private groupIdSubject = new BehaviorSubject<string>('A');
  
  @Input()
  set groupId(val: string) {
    if (val) {
      this.groupIdSubject.next(val.toUpperCase());
      this.analytics.trackMatchPhaseVisited('Grupo ' + val.toUpperCase());
    }
  }
  get groupId(): string {
    return this.groupIdSubject.value;
  }

  // Use Angular Signals to bind the matches stream to the template, updating on group change
  matches: Signal<DenormalizedMatch[] | undefined> = toSignal(
    this.groupIdSubject.pipe(
      switchMap(id => 
        this.firestoreService.getGroupMatches(id).pipe(
          catchError(err => {
            console.error('Error loading matches:', err);
            return of([]);
          })
        )
      )
    )
  );

  ngOnInit() {
    // Initialization logic if necessary
    this.analytics.trackMatchPhaseVisited('Grupo ' + this.groupId);
  }

  trackInteraction(): void {
    this.analytics.trackTimelineInteraction();
  }

  getStadiumLogo(match: DenormalizedMatch): string {
    if (!match.stadium?.city) return 'assets/icons/trophy.svg';
    
    const cityMap: Record<string, string> = {
      'zapopan': 'guadalajara',
      'guadalupe': 'monterrey',
      'mexico city': 'mexico-city',
      'arlington': 'dallas',
      'new york': 'new-york',
      'new york/new jersey': 'new-york',
      'new york new jersey': 'new-york',
      'east rutherford': 'new-york',
      'los angeles': 'los-angeles',
      'inglewood': 'los-angeles',
      'san francisco bay area': 'san-francisco',
      'san francisco': 'san-francisco',
      'santa clara': 'san-francisco',
      'seattle': 'seatle',
      'kansas city': 'kansas',
      'miami gardens': 'miami',
      'foxborough': 'boston'
    };
    
    const rawCity = match.stadium.city.toLowerCase();
    const mappedCity = cityMap[rawCity] || rawCity.replace(/\s+/g, '-');
    
    return `assets/cities/${mappedCity}.svg`;
  }

}
