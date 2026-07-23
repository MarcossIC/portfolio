import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type Atmos = 'nebula' | 'ember';

export const ATMOS_STORAGE_KEY = 'ml-atmos';

/**
 * Two cosmic "climates" driven by a single attribute on <html>:
 * no attribute → Nebula (:root defaults), data-atmos="ember" → Ember overrides.
 * The initial value is set pre-paint by an inline script in index.html.
 */
@Injectable({ providedIn: 'root' })
export class AtmosphereService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _atmos = signal<Atmos>(
    this.document.documentElement.dataset['atmos'] === 'ember'
      ? 'ember'
      : 'nebula'
  );
  public readonly atmos = this._atmos.asReadonly();

  public commit(next: Atmos): void {
    const html = this.document.documentElement;
    if (next === 'ember') html.dataset['atmos'] = 'ember';
    else delete html.dataset['atmos'];

    if (this.isBrowser) {
      try {
        localStorage.setItem(ATMOS_STORAGE_KEY, next);
      } catch {
        // storage blocked (private mode) — the mode still applies for this visit
      }
    }

    this._atmos.set(next);
  }

  public toggle(): void {
    this.commit(this._atmos() === 'ember' ? 'nebula' : 'ember');
  }
}
