import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SkeletonVariant = 'text' | 'title' | 'image' | 'card' | 'field';

@Component({
  standalone: true,
  selector: 'app-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="skeleton"
      [class]="'skeleton skeleton-' + variant()"
      [style.width]="width()"
      [style.height]="height()"
      [style.border-radius]="borderRadius()"
    ></div>
  `,
  styles: `
    .skeleton {
      background: rgba(255, 255, 255, 0.06);
      position: relative;
      overflow: hidden;
    }

    .skeleton::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.06) 50%,
        transparent 100%
      );
      animation: shimmer 1.8s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton::after {
        animation: pulse-opacity 2s ease-in-out infinite;
      }
      @keyframes pulse-opacity {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.8; }
      }
    }

    .skeleton-text {
      height: 14px;
      border-radius: 6px;
    }
    .skeleton-title {
      height: 28px;
      border-radius: 8px;
    }
    .skeleton-image {
      border-radius: 0.5rem;
    }
    .skeleton-field {
      height: 52px;
      border-radius: 0.75rem;
    }
    .skeleton-card {
      border-radius: 15px;
    }
  `,
})
export class SkeletonComponent {
  public variant = input<SkeletonVariant>('text');
  public width = input<string>('100%');
  public height = input<string>('');
  public borderRadius = input<string>('');
}
