import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HEADER, PATHS } from 'src/constants/appConst';
import { LogoComponent } from './logo/logo.component';
import { SocialNavComponent } from '../social-nav/social-nav.component';
import { NavigateComponent } from '../navigate/navigate.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, LogoComponent, SocialNavComponent, NavigateComponent],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  HEADER: any = HEADER;
  PATHS: any = PATHS;
  
  constructor() { }

  ngOnInit(): void {
  }

}
