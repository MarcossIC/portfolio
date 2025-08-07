import { ChangeDetectionStrategy, Component, computed, inject, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit, PLATFORM_ID, afterNextRender, DestroyRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TitleComponent } from '@atoms/title/title.component';
import { I18nService } from '@app/services/i18n.service';
import { ABOUT_TITLE } from '@constants/appConst';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { take, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { USER } from '@constants/userConst';

interface StatCardData {
  icon: string;
  title: string;
  value: number;
  subtitle: string;
  delay: number;
  color: 'purple' | 'blue' | 'green' | 'red';
}

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
  imports: [TitleComponent, CommonModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.8s 0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.8s 0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('scaleUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideScale', [
      transition(':enter', [
        style({ scaleX: 0 }),
        animate('1s 0.5s ease-out', style({ scaleX: 1 }))
      ])
    ])
  ]
})
export class AboutMeLayout implements OnDestroy, AfterViewInit {
  protected readonly i18nService = inject(I18nService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);

  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef;

  protected readonly ABOUT_TITLE = computed(() => this.i18nService.getConstant('appConst')?.ABOUT_TITLE || ABOUT_TITLE);
  protected readonly PHOTO = USER.photo;
  protected readonly DOWNLOAD_LINK = USER.downloadCv;
  protected readonly titleID: string = 'bento-about-tt';
  protected readonly Math = Math;

  protected isBrowser = isPlatformBrowser(this.platformId);

  // Animated counters
  protected experienceCount = signal(0);
  protected projectsCount = signal(0);
  protected isInView = signal(false);

  private intersectionObserver?: IntersectionObserver;
  private animationFrames: number[] = [];


  constructor() {
    afterNextRender(() => {
      this.isBrowser = isPlatformBrowser(this.platformId);
      if (this.isBrowser) {
        this.setupIntersectionObserver();
      }
    });
  }

  ngAfterViewInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser && this.intersectionObserver && this.sectionRef) {
      this.intersectionObserver.observe(this.sectionRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.isBrowser) {
      this.animationFrames.forEach(frame => cancelAnimationFrame(frame));
    }
  }

  downloadCV() {
    window.open(this.DOWNLOAD_LINK, '_blank');
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isInView()) {
            this.isInView.set(true);
            this.startCounters();
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px' }
    );
  }

  private startCounters() {
    // Experience counter (5 years)
    this.animateCounter(0, 5, 2000, 1000, (value) => this.experienceCount.set(value));

    // Projects counter (50 projects)
    this.animateCounter(0, 50, 2500, 1200, (value) => this.projectsCount.set(value));
  }

    private animateCounter(start: number, end: number, duration: number, delay: number, callback: (value: number) => void) {
    if (!this.isBrowser) {
      // Fallback for SSR - just set the final value
      callback(end);
      return;
    }

    timer(delay).pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.floor(progress * end);
        callback(currentValue);

        if (progress < 1) {
          const frame = requestAnimationFrame(animate);
          this.animationFrames.push(frame);
        }
      };

      const frame = requestAnimationFrame(animate);
      this.animationFrames.push(frame);
    })
  }

  protected getIconSvg(iconName: string): SafeHtml {
    const defaultIcon = ICONS[iconName];
    return this.sanitizer.bypassSecurityTrustHtml(defaultIcon);
  }

  protected getColorClasses(color: string): string {
    const colorMap: { [key: string]: string } = {
      'purple': 'text-purple-300',
      'blue': 'text-blue-300',
      'green': 'text-green-300',
      'red': 'text-red-300'
    };
    return colorMap[color] || 'text-purple-300';
  }
}
