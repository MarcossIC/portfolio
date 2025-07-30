import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PlusNumberComponent } from '@atoms/plus-number/plus-number.component';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { I18nService } from '@app/services/i18n.service';
import { ABOUT_USER } from '@constants/userConst';

@Component({
  standalone: true,
  selector: 'bento-item-expertice',
  templateUrl: './bento-item-expertice.component.html',
  styleUrls: ['./bento-item-expertice.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BentoItemComponent, PlusNumberComponent],
})
export class BentoItemExperticeComponent {
  protected readonly i18nService = inject(I18nService);
  protected readonly ABOUT_USER = computed(() => this.i18nService.getConstant('userConst')?.ABOUT_USER || ABOUT_USER);
}
