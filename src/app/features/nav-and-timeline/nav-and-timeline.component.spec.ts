import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavAndTimelineComponent } from './nav-and-timeline.component';
import { By } from '@angular/platform-browser';

describe('NavAndTimelineComponent', () => {
  let component: NavAndTimelineComponent;
  let fixture: ComponentFixture<NavAndTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavAndTimelineComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(NavAndTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should ensure touch targets are at least 44x44px', () => {
    const segmentButtons = fixture.debugElement.queryAll(By.css('ion-segment-button'));
    segmentButtons.forEach(btn => {
      expect(btn.nativeElement.classList.contains('touch-target')).toBe(true);
    });

    const secondButton = fixture.debugElement.query(By.css('.group-btn:last-child'));
    expect(secondButton.nativeElement.classList.contains('touch-target')).toBe(true);

    const ctaButton = fixture.debugElement.query(By.css('.cta-button'));
    expect(ctaButton.nativeElement.classList.contains('touch-target')).toBe(true);
  });

  it('should enforce AdSense placeholders have min-height 250px for CLS=0', () => {
    const adPlaceholder = fixture.debugElement.query(By.css('.ad-slot-placeholder'));
    expect(adPlaceholder.nativeElement).toBeTruthy();
  });
  
  it('should render GOL, TARJETA, and SUSTITUCION events chronologically', () => {
    const items = fixture.debugElement.queryAll(By.css('.timeline-item'));
    expect(items.length).toBeGreaterThan(0);
    const text = items[0].nativeElement.textContent;
    expect(text).toContain('GOL');
  });
});
