import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgClass],
  selector: 'text-with-icon',
  template: `
    <span
      class="text-[.975rem] font-medium inline-flex justify-center items-center gap-x-3 text-nowrap"
      [ngClass]="addSpace ? 'pl-[.25rem]' : ''"
      ><ng-content></ng-content> {{ text }}</span
    >
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextWithIconComponent {
  @Input() public addSpace = false;
  @Input() public text = 'lazy';
}
