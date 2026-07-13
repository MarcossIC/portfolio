import { ChangeDetectionStrategy, Component, computed, inject, signal, afterNextRender, DestroyRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HEADER } from '@constants/appConst';
import type { Header } from '@app/models/types';
import { NavigateComponent } from '../../molecules/navigate/navigate.component';
import { HeaderMenuOptionsComponent } from '@app/components/organism/header-menu-options/header-menu-options.component';
import { AtmosphereToggleComponent } from '@atoms/atmosphere-toggle/atmosphere-toggle.component';
import { I18nService } from '@app/services/i18n.service';
import { ScrollProgressService } from '@app/services/ScrollProgressService.service';
import { ActiveSectionService } from '@app/services/active-section.service';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavigateComponent,
    HeaderMenuOptionsComponent,
    AtmosphereToggleComponent,
  ],
})
export class HeaderComponent {
  private readonly scrollService = inject(ScrollProgressService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18nService = inject(I18nService);
  protected readonly activeSection = inject(ActiveSectionService);
  protected readonly NAVIGATIONS = computed(() => this.i18nService.getConstant('appConst')?.HEADER || HEADER);

  protected readonly scrolled = signal(false);
  protected readonly mobileOpen = signal(false);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const onScroll = () => this.scrolled.set(window.scrollY > 50);
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
      onScroll();

      // 'hero' se rastrea aunque no esté en el pill: estando en el hero, ningún
      // link se pinta (los 4 del nav son career/about-me/projects/contact).
      this.activeSection.track(['hero', ...this.NAVIGATIONS().map((n: Header) => n.FRAGMENT)]);
    });
  }

  protected scrollToTop() {
    this.scrollService.scrollTo(0);
  }

  protected toggleMobile() {
    this.mobileOpen.update(v => !v);
  }

  protected closeMobile() {
    this.mobileOpen.set(false);
  }
}
