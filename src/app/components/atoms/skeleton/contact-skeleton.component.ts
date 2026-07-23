import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';

@Component({
  standalone: true,
  selector: 'contact-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonComponent],
  template: `
    <div class="skeleton-contact">
      <div class="skeleton-form">
        <app-skeleton variant="title" width="200px" />
        <app-skeleton variant="field" width="100%" />
        <app-skeleton variant="field" width="100%" />
        <app-skeleton variant="field" width="100%" height="160px" />
        <app-skeleton variant="card" width="200px" height="50px" borderRadius="0.75rem" />
      </div>
    </div>
  `,
  styles: `
    .skeleton-contact {
      display: flex;
      justify-content: center;
      padding: 2rem;
      min-height: 500px;
    }
    .skeleton-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 100%;
      max-width: 450px;
    }
  `,
})
export class ContactSkeletonComponent {}
