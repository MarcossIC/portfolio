import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'scroll-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="scroll-bar" #bar></div>`,
  styles: `
    .scroll-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, oklch(0.51 0.19 27.52), oklch(0.58 0.23 28.18));
      transform: scaleX(0);
      transform-origin: left;
      will-change: transform;
      z-index: 60;
      pointer-events: none;
      /* Interpola los pasos discretos de la rueda del ratón → deslizamiento
         continuo. linear (no ease) para que siga al scroll sin sensación de goma;
         0.12s queda justo por encima de la cadencia de ticks (~80-100ms). */
      transition: transform 0.12s linear;
    }
  `,
})
export class ScrollProgressBarComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly bar = viewChild.required<ElementRef<HTMLElement>>('bar');

  constructor() {
    afterNextRender(() => {
      const el = this.bar().nativeElement;
      const root = this.document.documentElement;
      let rafId = 0;
      let last = -1;

      // Purely visual value: written straight to the style in a rAF, never via a
      // signal, so scrolling triggers no change detection.
      const update = () => {
        rafId = 0;
        const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
        const value = maxScroll === 0 ? 0 : Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        if (Math.abs(value - last) < 0.002) return;
        last = value;
        el.style.transform = `scaleX(${value})`;
      };
      const schedule = () => {
        if (!rafId) rafId = requestAnimationFrame(update);
      };

      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      // Height changes (@defer content loading) alter the progress ratio.
      const resizeObserver = new ResizeObserver(schedule);
      resizeObserver.observe(this.document.body);

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        resizeObserver.disconnect();
        if (rafId) cancelAnimationFrame(rafId);
      });
      update();
    });
  }
}
