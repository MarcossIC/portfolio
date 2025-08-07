import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '@app/services/i18n.service';
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
  protected readonly i18nService = inject(I18nService);
  protected readonly STACK_TITLE = computed(() => this.i18nService.getConstant('userConst')?.ABOUT_USER?.stackTitle || ABOUT_USER.stackTitle);
}
