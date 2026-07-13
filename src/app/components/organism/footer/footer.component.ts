import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LogoIconComponent } from '@icons/logo-icon.component';
import { CoffeeIconComponent } from '@app/components/icons/coffee/coffee-icon.component';
import { FOOTER } from '@constants/appConst';
import { I18nService } from '@app/services/i18n.service';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoIconComponent, CoffeeIconComponent],
})
export class FooterComponent {
  protected readonly i18nService = inject(I18nService);
  protected readonly FOOTER = computed(() => this.i18nService.getConstant('appConst')?.FOOTER || FOOTER);
}
