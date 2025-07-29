import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { ABOUT_USER } from '@constants/userConst';
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
  protected readonly EXPERIENCE_TITLE = ABOUT_USER.experienceTitle;
  protected readonly EXPIRENCES = ABOUT_USER.experiences;
}
