/**
 * @file app.config.ts
 * @author Sergio Romera Rupérez
 * @description Main application configuration, including providers and routing setup.
 */

import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app.routes';
import { AnalyticsService } from './core/services/analytics.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideIonicAngular({}),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (analyticsService: AnalyticsService) => () => {
        // By injecting the service here, we force its initialization (and Firebase's) before rendering the app.
        return Promise.resolve();
      },
      deps: [AnalyticsService],
      multi: true
    }
  ],
};
