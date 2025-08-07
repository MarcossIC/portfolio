import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LogoIconComponent } from '@icons/logo-icon.component';
import { CoffeeIconComponent } from '@app/components/icons/coffee/coffee-icon.component';
import { RouterLinkComponent } from '@atoms/router-link/router-link.component';
import { FOOTER } from '@constants/appConst';
import { I18nService } from '@app/services/i18n.service';
import { type NavigationConfig } from '@app/services/NavigationService.service';
import { SocialButtonComponent } from '@app/components/core/social-button/social-button.component';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LogoIconComponent,
    RouterLinkComponent,
    CoffeeIconComponent,
    SocialButtonComponent,
  ],
})
export class FooterComponent {
  protected readonly i18nService = inject(I18nService);
  protected readonly FOOTER = computed(() => this.i18nService.getConstant('appConst')?.FOOTER || FOOTER);

  /**
   * Configuración personalizada para la navegación del footer
   * Incluye un offset para compensar posibles headers fijos
   */
  protected readonly footerNavigationConfig: NavigationConfig = {
    duration: 1000, // Navegación un poco más lenta para mejor UX desde el footer
    offset: 20, // Pequeño offset para mejor posicionamiento visual
    fallbackBehavior: 'fallback'
  };
}
