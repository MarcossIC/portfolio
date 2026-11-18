import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ScrollProgressService } from './ScrollProgressService.service';

/**
 * Configuración para la navegación suave
 */
export interface NavigationConfig {
  /**
   * Duración de la animación en milisegundos
   * Default: escala con la distancia (450-1000ms)
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

  /**
   * Reflejar `#id` en la URL con history.replaceState (sin navegación del router)
   * Default: true
   */
  updateHash?: boolean;
}

/** Secciones válidas como deep link (`/#contact`). */
export const SECTION_IDS: readonly string[] = ['hero', 'career', 'about-me', 'projects', 'contact'];

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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly defaultConfig: Omit<Required<NavigationConfig>, 'duration'> & Pick<NavigationConfig, 'duration'> = {
    offset: 100,
    fallbackBehavior: 'fallback',
    updateHash: true
  };

  /**
   * Deep link en la carga inicial: si el hash apunta a una sección conocida,
   * salta ahí al instante (duration 0) y mueve el focus. No toca la URL.
   * @returns true si había una sección a la que ir
   */
  async scrollToHash(hash: string = this.isBrowser ? window.location.hash : ''): Promise<boolean> {
    if (!this.isBrowser) return false;
    const id = decodeURIComponent(hash.replace(/^#/, ''));
    if (!SECTION_IDS.includes(id) || !this.sectionExists(id)) return false;
    const offset = this.defaultConfig.offset;
    await this.navigateToSection(id, { duration: 0, updateHash: false, offset });
    await this.settle(id, offset);
    return true;
  }

  /**
   * Tras el salto inicial el layout todavía se mueve: el skeleton de un @defer
   * es reemplazado por la sección real (alturas distintas) y entran imágenes.
   * Durante una ventana corta re-alineamos si el target derivó o fue reemplazado,
   * y re-enfocamos al elemento nuevo. Se detiene apenas el usuario toma el control.
   */
  private settle(id: string, offset: number, windowMs = 2000): Promise<void> {
    return new Promise((resolve) => {
      const userEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const;
      let rafId = 0;
      let last = this.document.getElementById(id);
      const start = performance.now();
      const stop = () => {
        cancelAnimationFrame(rafId);
        for (const e of userEvents) window.removeEventListener(e, stop);
        resolve();
      };
      for (const e of userEvents) window.addEventListener(e, stop, { passive: true, once: true });
      const tick = (now: number) => {
        const el = this.document.getElementById(id);
        if (el) {
          const swapped = el !== last;
          if (swapped || Math.abs(el.getBoundingClientRect().top - offset) > 1.5) {
            void this.scrollService.scrollToElement(el, offset, 0);
          }
          if (swapped) this.setFocusToSection(el);
          last = el;
        }
        if (now - start >= windowMs) stop();
        else rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    });
  }

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

      if(sectionInfo.element){
      // Seguimos al elemento VIVO durante toda la animación: si projects (defer)
      // o las imágenes de arriba reflowan mientras scrolleamos, el target se
      // recalcula frame a frame y converge a la posición real de la sección.
      await this.scrollService.scrollToElement(
        sectionInfo.element,
        finalConfig.offset,
        finalConfig.duration
      );
      } else {
        const targetPosition = Math.max(0, sectionInfo.offsetTop - finalConfig.offset);
        await this.scrollService.scrollTo(targetPosition, finalConfig.duration);
      }

      if (finalConfig.updateHash && this.isBrowser && window.location.hash !== `#${sectionId}`) {
        // replaceState no dispara popstate/hashchange: el router ni se entera
        // (y se conserva history.state, donde Angular guarda su navigationId).
        window.history.replaceState(window.history.state, '', `#${sectionId}`);
      }

      // Actualizar el focus para accesibilidad
      this.setFocusToSection(this.document.getElementById(sectionId) ?? sectionInfo.element);

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
    if (!this.isBrowser) return null;
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
        if (this.isBrowser) window.location.hash = sectionId;
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
