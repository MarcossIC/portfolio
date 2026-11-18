import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReducedMotionService } from '@app/services/ReducedMotion.service';
import { I18nService } from '@app/services/i18n.service';

const PROJECT_SELECTOR = '.project-img, project-article, .project-card-container';
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [data-cursor-interactive]';
/** Fields that keep the native cursor (I-beam). Button-like inputs stay on the custom cursor. */
const TEXT_FIELD_SELECTOR =
  'input:not([type="submit"], [type="button"], [type="reset"], [type="checkbox"], [type="radio"], ' +
  '[type="range"], [type="file"], [type="color"], [type="image"]), ' +
  'textarea, select, [contenteditable]:not([contenteditable="false"])';

/** Exponential smoothing rate (1/s) of the trailing ring. */
const RING_SMOOTHING = 18;
/** Distance (px) under which the ring is considered converged and the rAF loop idles. */
const EPSILON = 0.1;

/**
 * Custom cursor: a crisp dot (1:1 with the pointer) plus a trailing ring.
 *
 * Perf design: position never goes through signals/change detection. A single rAF loop
 * writes `transform: translate3d` straight to the elements and idles when converged.
 * Visual states animate only `transform` (scale) and `opacity` (no layout), and the state
 * is kept as classes on the host that are toggled only on real transitions.
 *
 * No `mix-blend-mode`: it forces extra compositing over the WebGL canvas / glass layers.
 * White dot + translucent ring with a faint shadow reads fine on the dark violet background.
 */
