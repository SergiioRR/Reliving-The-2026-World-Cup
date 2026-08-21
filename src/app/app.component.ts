/**
 * @file app.component.ts
 * @author Sergio Romera Rupérez
 * @description Root component of the Angular application.
 */

import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { IonApp, IonContent } from '@ionic/angular/standalone';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

// Feature components — Home Interface (004)
import { HeaderMarqueeComponent } from './features/header-marquee/header-marquee.component';
import { MainMenuComponent } from './features/home/main-menu/main-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonApp,
    IonContent,
    RouterOutlet,
    HeaderMarqueeComponent,
    MainMenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(IonContent, { static: true }) content!: IonContent;
  private router = inject(Router);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.content) {
        this.content.scrollToTop(0);
      }
    });
  }
}