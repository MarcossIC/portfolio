import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'plus-number',
  template: `
    <div
      class="highlight-text text-[5rem] text-center bg-clip-text text-transparent"
    >
      {{ number }}<span class="pus-icon">+</span>
    </div>
  `,
  styles: [
    `
      .pus-icon {
        font-size: 3rem;
        line-height: 8rem;
        vertical-align: bottom;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusNumberComponent implements OnInit {
  @Input({ required: true }) public number: string = '';

  constructor() {}

  ngOnInit(): void {}
}
