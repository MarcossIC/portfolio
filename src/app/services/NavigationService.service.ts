import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ScrollProgressService } from './ScrollProgressService.service';

/**
 * Configuración para la navegación suave
 */
export interface NavigationConfig {
  /**
   * Duración de la animación en milisegundos
   * Default: 800ms
   */
  duration?: number;

  /**
   * Offset adicional desde la parte superior del elemento
   * Útil para headers fijos o espaciado adicional
   * Default: 0
   */
  offset?: number;

  /**
   * Comportamiento al fallar la navegación
   * - 'fallback': Usa el comportamiento nativo del navegador
   * - 'none': No hace nada
   * Default: 'fallback'
   */
  fallbackBehavior?: 'fallback' | 'none';
}

/**
 * Información de una sección para navegación
 */
export interface SectionInfo {
  id: string;
  element: HTMLElement;
  offsetTop: number;
  height: number;
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly document = inject(DOCUMENT);
  private readonly scrollService = inject(ScrollProgressService);

  private readonly defaultConfig: Required<NavigationConfig> = {
    duration: 800,
    offset: 0,
    fallbackBehavior: 'fallback'
  };

  /**
   * Navega suavemente a una sección por su ID
   * @param sectionId - ID del elemento al que navegar (sin #)
   * @param config - Configuración opcional para la navegación
   * @returns Promise que se resuelve cuando la navegación termina
   */
  async navigateToSection(
    sectionId: string,
    config: NavigationConfig = {}
  ): Promise<void> {
    if (!sectionId) {
      console.warn('NavigationService: No se proporcionó un sectionId');
      return;
    }

    const finalConfig = { ...this.defaultConfig, ...config };

    try {
      const sectionInfo = this.getSectionInfo(sectionId);

      if (!sectionInfo) {
        this.handleNavigationFallback(sectionId, finalConfig.fallbackBehavior);
        return;
      }

      const targetPosition = Math.max(0, sectionInfo.offsetTop - finalConfig.offset);

      await this.scrollService.scrollTo(targetPosition, finalConfig.duration);

      // Actualizar el focus para accesibilidad
      this.setFocusToSection(sectionInfo.element);

    } catch (error) {
      console.error('NavigationService: Error durante la navegación:', error);
      this.handleNavigationFallback(sectionId, finalConfig.fallbackBehavior);
    }
  }

  /**
   * Obtiene la información de una sección por su ID
   * @param sectionId - ID del elemento
   * @returns Información de la sección o null si no se encuentra
   */
  getSectionInfo(sectionId: string): SectionInfo | null {
    const element = this.document.getElementById(sectionId);

    if (!element) {
      console.warn(`NavigationService: No se encontró el elemento con ID "${sectionId}"`);
      return null;
    }

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || this.document.documentElement.scrollTop;

    return {
      id: sectionId,
      element,
      offsetTop: rect.top + scrollTop,
      height: rect.height
    };
  }

  /**
   * Obtiene información de múltiples secciones
   * @param sectionIds - Array de IDs de secciones
   * @returns Array de información de secciones (excluyendo las no encontradas)
   */
  getMultipleSectionsInfo(sectionIds: string[]): SectionInfo[] {
    return sectionIds
      .map(id => this.getSectionInfo(id))
      .filter((info): info is SectionInfo => info !== null);
  }

  /**
   * Verifica si una sección existe en el DOM
   * @param sectionId - ID del elemento a verificar
   * @returns true si la sección existe, false en caso contrario
   */
  sectionExists(sectionId: string): boolean {
    return !!this.document.getElementById(sectionId);
  }

  /**
   * Obtiene la posición actual del scroll como porcentaje
   * @returns Observable con el progreso del scroll (0-1)
   */
  getScrollProgress() {
    return this.scrollService.getScrollYProgress();
  }

  /**
   * Obtiene la posición actual del scroll suavizada
   * @returns Observable con el progreso suavizado del scroll (0-1)
   */
  getSmoothScrollProgress() {
    return this.scrollService.getSmoothScrollProgress();
  }

  /**
   * Maneja el comportamiento de fallback cuando falla la navegación
   */
  private handleNavigationFallback(
    sectionId: string,
    fallbackBehavior: 'fallback' | 'none'
  ): void {
    if (fallbackBehavior === 'fallback') {
      // Usar el comportamiento nativo del navegador como fallback
      const element = this.document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Si no existe el elemento, intentar con hash navigation
        window.location.hash = sectionId;
      }
    }
  }

  /**
   * Establece el focus en la sección para mejorar la accesibilidad
   */
  private setFocusToSection(element: HTMLElement): void {
    // Solo establecer focus si el elemento no es naturalmente focuseable
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '-1');
    }

    // Establecer focus con un pequeño delay para asegurar que el scroll haya terminado
    setTimeout(() => {
      element.focus({ preventScroll: true });
    }, 50);
  }

  /**
   * Utilidad para calcular el offset necesario para headers fijos
   * @param headerSelector - Selector CSS del header fijo
   * @returns Altura del header o 0 si no se encuentra
   */
  calculateHeaderOffset(headerSelector: string = 'header'): number {
    const header = this.document.querySelector(headerSelector) as HTMLElement;
    return header ? header.offsetHeight : 0;
  }

  /**
   * Pre-calcula las posiciones de múltiples secciones para optimizar rendimiento
   * Útil cuando se necesita navegar frecuentemente entre secciones
   * @param sectionIds - Array de IDs de secciones a pre-calcular
   * @returns Map con las posiciones pre-calculadas
   */
  preCalculateSectionPositions(sectionIds: string[]): Map<string, number> {
    const positions = new Map<string, number>();

    sectionIds.forEach(id => {
      const sectionInfo = this.getSectionInfo(id);
      if (sectionInfo) {
        positions.set(id, sectionInfo.offsetTop);
      }
    });

    return positions;
  }
}
