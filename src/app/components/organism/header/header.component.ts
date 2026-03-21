import { ChangeDetectionStrategy, Component, computed, inject, signal, afterNextRender, DestroyRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HEADER } from '@constants/appConst';
import { NavigateComponent } from '../../molecules/navigate/navigate.component';
import { HeaderMenuOptionsComponent } from '@app/components/organism/header-menu-options/header-menu-options.component';
import { I18nService } from '@app/services/i18n.service';
import { ScrollProgressService } from '@app/services/ScrollProgressService.service';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavigateComponent,
    HeaderMenuOptionsComponent,
  ],
})
export class HeaderComponent {
  private readonly scrollService = inject(ScrollProgressService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18nService = inject(I18nService);
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
