import { CommonModule, NgClass, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  PLATFORM_ID,
  inject,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-tool-tip',
  template: `
    <div
      class="custom-tooltip chip-style absolute w-fit px-2 py-1 hidden invisible z-[60] pointer-events-none"
      [style.left.px]="x"
      [style.top.px]="y"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolTipComponent {
  @Input() x: number = 0;
  @Input() y: number = 0;
}
