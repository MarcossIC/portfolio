import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-title',
  template: `
    <h2
      [id]="titleID"
      [ngClass]="className"
      class="title-section bg-ml-text-white bg-clip-text text-transparent"
      [title]="name"
    >
      <ng-content></ng-content>
    </h2>
    <h3 class="sub-title">{{ sub }}</h3>
  `,
  styleUrls: ['./title.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent {
  @Input({ required: true }) public name: string = '';
  @Input({ required: true }) public titleID: string = '';
  @Input() public sub: string = '';
  @Input() public className: string = '';

  constructor() {}
}
