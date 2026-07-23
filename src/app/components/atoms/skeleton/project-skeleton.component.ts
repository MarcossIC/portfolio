import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';

@Component({
  standalone: true,
  selector: 'project-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonComponent],
  template: `
    <div class="skeleton-container">
      @for (i of [1, 2, 3, 4]; track i) {
        <div class="skeleton-card">
          <app-skeleton variant="card" width="100%" height="470px" />
          <div class="skeleton-card-text">
            <app-skeleton variant="title" width="60%" />
            <app-skeleton variant="text" width="90%" />
            <app-skeleton variant="text" width="75%" />
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .skeleton-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .skeleton-card {
      width: 100%;
      max-width: 533px;
    }
    .skeleton-card-text {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 1rem;
    }
    @media (min-width: 1200px) {
      .skeleton-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px 40px;
        width: 1128px;
      }
      .skeleton-card:nth-child(2) {
        margin-top: 14rem;
      }
      .skeleton-card:nth-child(3) {
        margin-top: -16rem;
      }
    }
  `,
})
export class ProjectSkeletonComponent {}
