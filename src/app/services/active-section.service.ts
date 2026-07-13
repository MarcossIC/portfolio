import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

/**
 * Rastrea la sección visible usando una "línea de lectura virtual": un punto al
 * 38% de la altura del viewport por debajo del scroll. La sección activa es la
 * última cuyo `offsetTop` ya quedó por encima de esa línea.
 *
 * Se prefiere esto a IntersectionObserver porque un IO da saltos cuando las
 * secciones tienen alturas muy distintas.
 *
 * App zoneless: NO se usa NgZone (sería no-op). El scroll no dispara change
 * detection por sí solo; lo que agenda el render es `signal.set()`, y solo se
 * llama cuando el valor CAMBIA.
 */
@Injectable({ providedIn: 'root' })
export class ActiveSectionService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** 38% del viewport: activa la sección cuando su cabecera entra al tercio superior.
   *  Más bajo = cambia antes. */
  private static readonly READING_LINE = 0.38;

  private readonly _active = signal<string>('hero');
  readonly active = this._active.asReadonly();

  private tracking = false;

  /** Comienza a rastrear los ids dados. Idempotente: llamadas repetidas se ignoran. */
  track(ids: string[]): void {
    if (!this.isBrowser || this.tracking || ids.length === 0) return;
    this.tracking = true;

    let ticking = false;
    const update = () => {
      ticking = false;
      const mid = window.scrollY + window.innerHeight * ActiveSectionService.READING_LINE;
      let current = ids[0];
      for (const id of ids) {
        const el = this.document.getElementById(id);
        // offsetTop no fuerza reflow como getBoundingClientRect en bucle.
        if (el && el.offsetTop <= mid) current = id; // la última que "pasó" gana
      }
      // Solo re-render cuando el valor cambia: sin renders redundantes.
      if (current !== this._active()) this._active.set(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update); // rAF-throttle: nunca más de un cálculo por frame
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // El contenido @defer (projects, contact) cambia la altura tras cargar y
    // desplaza los offsetTop: recalcular ante cualquier cambio de layout.
    const resizeObserver = new ResizeObserver(() => onScroll());
    resizeObserver.observe(this.document.body);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      resizeObserver.disconnect();
    });

    update(); // estado inicial
  }
}
