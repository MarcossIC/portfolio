import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SocialButtonComponent } from '@app/components/core/social-button/social-button.component';
import { I18nService } from '@app/services/i18n.service';
import { USER } from '@constants/userConst';

@Component({
  standalone: true,
  selector: 'hero-social-bar',
  templateUrl: './hero-social-bar.component.html',
  styleUrls: ['./hero-social-bar.component.css'],
  imports: [CommonModule, SocialButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSocialBarComponent {
  protected readonly i18nService = inject(I18nService);
  protected readonly USER_SOCIALS = computed(() => this.i18nService.getConstant('userConst')?.USER || USER);

  protected get mailTo() {
    return `mailto:${this.USER_SOCIALS().email}?subject=Hey%20${this.USER_SOCIALS().name}%20how%20are%20you`;
  }
}
