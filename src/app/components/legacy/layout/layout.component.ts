
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'layout-bg',
  standalone: true,
  imports: [],
  template: `<div
    class="min-w-[100dvw] min-h-[100dvh] bg-ml-bg-purple bg-fixed bg-center bg-cover overflow-x-hidden"
  >
    <ng-content></ng-content>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
