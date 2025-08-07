import { NgClass, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavigationService, type NavigationConfig } from '@app/services/NavigationService.service';

@Component({
  standalone: true,
  selector: 'router-link',
  template: ` <a
    [ngClass]="classNames()"
    [attr.aria-hidden]="true"
    (click)="navigate()"
    role="link"
    class="relative group cursor-pointer outline-none focus:outline-none focus-within:outline-none"
  >
    <ng-content></ng-content>
  </a>`,
  styleUrl: './router-link.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterModule],
})
export class RouterLinkComponent {
  public path = input<string>();
  public fragment = input<string>('');
  public classNames = input<string>('');

  /**
   * Configuración opcional para la navegación suave
   * Permite personalizar duración, offset, etc.
   */
  public navigationConfig = input<NavigationConfig>();

  /**
   * Si está habilitada la navegación suave
   * Default: true (usa NavigationService)
   * false: usa el comportamiento nativo (ViewportScroller)
   */
  public smoothNavigation = input<boolean>(true);

  private readonly router: Router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly navigationService = inject(NavigationService);

  protected async navigate(): Promise<void> {
    const fragment = this.fragment();

    if (!fragment) {
      console.warn('RouterLinkComponent: No se proporcionó un fragment para navegar');
      return;
    }

    // Si hay un path específico, navegar primero a esa ruta
    const path = this.path();
    if (path && path !== '' && path !== '/') {
      await this.router.navigate([path]);
    }

    // Decidir qué tipo de navegación usar
    if (this.smoothNavigation()) {
      await this.navigateWithSmoothScroll(fragment);
    } else {
      this.navigateWithNativeScroll(fragment);
    }
  }

  /**
   * Navega usando el NavigationService para scroll suave
   */
  private async navigateWithSmoothScroll(fragment: string): Promise<void> {
    try {
      const config = this.navigationConfig();
      await this.navigationService.navigateToSection(fragment, config);
    } catch (error) {
      console.error('RouterLinkComponent: Error en navegación suave, usando fallback:', error);
      this.navigateWithNativeScroll(fragment);
    }
  }

  /**
   * Navega usando el ViewportScroller nativo
   */
  private navigateWithNativeScroll(fragment: string): void {
    this.viewportScroller.scrollToAnchor(fragment);
  }
}