@Component({
  standalone: true,
  selector: 'custom-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #dot class="cursor-dot" aria-hidden="true"><div class="cursor-dot-core"></div></div>
    <div #ring class="cursor-ring" aria-hidden="true">
      <div class="cursor-ring-core">
        @if (isOnProject()) {
          <span class="cursor-label">{{ cursorLabel() }}</span>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      pointer-events: none;
      position: fixed;
      inset: 0;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    :host(.is-visible) {
      opacity: 1;
    }

    .cursor-dot,
    .cursor-ring {
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      will-change: transform;
    }

    .cursor-dot-core {
      width: 6px;
      height: 6px;
      margin: -3px 0 0 -3px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 6px rgba(167, 139, 250, 0.8);
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .cursor-ring-core {
      --scale: 1;
      width: 32px;
      height: 32px;
      margin: -16px 0 0 -16px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.35);
      background: rgba(139, 92, 246, 0);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: scale(var(--scale));
      transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease,
        background-color 0.25s ease, border-color 0.25s ease;
    }

    :host(.cursor-hover) .cursor-ring-core {
      --scale: 1.5;
      border-color: rgba(167, 139, 250, 0.8);
      background: rgba(139, 92, 246, 0.12);
    }

    :host(.cursor-project) .cursor-ring-core {
      --scale: 2.2;
    }

    :host(.cursor-project) .cursor-dot-core {
      opacity: 0;
    }

    :host(.cursor-pressed) .cursor-ring-core {
      transform: scale(calc(var(--scale) * 0.85));
    }

    :host(.cursor-pressed) .cursor-dot-core {
      transform: scale(0.7);
    }

    /* Over a project the ring becomes a dark pill so the label reads on light screenshots too */
    :host(.cursor-project) .cursor-ring-core {
      background: rgba(18, 6, 44, 0.92);
      border-color: rgba(216, 180, 254, 0.45);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
    }

    .cursor-label {
      /* Cancel the ring scale so the text keeps its size */
      transform: scale(calc(1 / var(--scale)));
      font-size: 0.65rem;
      font-weight: 600;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    @media (pointer: coarse), (hover: none) {
      :host {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .cursor-dot-core,
      .cursor-ring-core,
      :host {
        transition: none;
      }
    }
  `,
})
export class CustomCursorComponent {
  private readonly platform = inject(PLATFORM_ID);
  private readonly motionService = inject(ReducedMotionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18nService = inject(I18nService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private readonly dotRef = viewChild.required<ElementRef<HTMLElement>>('dot');
  private readonly ringRef = viewChild.required<ElementRef<HTMLElement>>('ring');

  // Rare state changes only (label rendering); never position.
  protected readonly isOnProject = signal(false);
  protected readonly cursorLabel = computed(() =>
    this.i18nService.currentLanguage() === 'es' ? 'Ver' : 'View'
  );

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platform)) return;
      if (window.matchMedia('(pointer: coarse), (hover: none)').matches) return;

      const dotEl = this.dotRef().nativeElement;
      const ringEl = this.ringRef().nativeElement;
      const hostEl = this.host;

      let started = false;
      let outside = false;
      let overText = false;
      let visible = false;
      let hover = false;
      let project = false;
      let pressed = false;

      let tx = 0;
      let ty = 0;
      let rx = 0;
      let ry = 0;
      let last = 0;
      let rafId = 0;
      let styleEl: HTMLStyleElement | null = null;

      const setClass = (name: string, on: boolean) => hostEl.classList.toggle(name, on);

      const syncVisible = () => {
        const next = started && !outside && !overText;
        if (next === visible) return;
        visible = next;
        setClass('is-visible', next);
      };

      const write = (el: HTMLElement, x: number, y: number) => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      };

      const tick = (now: number) => {
        const dt = Math.min(Math.max((now - last) / 1000, 0), 0.1);
        last = now;

        write(dotEl, tx, ty);

        if (this.motionService.prefersReducedMotion()) {
          rx = tx;
          ry = ty;
        } else {
          const a = 1 - Math.exp(-dt * RING_SMOOTHING);
          rx += (tx - rx) * a;
          ry += (ty - ry) * a;
          if (Math.abs(tx - rx) < EPSILON && Math.abs(ty - ry) < EPSILON) {
            rx = tx;
            ry = ty;
          }
        }
        write(ringEl, rx, ry);

        // Idle once converged; the next pointermove restarts the loop
        if (rx === tx && ry === ty) {
          rafId = 0;
          return;
        }
        rafId = requestAnimationFrame(tick);
      };

      const ensureLoop = () => {
        if (rafId) return;
        last = performance.now() - 16;
        rafId = requestAnimationFrame(tick);
      };

      const hideNativeCursor = () => {
        if (styleEl) return;
        styleEl = document.createElement('style');
        styleEl.id = 'custom-cursor-hide';
        // Keep the native I-beam on editable fields
        const notField = `*:not(${TEXT_FIELD_SELECTOR})`;
        styleEl.textContent = `${notField}, ${notField}::before, ${notField}::after { cursor: none !important; }`;
        document.head.appendChild(styleEl);
      };

      const onMove = (e: PointerEvent | MouseEvent) => {
        tx = e.clientX;
        ty = e.clientY;
        if (!started || outside) {
          // First move or re-entry: no trail from a stale position
          rx = tx;
          ry = ty;
        }
        if (!started) {
          started = true;
          hideNativeCursor();
        }
        outside = false;
        syncVisible();
        ensureLoop();
      };

      const onOver = (e: Event) => {
        const el = e.target instanceof Element ? e.target : null;
        const nextText = !!el?.closest(TEXT_FIELD_SELECTOR);
        const nextProject = !nextText && !!el?.closest(PROJECT_SELECTOR);
        const nextHover = !nextText && !nextProject && !!el?.closest(INTERACTIVE_SELECTOR);

        if (nextText !== overText) {
          overText = nextText;
          syncVisible();
        }
        if (nextProject !== project) {
          project = nextProject;
          setClass('cursor-project', nextProject);
          this.isOnProject.set(nextProject);
        }
        if (nextHover !== hover) {
          hover = nextHover;
          setClass('cursor-hover', nextHover);
        }
      };

      const onDown = () => {
        if (pressed) return;
        pressed = true;
        setClass('cursor-pressed', true);
      };
      const onUp = () => {
        if (!pressed) return;
        pressed = false;
        setClass('cursor-pressed', false);
      };

      const onOut = (e: MouseEvent) => {
        if (e.relatedTarget !== null) return;
        outside = true;
        syncVisible();
      };

      document.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('pointerdown', onDown, { passive: true });
      document.addEventListener('pointerup', onUp, { passive: true });
      document.addEventListener('pointercancel', onUp, { passive: true });
      document.addEventListener('mouseout', onOut);
      window.addEventListener('blur', onUp);

      this.destroyRef.onDestroy(() => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.removeEventListener('pointerdown', onDown);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onUp);
        document.removeEventListener('mouseout', onOut);
        window.removeEventListener('blur', onUp);
        if (rafId) cancelAnimationFrame(rafId);
        styleEl?.remove();
      });
    });
  }
}
