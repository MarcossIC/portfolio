import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BentoComponent } from '@organism/bento/bento.component';
import { TitleComponent } from '@atoms/title/title.component';
import { I18nService } from '@app/services/i18n.service';
import { ABOUT_TITLE } from '@constants/appConst';

@Component({
  standalone: true,
  selector: 'bento-about-layout',
  templateUrl: './bento-about.component.html',
  styleUrl: './bento-about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleComponent, BentoComponent],
})
export class BentoAboutLayout {
  protected readonly i18nService = inject(I18nService);
  protected readonly ABOUT_TITLE = computed(() => this.i18nService.getConstant('appConst')?.ABOUT_TITLE || ABOUT_TITLE);
  protected readonly titleID: string = 'bento-about-tt';
}
