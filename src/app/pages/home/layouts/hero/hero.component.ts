import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeroSocialBarComponent } from '@organism/hero-social-bar/hero-social-bar.component';
import { ArrowDownComponent } from '@atoms/arrow-down/arrow-down.component';

@Component({
  standalone: true,
  selector: 'hero-layout',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroSocialBarComponent, ArrowDownComponent],
})
export class HeroLayoutComponent {
  constructor() {}
}
