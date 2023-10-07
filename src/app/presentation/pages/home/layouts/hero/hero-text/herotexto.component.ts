import { Component, OnInit } from '@angular/core';
import { USER } from 'src/constants/userConst';
import { HERO } from 'src/constants/appConst';

@Component({
  selector: 'hero-text',
  templateUrl: './herotext.component.html',
  styleUrls: ['./herotext.component.css']
})
export class HeroTextComponent implements OnInit {
  USER: any = USER;
  HERO: any = HERO;

  constructor() { }

  ngOnInit(): void { }
}
