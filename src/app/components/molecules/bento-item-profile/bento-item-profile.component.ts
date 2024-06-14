import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RectangleProfileComponent } from '@atoms/rectangle-profile/rectangle-profile.component';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { PulseElementComponent } from '@atoms/pulse-element/pulse-element.component';
import { DownloadIconComponent } from '@app/components/icons/download-icon.component';
import { AstronautIconComponent } from '@app/components/icons/astronaut-icon.component';
import { TextWithIconComponent } from '@app/components/atoms/text-with-icon/text-with-icon.component';
import { CountryIconComponent } from '@app/components/icons/country-icon.component';
import { GoodBoyIconComponent } from '@app/components/icons/good-boy-icon.component';
import { CoffeeIconComponent } from '@app/components/icons/coffee-icon.component';
import { GlobalIconComponent } from '@app/components/icons/global-icon.component';
import { EducationIconComponent } from '@app/components/icons/education-icon.component';
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
    TextWithIconComponent,
    CountryIconComponent,
    GoodBoyIconComponent,
    CoffeeIconComponent,
    GlobalIconComponent,
    EducationIconComponent,
  ],
})
export class BentoItemProfileComponent {
  protected readonly USER = USER;
  protected readonly PROFILE = ABOUT_USER.profile;
}
