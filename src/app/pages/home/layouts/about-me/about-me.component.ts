import { ChangeDetectionStrategy, Component, computed, inject, ElementRef, viewChild, afterNextRender, DestroyRef } from '@angular/core';
import { TitleComponent } from '@atoms/title/title.component';
import { ButtonPrimaryComponent } from '@atoms/button-primary/button-primary.component';
import { I18nService } from '@app/services/i18n.service';
import { ABOUT_TITLE } from '@constants/appConst';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { USER } from '@constants/userConst';

const ICONS: Record<string, string> = {
  'calendar': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>`,
  'check-circle': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>`,
  'award': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
  </svg>`,
  'code': `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
  </svg>`,
  'download': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
  </svg>`,
  'code2': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
  </svg>`,
  'heart': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  </svg>`,
  'zap': `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
  </svg>`
}

@Component({
  standalone: true,
  selector: 'about-me-layout',
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleComponent, ButtonPrimaryComponent],
})
export class AboutMeLayout {
  protected readonly i18nService = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);

  private readonly sectionRef = viewChild.required<ElementRef<HTMLElement>>('sectionRef');

  protected readonly ABOUT_TITLE = computed(() => this.i18nService.getConstant('appConst')?.ABOUT_TITLE || ABOUT_TITLE);
  protected readonly PHOTO = USER.photo;
  protected readonly DOWNLOAD_LINK = USER.downloadCv;
  protected readonly titleID: string = 'bento-about-tt';

  constructor() {
    // Content is always rendered (SSR included) so layout never shifts.
    // Reveal and pause states are plain classes toggled outside change detection.
    afterNextRender(() => {
      const el = this.sectionRef().nativeElement;
      if (typeof IntersectionObserver === 'undefined') return;

      // Hidden state only exists once JS runs, so no-JS users still see content.
      el.classList.add('anim-ready');

      const observer = new IntersectionObserver(
        ([entry]) => {
          el.classList.toggle('offscreen', !entry.isIntersecting);
          if (entry.isIntersecting) el.classList.add('revealed');
        },
        { threshold: 0.05 },
      );
      observer.observe(el);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected getIconSvg(iconName: string): SafeHtml {
    const defaultIcon = ICONS[iconName];
    return this.sanitizer.bypassSecurityTrustHtml(defaultIcon);
  }
}
