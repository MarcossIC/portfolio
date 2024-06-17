import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'plus-number',
  template: `
    <div
      class="highlight-text text-[5rem] text-center bg-clip-text text-transparent"
    >
      <span class="pus-icon">+</span>{{ number }}
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
  imports: [],
})
export class PlusNumberComponent {
  @Input({ required: true }) public number: string = '';
}
