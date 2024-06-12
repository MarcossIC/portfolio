import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [NgClass],
  selector: 'social-button',
  template: `
    <a
      [href]="socialUri"
      [title]="title"
      target="_blank"
      class="social-link relative group cursor-pointer"
    >
      <div
        class="text-center w-[30px] h-[30px] rounded-full icon"
        aria-hidden="true"
        role="img"
        [ngClass]="className"
      >
        <ng-content></ng-content>
      </div>
    </a>
  `,
  styleUrl: './social-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialButtonComponent {
  @Input() public socialUri = '';
  @Input() public title = '';
  @Input() public className = '';

  constructor() {}
}
