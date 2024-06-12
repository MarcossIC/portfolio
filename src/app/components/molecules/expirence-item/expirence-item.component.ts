import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { PlusNumberComponent } from '@atoms/plus-number/plus-number.component';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';

@Component({
  standalone: true,
  imports: [BentoItemComponent, PlusNumberComponent],
  selector: 'expirence-item',
  template: `
    <div class="flex flex-col mb-2 mt-1">
      <h3 class="font-manrope font-semibold text-[1.75rem] overflow-ellipsis">
        {{ title }}
      </h3>
      <h4 class="font-manrope font-medium text-[1.25rem] overflow-ellipsis">
        {{ sub }}
      </h4>
      <span class="mb-3 overflow-ellipsis">{{ date }}</span>
      <p class="pb-3"><ng-content></ng-content></p>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpirenceItemComponent implements OnInit {
  @Input({ required: true }) public title = '';
  @Input({ required: true }) public sub = '';
  @Input({ required: true }) public date = '';

  constructor() {}

  ngOnInit(): void {}
}
