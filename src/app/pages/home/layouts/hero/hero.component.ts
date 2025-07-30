import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HeroSocialBarComponent } from '@organism/hero-social-bar/hero-social-bar.component';
import { ArrowDownComponent } from '@atoms/arrow-down/arrow-down.component';
import { USER } from '@constants/userConst';
import { I18nService } from '@app/services/i18n.service';

@Component({
  standalone: true,
  selector: 'hero-layout',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroSocialBarComponent, ArrowDownComponent],
})
export class HeroLayout {
  protected readonly i18nService = inject(I18nService);
  protected readonly USER = computed(() => this.i18nService.getConstant('userConst')?.USER || USER);
}
