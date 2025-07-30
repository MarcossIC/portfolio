import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UserExperience } from '@app/models/types';
import { I18nService } from '@app/services/i18n.service';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { ExpirenceItemComponent } from '@molecules/expirence-item/expirence-item.component';

@Component({
  standalone: true,
  selector: 'bento-item-expirence',
  templateUrl: './bento-item-expirence.component.html',
  styleUrls: ['./bento-item-expirence.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BentoItemComponent, ExpirenceItemComponent],
})
export class BentoItemExpirenceComponent {
  protected readonly i18nService = inject(I18nService);
  protected readonly EXPERIENCE_TITLE = computed(() => this.i18nService.getConstant('userConst')?.ABOUT_USER?.experienceTitle as string);
  protected readonly EXPIRENCES = computed(() => this.i18nService.getConstant('userConst')?.ABOUT_USER?.experiences as UserExperience[]);
}
