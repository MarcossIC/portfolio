import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import AOS from 'aos';
import { HeroImgComponent } from './hero-img/hero-img.component';
import { HeroTextComponent } from './hero-text/herotexto.component';

@Component({
  standalone: true,
  imports: [CommonModule, HeroImgComponent, HeroTextComponent],
  selector: 'hero-layout',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { AOS.init(); }
}
