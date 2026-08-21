/**
 * @file main-menu.component.ts
 * @author Sergio Romera Rupérez
 * @description Angular component or service module for the World Cup 2026 application.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonToolbar, IonButton, IonImg, IonPopover, IonContent, IonList, IonItem, IonRouterLink } from '@ionic/angular/standalone';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, IonToolbar, IonButton, IonImg, IonPopover, IonContent, IonList, IonItem, IonRouterLink],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  
  constructor() {}

  onNaranjitoClick(): void {
    console.log('[AI Chatbot] Naranjito drawer triggered.');
  }
}
