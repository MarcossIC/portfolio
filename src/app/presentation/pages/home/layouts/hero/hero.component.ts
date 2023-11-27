import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeroImgComponent } from './hero-img/hero-img.component';
import { HeroTextComponent } from './hero-text/herotexto.component';

@Component({
  standalone: true,
  imports: [HeroImgComponent, HeroTextComponent],
  selector: 'hero-layout',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class HeroLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {  }
}
