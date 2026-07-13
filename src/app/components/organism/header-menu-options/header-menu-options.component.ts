import { ChangeDetectionStrategy, Component, inject, computed, input } from '@angular/core';
import { I18nService } from '@app/services/i18n.service';
import type { Language } from '@app/models/i18n.model';
import { USER } from '@constants/userConst';
import { ButtonPrimaryComponent } from '@atoms/button-primary/button-primary.component';
import { AtmosphereToggleComponent } from '@atoms/atmosphere-toggle/atmosphere-toggle.component';

@Component({
  standalone: true,
  selector: 'header-menu-options',
  templateUrl: './header-menu-options.component.html',
  styleUrls: ['./header-menu-options.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonPrimaryComponent, AtmosphereToggleComponent],
})
export class HeaderMenuOptionsComponent {
  /** 'desktop' shows the atmosphere icon inline; 'mobile' omits it (the dropdown renders the compact row). */
  public readonly context = input<'desktop' | 'mobile'>('desktop');

  private readonly i18nService = inject(I18nService);

  protected readonly isLoadingLanguage = computed(() => this.i18nService.isLoading());
  protected readonly USER = computed(() => this.i18nService.getConstant('userConst')?.USER || USER);

  get currentLanguage(): Language {
    return this.i18nService.currentLanguageObject();
  }

  protected async quickToggleLanguage(): Promise<void> {
    if (this.isLoadingLanguage()) return;
    try {
      await this.i18nService.toggleLanguage();
    } catch (error) {
      console.error('Error toggling language:', error);
    }
  }
}
