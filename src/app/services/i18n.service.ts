import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Language, LocalizedConstants, SupportedLanguage, ConstantType } from '@app/models/i18n.model';
import { defaultCountries } from '../../constants/countries';
import { constants } from '@constants/index';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private platformId = inject(PLATFORM_ID);

  // Idiomas soportados
  public readonly SUPPORTED_LANGUAGES: Language[] = [
    {
      code: 'es',
      name: 'Español',
      flag: '🇪🇸'
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇺🇸'
    }
  ];

  // Estado reactivo del idioma actual
  private readonly _currentLanguage = signal<SupportedLanguage>('es');
  private readonly _constants = signal<LocalizedConstants | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Getters públicos (readonly)
  public readonly currentLanguage = this._currentLanguage.asReadonly();
  public readonly constants = this._constants.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly openLanguageSelector = signal(false);

  // Computed para obtener el idioma actual como objeto
  public readonly currentLanguageObject = computed(() => {
    const currentCode = this._currentLanguage();
    return this.SUPPORTED_LANGUAGES.find(lang => lang.code === currentCode) || this.SUPPORTED_LANGUAGES[0];
  });

  // Computed para verificar si las constantes están disponibles
  public readonly hasConstants = computed(() => this._constants() !== null);

  /**
   * Carga las constantes del idioma por defecto (español) sin detección geolocalizada.
   * Seguro para SSR y browser. Debe llamarse antes de initializeLanguage().
   */
  public loadDefaultLanguage(): void {
    if (this._constants()) return;

    const savedLanguage = this.getSavedLanguage();
    const language = (savedLanguage && this.isValidLanguage(savedLanguage)) ? savedLanguage : 'es';

    const constants = this.loadLanguageConstantsSync(language);
    if (constants) {
      this._currentLanguage.set(language);
      this._constants.set(constants);
    }
  }

  /**
   * Inicializa el idioma basándose en la preferencia guardada o detección geolocalizada.
   * Debe ejecutarse solo en el browser (dentro de afterNextRender).
   */
  public async initializeLanguage(): Promise<void> {
    const savedLanguage = this.getSavedLanguage();

    if (savedLanguage && this.isValidLanguage(savedLanguage)) {
      await this.setLanguage(savedLanguage);
      return;
    }

    // Detectar basado en la ubicación (solo browser)
    const detectedLanguage = await this.detectLanguageByLocation();
    await this.setLanguage(detectedLanguage);
  }

  /**
   * Cambia el idioma actual y carga las constantes correspondientes
   */
  public async setLanguage(language: SupportedLanguage): Promise<void> {
    if (!this.isValidLanguage(language)) {
      console.warn(`Idioma no soportado: ${language}. Usando español por defecto.`);
      language = 'es';
    }

    if (this._currentLanguage() === language && this._constants()) {
      return; // Ya está cargado este idioma
    }

    this._isLoading.set(true);
    this._error.set(null);

    try {
      const constants = await this.loadLanguageConstants(language);

      this._currentLanguage.set(language);
      this._constants.set(constants);
      this.saveLanguage(language);

    } catch (error) {
      console.error('Error al cargar las constantes del idioma:', error);
      this._error.set(`Error al cargar el idioma ${language}`);

      // Fallback a constantes por defecto
      await this.loadDefaultConstants();
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Detecta el idioma basado en la ubicación del usuario
   */
  private async detectLanguageByLocation(): Promise<SupportedLanguage> {
    try {
      const locationData = await this.fetchLocationData();
      if (locationData?.country) {
        const detectedLanguage = this.getLanguageFromCountryCode(locationData.country);
        return detectedLanguage;
      }
    } catch (error) {
      console.warn('Error al detectar idioma por ubicación:', error);
    }

    // Fallback a inglés si no se puede detectar
    return 'en';
  }

  /**
   * Hace fetch a la API de ipinfo.io para obtener datos de ubicación
   */
  private async fetchLocationData(): Promise<{ country?: string } | null> {
    try {
      const response = await fetch('https://ipinfo.io/json?token=6378a34c5dd63c');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Error al obtener datos de ubicación:', error);
      return null;
    }
  }

  /**
   * Obtiene el idioma soportado basado en el código de país
   */
  private getLanguageFromCountryCode(countryCode: string): SupportedLanguage {
    try {
      // Buscar el país en el array de países
      const country = defaultCountries.find(c => c.alpha2Code === countryCode);

      if (!country || !('lang' in country) || !country.lang || country.lang.length === 0) {
        return 'en';
      }
      const supportedLanguages: SupportedLanguage[] = ['es', 'en'];
      const countryLanguages = Array.isArray(country.lang) ? country.lang : [country.lang];

      for (const lang of countryLanguages) {
        if (supportedLanguages.includes(lang as SupportedLanguage)) {
          return lang as SupportedLanguage;
        }
      }

      // Si no hay coincidencias, usar inglés por defecto
      return 'en';
    } catch (error) {
      console.warn('Error al procesar código de país:', error);
      return 'en';
    }
  }

  /**
   * Carga las constantes de forma síncrona (sin fetch externo)
   */
  private loadLanguageConstantsSync(language: SupportedLanguage): LocalizedConstants | null {
    try {
      const userConst = this.importConstant(language, 'userConst');
      const appConst = this.importConstant(language, 'appConst');
      const technologiesConst = this.importConstant(language, 'technologiesConst');
      return { userConst, appConst, technologiesConst };
    } catch {
      return null;
    }
  }

  /**
   * Carga las constantes para un idioma específico
   */
  private async loadLanguageConstants(language: SupportedLanguage): Promise<LocalizedConstants> {
    try {
      // Intentar cargar desde la carpeta específica del idioma
      const [userConst, appConst, technologiesConst]: any[] = [
        this.importConstant(language, 'userConst'),
        this.importConstant(language, 'appConst'),
        this.importConstant(language, 'technologiesConst')
      ]
      return {
        userConst,
        appConst,
        technologiesConst
      };
    } catch (error) {
      console.warn(`No se pudieron cargar las constantes para ${language}, intentando con constantes por defecto`);
      throw error;
    }
  }

  /**
   * Importa una constante específica para un idioma
   */
  private importConstant(language: SupportedLanguage, constantType: ConstantType) {
    try {
      const moduleLoader = constants[language]?.[constantType];
      if (!moduleLoader) {
        throw new Error(`No se encontró ${constantType} para ${language}`);
      }
      return moduleLoader;
    } catch (error) {
      console.warn(`No se pudo cargar ${constantType} para ${language}`);
      throw error;
    }
  }

  /**
   * Carga las constantes por defecto (fallback)
   */
  private async loadDefaultConstants(): Promise<void> {
    try {
      const [userConst, appConst, technologiesConst]: any[] = [
        this.importConstant('en', 'userConst'),
        this.importConstant('en', 'appConst'),
        this.importConstant('en', 'technologiesConst')
      ]

      this._constants.set({
        userConst,
        appConst,
        technologiesConst
      });

      console.info('Constantes por defecto cargadas exitosamente');
    } catch (error) {
      console.error('Error crítico: No se pudieron cargar las constantes por defecto', error);
      this._error.set('Error crítico al cargar las constantes');
    }
  }

  /**
   * Obtiene una constante específica del idioma actual
   */
  public getConstant<T = any>(constantType: ConstantType, propertyName?: string): T | null {
    const constants = this._constants();
    if (!constants || !constants[constantType]) {
      return null;
    }

    const constantModule = constants[constantType];

    if (propertyName) {
      return constantModule[propertyName] || null;
    }

    return constantModule;
  }

  /**
   * Verifica si un idioma es válido
   */
  private isValidLanguage(language: any): language is SupportedLanguage {
    return typeof language === 'string' &&
           this.SUPPORTED_LANGUAGES.some(lang => lang.code === language);
  }

  /**
   * Guarda el idioma en localStorage
   */
  private saveLanguage(language: SupportedLanguage): void {
    try {
      this.setLocalStorage('preferred-language', language);
    } catch (error) {
      console.warn('No se pudo guardar el idioma en localStorage:', error);
    }
  }

  /**
   * Obtiene el idioma guardado de localStorage
   */
  private getSavedLanguage(): string | null {
    try {
      return this.getLocalStorage('preferred-language');
    } catch (error) {
      console.warn('No se pudo acceder a localStorage:', error);
      return null;
    }
  }

  /**
   * Alterna entre idiomas disponibles
   */
  public toggleLanguage(): Promise<void> {
    const currentLang = this._currentLanguage();
    const nextLang: SupportedLanguage = currentLang === 'es' ? 'en' : 'es';
    return this.setLanguage(nextLang);
  }

  public toggleOpenSelector(): void {
    this.openLanguageSelector.update(prev => !prev);
  }

  /**
   * Obtiene el siguiente idioma sin cambiar el actual
   */
  public getNextLanguage(): Language {
    const currentLang = this._currentLanguage();
    const nextLangCode: SupportedLanguage = currentLang === 'es' ? 'en' : 'es';
    return this.SUPPORTED_LANGUAGES.find(lang => lang.code === nextLangCode) || this.SUPPORTED_LANGUAGES[0];
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  private setLocalStorage(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }
  private getLocalStorage(key: string): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(key);
    }
    return null;
  }
}
