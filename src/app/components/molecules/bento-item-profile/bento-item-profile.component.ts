import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RectangleProfileComponent } from '@atoms/rectangle-profile/rectangle-profile.component';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { PulseElementComponent } from '@atoms/pulse-element/pulse-element.component';
import { DownloadIconComponent } from '@app/components/icons/download/download-icon.component';
import { AstronautIconComponent } from '@app/components/icons/astronaut/astronaut-icon.component';
import { CountryIconComponent } from '@app/components/icons/country/country-icon.component';
import { GoodBoyIconComponent } from '@app/components/icons/goodboy/good-boy-icon.component';
import { CoffeeIconComponent } from '@app/components/icons/coffee/coffee-icon.component';
import { GlobalIconComponent } from '@app/components/icons/global/global-icon.component';
import { EducationIconComponent } from '@app/components/icons/education/education-icon.component';
import { I18nService } from '@app/services/i18n.service';
import { ABOUT_USER, USER } from '@constants/userConst';

@Component({
  standalone: true,
  selector: 'bento-item-profile',
  templateUrl: './bento-item-profile.component.html',
  styleUrls: ['./bento-item-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BentoItemComponent,
    RectangleProfileComponent,
    PulseElementComponent,
    DownloadIconComponent,
    AstronautIconComponent,
    CountryIconComponent,
    GoodBoyIconComponent,
    CoffeeIconComponent,
    GlobalIconComponent,
    EducationIconComponent,
  ],
})
export class BentoItemProfileComponent {
  protected readonly i18nService = inject(I18nService);
  protected readonly USER = computed(() => this.i18nService.getConstant('userConst')?.USER || USER);
  protected readonly PROFILE = computed(() => this.i18nService.getConstant('userConst')?.ABOUT_USER?.profile || ABOUT_USER.profile);
  protected readonly PHOTO = ABOUT_USER.profile.photo;
}
