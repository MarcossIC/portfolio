import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CustomLink } from '@app/components/atoms/link/custom-link.component';

@Component({
  standalone: true,
  imports: [NgClass, CustomLink],
  selector: 'social-button',
  template: `
    <custom-link [path]="socialUri" [title]="title" classNames="social-link">
      <div
        class="text-center w-[30px] h-[30px] rounded-full icon"
        aria-hidden="true"
        role="img"
        [ngClass]="className"
      >
        <ng-content></ng-content>
      </div>
    </custom-link>
  `,
  styleUrl: './social-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialButtonComponent {
  @Input() public socialUri = '';
  @Input() public title = '';
  @Input() public className = '';
}
