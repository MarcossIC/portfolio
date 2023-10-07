import { Component, OnInit } from '@angular/core';
import { ABOUT_INTRO } from 'src/constants/appConst';

@Component({
  selector: 'about-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class AboutIntroLayoutComponent implements OnInit {
  INTRODUCTION: any = ABOUT_INTRO;
  constructor() { }

  ngOnInit(): void {
  }

}
