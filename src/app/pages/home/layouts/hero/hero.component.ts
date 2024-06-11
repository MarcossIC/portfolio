import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeroImgComponent } from './hero-img/hero-img.component';
import { HeroTextComponent } from './hero-text/herotexto.component';

@Component({
  standalone: true,
  selector: 'hero-layout',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroImgComponent, HeroTextComponent],
})
export class HeroLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
