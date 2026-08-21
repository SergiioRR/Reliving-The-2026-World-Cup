/**
 * @file home-scroll-sections.component.ts
 * @author Sergio Romera Rupérez
 * @description Angular component or service module for the World Cup 2026 application.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-scroll-sections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-scroll-sections.component.html',
  styleUrls: ['./home-scroll-sections.component.scss']
})
export class HomeScrollSectionsComponent implements AfterViewInit, OnDestroy {

  @ViewChildren('revealSection')
  private readonly sections!: QueryList<ElementRef<HTMLElement>>;

  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    // Respect prefers-reduced-motion — skip observer if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Immediately show all sections
      this.sections.forEach(({ nativeElement }) => {
        nativeElement.classList.add('is-visible');
      });
      return;
    }

    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Unobserve once revealed — fire-and-forget
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    this.sections.forEach(({ nativeElement }) => {
      this.observer!.observe(nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
