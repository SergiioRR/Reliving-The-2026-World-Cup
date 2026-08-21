import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firebaseAnalytics from 'firebase/analytics';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
  logEvent: vi.fn(),
}));

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [AnalyticsService]
    });
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should track chat_opened', () => {
    service.trackChatOpened();
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'chat_opened');
  });

  it('should track timeline_interaction', () => {
    service.trackTimelineInteraction();
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'timeline_interaction');
  });

  it('should track substitution_viewed', () => {
    service.trackSubstitutionViewed();
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'substitution_viewed');
  });

  it('should track match_phase_visited', () => {
    service.trackMatchPhaseVisited('Final');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'match_phase_visited', { phase_name: 'Final' });
  });

  it('should track stats_consulted', () => {
    service.trackStatsConsulted();
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'stats_consulted');
  });

  it('should track banner_flag_clicked', () => {
    service.trackBannerFlagClicked('España');
    expect(firebaseAnalytics.logEvent).toHaveBeenCalledWith(expect.anything(), 'banner_flag_clicked', { flag_name: 'España' });
  });
});
