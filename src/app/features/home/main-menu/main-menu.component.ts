/**
 * @file main-menu.component.ts
 * @author Sergio Romera Rupérez
 * @description Main menu navigation component for the home page.
 */

import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import {
  IonPopover,
  IonList,
  IonItem,
  IonAccordionGroup,
  IonAccordion,
  IonLabel,
  IonToolbar,
  IonImg,
  IonButton,
  IonContent
} from '@ionic/angular/standalone';

/** All round names available in the navigation */
type RoundKey =
  | 'Fase de Grupos'
  | 'Dieciseisavos'
  | 'Octavos'
  | 'Cuartos'
  | 'Semifinales'
  | 'Tercer Puesto'
  | 'Final';

interface NavRound {
  readonly label: string;
  readonly key: RoundKey;
  readonly routerPath: string;
}

const ROUNDS: readonly NavRound[] = [
  { label: 'FASE DE GRUPOS', key: 'Fase de Grupos', routerPath: '/matches/group/A' },
  { label: 'DIECISEISAVOS', key: 'Dieciseisavos',  routerPath: '/matches/round/16' },
  { label: 'OCTAVOS',       key: 'Octavos',        routerPath: '/matches/round/8'  },
  { label: 'CUARTOS',       key: 'Cuartos',        routerPath: '/matches/round/4'  },
  { label: 'SEMIFINALES',   key: 'Semifinales',    routerPath: '/matches/round/sf' },
  { label: 'TERCER PUESTO', key: 'Tercer Puesto',  routerPath: '/matches/round/3p' },
  { label: 'FINAL',         key: 'Final',          routerPath: '/matches/round/final' },
];

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'] as const;
type GroupLetter = typeof GROUPS[number];

/** Auto-dismiss delay for the Naranjito welcome tooltip (ms) */
const NARANJITO_AUTO_DISMISS_MS = 4500;

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonPopover,
    IonList,
    IonItem,
    IonAccordionGroup,
    IonAccordion,
    IonLabel,
    IonToolbar,
    IonImg,
    IonButton,
    IonContent
  ],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  public isChatbotRoute = signal<boolean>(false);

  constructor() {
    this.router.events.subscribe(() => {
      this.isChatbotRoute.set(this.router.url.includes('/chatbot'));
    });
  }

  readonly rounds = ROUNDS;
  readonly groups: readonly GroupLetter[] = GROUPS;

  /** State tracking for styling the chevron buttons */
  readonly partidosOpen = signal<boolean>(false);
  readonly estadisticasOpen = signal<boolean>(false);

  readonly showNaranjitoTooltip = signal<boolean>(true);

  private naranjitoHovered = false;
  private naranjitoAutoTimerId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.naranjitoAutoTimerId = setTimeout(() => {
      if (!this.naranjitoHovered) {
        this.showNaranjitoTooltip.set(false);
      }
    }, NARANJITO_AUTO_DISMISS_MS);
  }

  ngOnDestroy(): void {
    if (this.naranjitoAutoTimerId !== null) {
      clearTimeout(this.naranjitoAutoTimerId);
      this.naranjitoAutoTimerId = null;
    }
  }

  onNaranjitoMouseLeave(): void {
    this.naranjitoHovered = false;
    if (this.naranjitoAutoTimerId === null) {
      this.showNaranjitoTooltip.set(false);
    }
  }

  onNaranjitoMouseEnter(): void {
    this.naranjitoHovered = true;
    if (this.naranjitoAutoTimerId !== null) {
      clearTimeout(this.naranjitoAutoTimerId);
      this.naranjitoAutoTimerId = null;
    }
    this.showNaranjitoTooltip.set(true);
  }

  onPartidosDidPresent(): void {
    this.partidosOpen.set(true);
  }
  
  onPartidosDidDismiss(): void {
    this.partidosOpen.set(false);
  }

  onEstadisticasDidPresent(): void {
    this.estadisticasOpen.set(true);
  }

  onEstadisticasDidDismiss(): void {
    this.estadisticasOpen.set(false);
  }

  openChatbot(): void {
    console.info('[Naranjito] Chatbot drawer open triggered');
  }

  onNaranjitoClick(): void {
    this.openChatbot();
  }

  navigateToStats(type: string, popover: any): void {
    popover.dismiss().then(() => {
      this.router.navigate(['/stats', type]);
    });
  }
}
