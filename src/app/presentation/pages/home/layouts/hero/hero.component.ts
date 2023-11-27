import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeroImgComponent } from './hero-img/hero-img.component';
import { HeroTextComponent } from './hero-text/herotexto.component';


@Component({
  standalone: true,
  imports: [CommonModule, HeroImgComponent, HeroTextComponent],
  selector: 'hero-layout',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class HeroLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {  }
}
