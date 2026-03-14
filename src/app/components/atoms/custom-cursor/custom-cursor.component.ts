import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReducedMotionService } from '@app/services/ReducedMotion.service';
import { I18nService } from '@app/services/i18n.service';

@Component({
  standalone: true,
  selector: 'custom-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        class="cursor-dot"
        [class.cursor-hover]="isHovering()"
        [class.cursor-project]="isOnProject()"
        [style.transform]="'translate(' + x() + 'px, ' + y() + 'px)'"
      >
        @if (isOnProject()) {
          <span class="cursor-label">{{ cursorLabel() }}</span>
        }
      </div>
    }
  `,
  styles: `
    :host {
      pointer-events: none;
      position: fixed;
      inset: 0;
      z-index: 9999;
    }

    .cursor-dot {
      position: fixed;
      top: -4px;
      left: -4px;
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      pointer-events: none;
      will-change: transform;
      transition: width 0.3s ease, height 0.3s ease, background 0.3s ease, margin 0.3s ease;
      mix-blend-mode: difference;
    }

    .cursor-hover {
      width: 40px;
      height: 40px;
      top: -20px;
      left: -20px;
      background: rgba(255, 255, 255, 0.15);
      border: 1.5px solid rgba(255, 255, 255, 0.5);
    }

    .cursor-project {
      width: 64px;
      height: 64px;
      top: -32px;
      left: -32px;
      background: rgba(139, 92, 246, 0.2);
      border: 1.5px solid rgba(139, 92, 246, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cursor-label {
      font-size: 0.65rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @media (pointer: coarse) {
      :host { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .cursor-dot { transition: none; }
    }
  `,
})
export class CustomCursorComponent {
  private readonly platform = inject(PLATFORM_ID);
  private readonly motionService = inject(ReducedMotionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18nService = inject(I18nService);

  protected readonly visible = signal(false);
  protected readonly x = signal(0);
  protected readonly y = signal(0);
  protected readonly isHovering = signal(false);
  protected readonly isOnProject = signal(false);
  protected readonly cursorLabel = computed(() =>
    this.i18nService.currentLanguage() === 'es' ? 'Ver' : 'View'
  );

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platform)) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;

      this.visible.set(true);
      document.documentElement.style.cursor = 'none';

      let rafId = 0;
      const onMove = (e: PointerEvent) => {
        // Position updates immediately for smooth tracking
        this.x.set(e.clientX);
        this.y.set(e.clientY);

        // Throttle expensive DOM queries to next frame
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const target = e.target as HTMLElement;
          const isProject = target.closest('.project-img, project-article, .project-card-container');
          const isLink = !isProject && target.closest('a, button, [role="button"]');

          this.isOnProject.set(!!isProject);
          this.isHovering.set(!!isLink);
        });
      };

      const onLeave = () => this.visible.set(false);
      const onEnter = () => this.visible.set(true);

      document.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      document.addEventListener('pointerenter', onEnter);
      this.destroyRef.onDestroy(() => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerleave', onLeave);
        document.removeEventListener('pointerenter', onEnter);
        document.documentElement.style.cursor = '';
      });
    });
  }
}
