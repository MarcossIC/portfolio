import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Directions } from '@app/models/types';

/** Max tilt rotation (deg) on each axis — mirrors the reference TiltCard max={7}. */
const TILT_MAX_DEG = 7;
/** Hover lift (px) folded into the tilt transform. */
const TILT_LIFT = 4;

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'timeline-element',
  templateUrl: './timeline-element.component.html',
  styleUrls: ['./timeline-element.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-visible]': 'isVisible()',
  },
})
export class TimelineElementComponent {
  protected readonly DIRECTION = {
    LEFT: Directions.LEFT,
    RIGHT: Directions.RIGHT,
  };

  public description = input.required<string>();
  public state = input.required<string>();
  public title = input.required<string>();
  public cardDirection = input.required<string>();
  public tags = input<string[]>([]);
  public time = input<string>('');

  public isVisible = signal(false);

  private tiltCard = viewChild<ElementRef<HTMLElement>>('tiltCard');
  private hostEl = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  /** Pending rAF id + the latest pointer position to flush on the next frame. */
  private rafId = 0;
  private pointerX = 0;
  private pointerY = 0;
  /** Card rect cached on pointerenter; null = must be re-read (scroll/resize). */
  private rect: DOMRect | null = null;

  constructor() {
    afterNextRender(() => {
      const host = this.hostEl.nativeElement as HTMLElement;

      this.setupRevealObserver(host);
      this.setupTilt();
    });
  }

  /**
   * Slide/fade the item in once it scrolls into view.
   *
   * Content is visible by default (SSR / no JS). The hidden "pre-reveal" state
   * only applies once the client adds `is-armed` right before observing.
   */
  private setupRevealObserver(host: HTMLElement) {
    host.classList.add('is-armed');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.isVisible.set(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(host);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  /**
   * Pointer-driven tilt, written straight to the card's `transform` in a rAF
   * (never a signal, so no change detection per pointermove).
   *
   * The card rect is read once on pointerenter and again only after a
   * scroll/resize invalidated it, and always inside the rAF right before the
   * write, so there is no forced layout per pointermove. Only enabled for
   * `(hover: hover) and (pointer: fine)` devices.
   */
  private setupTilt() {
    const card = this.tiltCard()?.nativeElement;
    if (!card) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const invalidate = () => {
      this.rect = null;
    };

    const onEnter = () => {
      this.rect = card.getBoundingClientRect();
      window.addEventListener('scroll', invalidate, { passive: true });
      window.addEventListener('resize', invalidate, { passive: true });
    };

    const onLeave = () => {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
      this.rect = null;
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      // Clear the inline transform -> back to the stylesheet (none); CSS eases it.
      card.style.transform = '';
    };

    const flush = () => {
      this.rafId = 0;
      const rect = (this.rect ??= card.getBoundingClientRect());
      const px = (this.pointerX - rect.left) / rect.width; // 0..1
      const py = (this.pointerY - rect.top) / rect.height; // 0..1
      const rotateY = (px - 0.5) * 2 * TILT_MAX_DEG;
      const rotateX = -(py - 0.5) * 2 * TILT_MAX_DEG;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-${TILT_LIFT}px)`;
    };

    const onMove = (event: PointerEvent) => {
      this.pointerX = event.clientX;
      this.pointerY = event.clientY;
      if (!this.rafId) this.rafId = requestAnimationFrame(flush);
    };

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove, { passive: true });
    card.addEventListener('pointerleave', onLeave);

    this.destroyRef.onDestroy(() => {
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    });
  }
}
