import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '@app/services/i18n.service';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { ABOUT_USER } from '@constants/userConst';

@Component({
  standalone: true,
  selector: 'bento-item-whoiam',
  templateUrl: './bento-item-whoiam.component.html',
  styleUrls: ['./bento-item-whoiam.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BentoItemComponent],
})
export class BentoItemWhoiamComponent {
  protected readonly i18nService = inject(I18nService);
  protected readonly WHOIAM_TITLE = computed(() => this.i18nService.getConstant('userConst')?.ABOUT_USER?.whoIamTitle as string);
  protected readonly DESCRIPTION = computed(() => this.i18nService.getConstant('userConst')?.ABOUT_USER?.whoIam as string);
}
