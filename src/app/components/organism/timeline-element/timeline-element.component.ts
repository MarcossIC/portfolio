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

  /** Pending rAF id + the transform to flush on the next frame (avoids per-event writes). */
  private rafId = 0;
  private pendingTransform = '';

  constructor() {
    afterNextRender(() => {
      const host = this.hostEl.nativeElement as HTMLElement;
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      this.setupRevealObserver(host, prefersReducedMotion);
      this.setupTilt(prefersReducedMotion);
    });
  }

  /** Slide/fade the item in once it scrolls into view. */
  private setupRevealObserver(host: HTMLElement, prefersReducedMotion: boolean) {
    if (prefersReducedMotion) {
      this.isVisible.set(true);
      return;
    }

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
   * Pointer-driven FLAT tilt, written straight to the card's `transform`.
   *
   * Critical: this is a *flat* tilt — `perspective() rotateX rotateY` only, NO
   * `transform-style: preserve-3d` and NO `translateZ`. A 3D rendering context
   * disables `backdrop-filter` in Chrome (kills the glass). A flat 2D transform
   * on the glass element itself does NOT — verified empirically.
   *
   * Rotation is flushed in a rAF (never a signal) so per-frame pointermove
   * doesn't trigger change detection in this zoneless app. The hover glow +
   * border are pure CSS :hover.
   */
  private setupTilt(prefersReducedMotion: boolean) {
    const card = this.tiltCard()?.nativeElement;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // No tilt on touch devices or when motion is reduced — the card keeps its
    // glass + CSS hover, just without the rotation.
    if (!card || prefersReducedMotion || coarsePointer) return;

    const onLeave = () => {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
      // Clear the inline transform → back to the stylesheet (none); CSS eases it.
      card.style.transform = '';
    };

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width; // 0..1
      const py = (event.clientY - rect.top) / rect.height; // 0..1
      const rotateY = (px - 0.5) * 2 * TILT_MAX_DEG;
      const rotateX = -(py - 0.5) * 2 * TILT_MAX_DEG;

      // Flat tilt + the hover lift, all in one transform on the glass element.
      this.pendingTransform = `perspective(1000px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-${TILT_LIFT}px)`;

      if (!this.rafId) {
        this.rafId = requestAnimationFrame(() => {
          card.style.transform = this.pendingTransform;
          this.rafId = 0;
        });
      }
    };

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);

    this.destroyRef.onDestroy(() => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    });
  }
}
