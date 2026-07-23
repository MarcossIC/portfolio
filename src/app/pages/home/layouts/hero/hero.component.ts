import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { HeroSocialBarComponent } from '@organism/hero-social-bar/hero-social-bar.component';
import { USER } from '@constants/userConst';
import { I18nService } from '@app/services/i18n.service';
import { NavigationService } from '@app/services/NavigationService.service';
import { ButtonPrimaryComponent } from '@app/components/atoms/button-primary/button-primary.component';

@Component({
  standalone: true,
  selector: 'hero-layout',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroSocialBarComponent, ButtonPrimaryComponent],
})
export class HeroLayout {
  protected readonly i18nService = inject(I18nService);
  protected readonly USER = computed(() => this.i18nService.getConstant('userConst')?.USER || USER);
  private readonly navigationService = inject(NavigationService);

  protected scrollToContact() {
    this.navigationService.navigateToSection('contact');
  }

  protected scrollToProjects() {
    this.navigationService.navigateToSection('projects');
  }
}
