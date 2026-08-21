/**
 * @file ad-banner.component.ts
 * @author Sergio Romera Rupérez
 * @description Shared UI component used across multiple feature modules.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  template: `
    <div class="ad-banner-container bg-surface-container-high border border-surface-variant rounded-lg p-4 w-full max-w-md mx-auto text-center shadow-sm">
      <span class="text-label-sm text-secondary uppercase tracking-widest opacity-60" aria-hidden="true">Advertisement</span>
      <div class="mt-2 h-16 w-full bg-surface-variant/50 rounded flex items-center justify-center border border-dashed border-outline-variant" role="banner">
        <p class="text-on-surface-variant text-body-md m-0">Official Sponsor Space</p>
      </div>
    </div>
  `
})
export class AdBannerComponent {}
