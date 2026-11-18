import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { TimelineElementComponent } from '../timeline-element/timeline-element.component';
import { Directions, UserExperience, type UserStudies } from '@app/models/types';
import { litFlags, nodeThresholds } from './timeline-ignite';

@Component({
  standalone: true,
  imports: [TimelineElementComponent],
  selector: 'timeline-experiency',
  template: `
      <div class="timeline" #timelineContainer>
        <div class="timeline-progress" #progress></div>
        @for (ITEM of ITEMS(); track ITEM.ID) {
          <timeline-element
            [cardDirection]="$index % 2 !== 1 ? DIRECTION.LEFT : DIRECTION.RIGHT"
            [title]="ITEM.ROLE"
            [state]="ITEM.COMPANY"
            [description]="ITEM.DESCRIPTION"
            [tags]="ITEM.STACK"
            [time]="ITEM.TIME"
            [style.width]="'100%'"
          ></timeline-element>
        }
      </div>
  `,
  styleUrls: ['./timeline-experiency.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineExperiencyComponent {
  public ITEMS = input.required<UserExperience[]>();
  protected readonly DIRECTION = {
    LEFT: Directions.LEFT,
    RIGHT: Directions.RIGHT,
  };

  private readonly destroyRef = inject(DestroyRef);
  private readonly timelineContainer = viewChild<ElementRef>('timelineContainer');

  private readonly progress = viewChild<ElementRef<HTMLElement>>('progress');

  constructor() {
    afterNextRender(() => {
      const bar = this.progress()?.nativeElement;
      if (!bar) return;

      const badges = (): HTMLElement[] =>
        Array.from(this.timelineContainer()?.nativeElement.querySelectorAll('.timeline-node__badge') ?? []);

      // Node "ignition": thresholds (fraction of the rail height) are measured once
      // and again only when the container resizes; offsetTop ignores the reveal transforms.
      let nodes: HTMLElement[] = [];
      let thresholds: number[] = [];
      let lit: boolean[] = [];
      let dirty = true;
      const measure = (container: HTMLElement) => {
        dirty = false;
        nodes = badges();
        const centers = nodes.map((badge) => {
          const node = badge.closest('.timeline-node') as HTMLElement | null;
          const item = node?.closest('.timeline-item') as HTMLElement | null;
          return (item?.offsetTop ?? 0) + (node?.offsetTop ?? 0) + (node?.offsetHeight ?? 0) / 2;
        });
        thresholds = nodeThresholds(centers, container.offsetHeight || container.getBoundingClientRect().height);
        lit = nodes.map((n) => n.classList.contains('is-lit'));
      };

      // Visual-only value: written straight to the element in a rAF (no signal,
      // no change detection per scroll frame). CSS applies it via scaleY().
      let rafId = 0;
      let last = -1;
      const updateFill = () => {
        rafId = 0;
        const container = this.timelineContainer()?.nativeElement;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const fill =
          rect.top > window.innerHeight || rect.height <= 0
            ? 0
            : Math.min(Math.max((window.innerHeight - rect.top) / rect.height, 0), 1);
        if (Math.abs(fill - last) < 0.001 && !dirty) return;
        last = fill;
        bar.style.setProperty('--timeline-scale', String(fill));

        if (dirty) measure(container);
        const next = litFlags(fill, thresholds);
        next.forEach((on, i) => {
          if (on !== lit[i]) {
            lit[i] = on;
            nodes[i].classList.toggle('is-lit', on);
          }
        });
      };

      const onScroll = () => {
        if (!rafId) rafId = requestAnimationFrame(updateFill);
      };

      const resizeObserver =
        typeof ResizeObserver === 'undefined'
          ? undefined
          : new ResizeObserver(() => {
              dirty = true;
              onScroll();
            });
      const watched = this.timelineContainer()?.nativeElement;
      if (watched) resizeObserver?.observe(watched);

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        resizeObserver?.disconnect();
        if (rafId) cancelAnimationFrame(rafId);
      });
      onScroll(); // Initial check
    });
  }
}
