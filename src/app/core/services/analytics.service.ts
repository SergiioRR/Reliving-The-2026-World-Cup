import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_APY_KEY',
  authDomain: 'mundial-2026-web-5b963.firebaseapp.com',
  projectId: 'mundial-2026-web-5b963',
  storageBucket: 'mundial-2026-web-5b963.firebasestorage.app',
  messagingSenderId: '432174144701',
  appId: '1:432174144701:web:a17bf1893d3625ada3abd4',
  measurementId: 'G-2G1X2K7KSD'
};

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private app: FirebaseApp;
  private analytics: Analytics;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
  }

  trackChatOpened(): void {
    logEvent(this.analytics, 'chat_opened');
  }

  trackTimelineInteraction(): void {
    logEvent(this.analytics, 'timeline_interaction');
  }

  trackSubstitutionViewed(): void {
    logEvent(this.analytics, 'substitution_viewed');
  }

  trackMatchPhaseVisited(phaseName: string): void {
    logEvent(this.analytics, 'match_phase_visited', { phase_name: phaseName });
  }

  trackStatsConsulted(): void {
    logEvent(this.analytics, 'stats_consulted');
  }

  trackBannerFlagClicked(flagName: string): void {
    logEvent(this.analytics, 'banner_flag_clicked', { flag_name: flagName });
  }
}
