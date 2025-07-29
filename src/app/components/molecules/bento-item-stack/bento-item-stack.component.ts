import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { ABOUT_USER } from '@constants/userConst';

@Component({
  standalone: true,
  selector: 'bento-item-stack',
  templateUrl: './bento-item-stack.component.html',
  styleUrls: ['./bento-item-stack.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BentoItemComponent],
})
export class BentoItemStackComponent {
  protected readonly STACK_TITLE = ABOUT_USER.stackTitle;
}
