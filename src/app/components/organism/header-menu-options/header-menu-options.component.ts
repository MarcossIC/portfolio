import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, inject, computed } from '@angular/core';
import { ResumeButtonNewComponent } from '@app/components/molecules/resume-button-new/resume-button.component';
import { I18nService } from '@app/services/i18n.service';
import type { Language, SupportedLanguage } from '@app/models/i18n.model';

@Component({
  standalone: true,
  selector: 'header-menu-options',
  templateUrl: './header-menu-options.component.html',
  styleUrls: ['./header-menu-options.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResumeButtonNewComponent, NgClass]
})
export class HeaderMenuOptionsComponent {
  private readonly i18nService = inject(I18nService);

  // Estado del dropdown

  // Propiedades reactivas del servicio de i18n
  protected readonly supportedLanguages = this.i18nService.SUPPORTED_LANGUAGES;
  protected readonly isLoadingLanguage = computed(() => this.i18nService.isLoading());
  protected readonly isOpenSelector = computed(() => this.i18nService.openLanguageSelector());

  /**
   * Maneja el cambio de idioma
   */
  async handleLanguageChange(language: Language): Promise<void> {
    if (this.isLoadingLanguage()) {
      return; // Evitar cambios concurrentes
    }

    try {
      await this.i18nService.setLanguage(language.code as SupportedLanguage);
      this.toggleLanguageSelector(); // Cerrar el dropdown tras el cambio
    } catch (error) {
      console.error('Error al cambiar idioma:', error);
      // Aquí podrías mostrar un toast de error si tienes un servicio de notificaciones
    }
  }

  /**
   * Alterna la visibilidad del selector de idioma
   */
  protected toggleLanguageSelector(): void {
    this.i18nService.toggleOpenSelector();
  }

  /**
   * Verifica si un idioma está seleccionado actualmente
   */
  isSelectedLang(language: Language): boolean {
    return this.i18nService.currentLanguage() === language.code;
  }

  /**
   * Alterna rápidamente entre idiomas (para acceso directo)
   */
  protected async quickToggleLanguage(): Promise<void> {
    if (this.isLoadingLanguage()) {
      return;
    }

    try {
      await this.i18nService.toggleLanguage();
    } catch (error) {
      console.error('Error al alternar idioma:', error);
    }
  }

  get currentLanguage(): Language {
    return this.i18nService.currentLanguageObject();
  }
}
