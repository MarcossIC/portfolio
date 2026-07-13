import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  animationFrameScheduler,
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  observeOn,
  startWith,
  Subject,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'scroll-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="scroll-bar"
      [style.transform]="'scaleX(' + progress() + ')'"
    ></div>
  `,
  styles: `
    .scroll-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, oklch(0.51 0.19 27.52), oklch(0.58 0.23 28.18));
      transform-origin: left;
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

  protected readonly progress = signal(0);

  constructor() {
    afterNextRender(() => {
      const heightChange$ = new Subject<void>();

      // ResizeObserver on body to detect @defer content loading
      const resizeObserver = new ResizeObserver(() => heightChange$.next());
      resizeObserver.observe(this.document.body);
      this.destroyRef.onDestroy(() => resizeObserver.disconnect());

      const scroll$ = fromEvent(window, 'scroll', { passive: true }).pipe(startWith(0));

      merge(scroll$, heightChange$)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          observeOn(animationFrameScheduler),
          map(() => {
            const scrollY = window.scrollY;
            const maxScroll = Math.max(0, this.document.documentElement.scrollHeight - window.innerHeight);
            if (maxScroll === 0) return 0;
            return Math.min(scrollY / maxScroll, 1);
          }),
          distinctUntilChanged((a, b) => Math.abs(a - b) < 0.002),
        )
        .subscribe((value) => this.progress.set(value));
    });
  }
}
