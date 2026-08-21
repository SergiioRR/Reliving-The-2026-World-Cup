/**
 * @file scroll-animate.directive.ts
 * @author Sergio Romera Rupérez
 * @description Core directive for DOM manipulation and UI behaviors.
 */

import { Directive, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px 50px 0px', // Triggers slightly before it enters or right when it enters
      threshold: 0.05 // Requires only 5% of the element to be visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(this.el.nativeElement, 'in-view');
        } else {
          // Optional: remove class when out of view so it animates again next time, 
          // or leave it if you only want it to animate once.
          // We will remove it so the animation replays when scrolling up and down.
          this.renderer.removeClass(this.el.nativeElement, 'in-view');
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
