import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, signal, afterNextRender, afterRenderEffect, DestroyRef, PLATFORM_ID, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HEADER, HEADER_UI } from '@constants/appConst';
import type { Header } from '@app/models/types';
import { NavigateComponent } from '../../molecules/navigate/navigate.component';
import { HeaderMenuOptionsComponent } from '@app/components/organism/header-menu-options/header-menu-options.component';
import { AtmosphereToggleComponent } from '@atoms/atmosphere-toggle/atmosphere-toggle.component';
import { I18nService } from '@app/services/i18n.service';
import { ScrollProgressService } from '@app/services/ScrollProgressService.service';
import { ActiveSectionService } from '@app/services/active-section.service';

const SCROLL_THRESHOLD = 50;
const DESKTOP_BREAKPOINT = 768;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex="0"]';

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

  protected readonly UI = computed(() => this.i18nService.getConstant('appConst')?.HEADER_UI || HEADER_UI);

  protected readonly scrolled = signal(false);
  protected readonly mobileOpen = signal(false);

  private readonly toggleBtn = viewChild<ElementRef<HTMLButtonElement>>('toggleBtn');
  private readonly mobilePanel = viewChild<ElementRef<HTMLElement>>('mobilePanel');

  constructor() {
    afterNextRender(() => {
      let rafId = 0;
      const update = () => {
        rafId = 0;
        const next = window.scrollY > SCROLL_THRESHOLD;
        // Only touch the signal when the derived boolean flips.
        if (next !== this.scrolled()) this.scrolled.set(next);
      };
      // Passive + rAF-throttled: at most one read per frame.
      const onScroll = () => {
        if (!rafId) rafId = requestAnimationFrame(update);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        if (rafId) cancelAnimationFrame(rafId);
      });
      update();

      // 'hero' se rastrea aunque no esté en el pill: estando en el hero, ningún
      // link se pinta (los 4 del nav son career/about-me/projects/contact).
      this.activeSection.track(['hero', ...this.NAVIGATIONS().map((n: Header) => n.FRAGMENT)]);
    });

    // Runs after the header template applied `.is-open` / dropped `inert`; a plain effect()
    // would run first and .focus() would hit an inert, visibility:hidden element.
    afterRenderEffect(() => {
      if (!this.mobileOpen()) return;
      this.mobilePanel()?.nativeElement.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
    });

    // Mobile menu side effects: Escape / outside tap / resize close, scroll lock, focus handling.
    effect((onCleanup) => {
      if (!this.mobileOpen() || !isPlatformBrowser(this.platformId)) return;

      const html = document.documentElement;
      const scrollbar = window.innerWidth - html.clientWidth;
      html.style.overflow = 'hidden';
      // Compensate the vanished classic scrollbar so the fixed header doesn't jump.
      if (scrollbar > 0) html.style.setProperty('--scrollbar-comp', `${scrollbar}px`);

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.closeMobile('restore');
        else if (e.key === 'Tab') this.trapTab(e);
      };
      const onPointerDown = (e: Event) => {
        const target = e.target as Node | null;
        if (!target) return;
        if (this.mobilePanel()?.nativeElement.contains(target)) return;
        if (this.toggleBtn()?.nativeElement.contains(target)) return;
        this.closeMobile();
      };
      const onResize = () => {
        if (window.innerWidth >= DESKTOP_BREAKPOINT) this.closeMobile();
      };
      document.addEventListener('keydown', onKey);
      document.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('resize', onResize, { passive: true });

      onCleanup(() => {
        html.style.overflow = '';
        html.style.removeProperty('--scrollbar-comp');
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('resize', onResize);
      });
    });
  }

  /** Keeps Tab / Shift+Tab cycling within toggle + panel while the menu is open. */
  private trapTab(e: KeyboardEvent) {
    const toggle = this.toggleBtn()?.nativeElement;
    const panel = this.mobilePanel()?.nativeElement;
    if (!toggle || !panel) return;
    const items = [toggle, ...Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))];
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    const inside = !!active && items.includes(active as HTMLElement);
    if (e.shiftKey && (active === first || !inside)) {
      e.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!e.shiftKey && (active === last || !inside)) {
      e.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  protected scrollToTop() {
    this.closeMobile('none');
    this.scrollService.scrollTo(0);
  }

  protected toggleMobile() {
    this.mobileOpen.update(v => !v);
  }

  /**
   * @param focus 'restore' always returns focus to the toggle (Escape);
   * 'auto' does so only if focus was inside the menu; 'none' leaves it alone
   * (link taps: the navigation moves focus to the target section).
   */
  protected closeMobile(focus: 'restore' | 'auto' | 'none' = 'auto') {
    if (!this.mobileOpen()) return;
    const panel = this.mobilePanel()?.nativeElement;
    const active = typeof document !== 'undefined' ? document.activeElement : null;
    const focusInside = !!active && (active === document.body || !!panel?.contains(active));
    this.mobileOpen.set(false);
    if (focus === 'restore' || (focus === 'auto' && focusInside)) this.toggleBtn()?.nativeElement.focus({ preventScroll: true });
  }
}
