
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollAnimationDirective } from '@lib/directives/ScrollAnimation.directive';

@Component({
  standalone: true,
  imports: [ScrollAnimationDirective],
  selector: 'liquid-banner',
  template: `
    <picture
      class="liquid-container"
      scrollAnimate="fade-up"
    >
      <div class="liquid bg-transparents-purple shadow-liquid w-auto h-auto max-w-maxCalc xs:max-w-none  xs:h-80 sm:h-[29rem] xl:w-[31rem] xl:h-[28rem] min-[1600px]:w-[50rem] min-[1600px]:h-[45rem]">
        <div class="liquid-container">
          <img
            src="../../../../assets/utils/Programmer.webp"
            class="w-full h-auto"
            alt="Image of person programming"
            role="img"
            decoding="async"
            loading="lazy"
          />
        </div>
      </div>
    </picture>
  `,
  styleUrls: ['./liquid-banner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiquidBannerComponent {}
