import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SOCIAL_URLS } from 'src/constants/userConst';

@Component({
  selector: 'social-nav',
  templateUrl: './social-nav.component.html',
  styleUrls: ['./social-nav.component.css'],
})
export class SocialNavComponent implements OnInit {
  SOCIAL_URLS: any = SOCIAL_URLS;

  constructor() { }

  ngOnInit() {
    console.log(this.SOCIAL_URLS);
  }
}