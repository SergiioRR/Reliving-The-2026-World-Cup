/**
 * @file app.routes.ts
 * @author Sergio Romera Rupérez
 * @description Application routing configuration and route definitions.
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Default home route
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'group/:groupId',
    loadComponent: () => import('./features/group-timeline/group-timeline.component').then(m => m.GroupTimelineComponent)
  },
  {
    path: 'partidos',
    loadComponent: () => import('./features/main-matches/main-matches.component').then(m => m.MainMatchesComponent)
  },
  {
    path: 'knockouts/:phase',
    loadComponent: () => import('./features/knockout-timeline/knockout-timeline.component').then(m => m.KnockoutTimelineComponent)
  },
  {
    // Group-stage matches — lazy loaded (AC-2: click-to-group routing)
    path: 'matches/group/:groupLetter',
    loadComponent: () =>
      import('./features/nav-and-timeline/nav-and-timeline.component').then(
        (m) => m.NavAndTimelineComponent
      )
  },
  {
    // Knockout round matches — lazy loaded
    path: 'matches/round/:roundId',
    loadComponent: () =>
      import('./features/nav-and-timeline/nav-and-timeline.component').then(
        (m) => m.NavAndTimelineComponent
      )
  },
  {
    // Statistics Routes
    path: 'stats/jugadores',
    loadComponent: () => import('./features/tournament-stats/tournament-stats.component').then(m => m.TournamentStatsComponent)
  },
  {
    path: 'stats/selecciones',
    loadComponent: () => import('./features/team-stats/team-stats.component').then(m => m.TeamStatsComponent)
  },
  {
    // Redirect unknown stats routes to home until Phase 2 builds them
    path: 'stats/:type',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    // Match Details route
    path: 'match/:id',
    loadComponent: () => import('./features/match-details/match-details.component').then(m => m.MatchDetailsComponent)
  },
  {
    path: 'chatbot',
    loadComponent: () => import('./features/chatbot/chatbot.component').then(m => m.ChatbotComponent)
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./features/legal/legal-page.component').then(m => m.LegalPageComponent),
    data: { page: 'privacidad' }
  },
  {
    path: 'accesibilidad',
    loadComponent: () => import('./features/legal/legal-page.component').then(m => m.LegalPageComponent),
    data: { page: 'accesibilidad' }
  },
  {
    path: 'aviso-legal',
    loadComponent: () => import('./features/legal/legal-page.component').then(m => m.LegalPageComponent),
    data: { page: 'aviso-legal' }
  },
  {
    // Wildcard — redirect unknown routes to home
    path: '**',
    redirectTo: ''
  }
];
