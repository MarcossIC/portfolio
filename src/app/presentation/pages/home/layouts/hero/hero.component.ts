import { Component, OnInit } from '@angular/core';
import AOS from 'aos';

@Component({
  selector: 'hero-layout',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { AOS.init(); }
}
