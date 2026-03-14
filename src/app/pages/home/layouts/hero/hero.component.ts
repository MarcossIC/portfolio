import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { HeroSocialBarComponent } from '@organism/hero-social-bar/hero-social-bar.component';
import { ArrowDownComponent } from '@atoms/arrow-down/arrow-down.component';
import { USER } from '@constants/userConst';
import { I18nService } from '@app/services/i18n.service';
import { ReducedMotionService } from '@app/services/ReducedMotion.service';
import { NavigationService } from '@app/services/NavigationService.service';

@Component({
  standalone: true,
  selector: 'hero-layout',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroSocialBarComponent, ArrowDownComponent],
})
export class HeroLayout {
  protected readonly i18nService = inject(I18nService);
  protected readonly USER = computed(() => this.i18nService.getConstant('userConst')?.USER || USER);

  private readonly navigationService = inject(NavigationService);
  private readonly motionService = inject(ReducedMotionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly heroScale = signal(1);
  protected readonly heroOpacity = signal(1);

  protected scrollToContact() {
    this.navigationService.navigateToSection('contact');
  }

  constructor() {
    afterNextRender(() => {
      if (this.motionService.prefersReducedMotion()) return;

      let ticking = false;
      const vh = window.innerHeight;

      const updateHero = () => {
        const progress = Math.min(window.scrollY / vh, 1);
        this.heroScale.set(1 - progress * 0.08);
        this.heroOpacity.set(1 - progress * 0.6);
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateHero);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
      updateHero();
    });
  }
}
