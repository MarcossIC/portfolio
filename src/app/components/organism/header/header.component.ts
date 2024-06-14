import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HEADER, PATHS } from 'src/constants/appConst';
import { LogoComponent } from '../../legacy/logo/logo.component';
import { SocialNavComponent } from '../../legacy/social-nav/social-nav.component';
import { NavigateComponent } from '../../molecules/navigate/navigate.component';

@Component({
  standalone: true,
  imports: [CommonModule, LogoComponent, SocialNavComponent, NavigateComponent],
  selector: 'app-header',
  template: `
    <div id="header" class="header ">
      <div class="header-container">
        <nav class="navigation">
          <navigate
            [path]="PATHS.start"
            [textLink]="HEADER.HOME"
            class="text-[1.1rem] min-[1500px]:text-2xl min-[1700px]:text-3xl"
            classNames="mr-4"
            [isHeader]="true"
          ></navigate>
          <navigate
            [path]="PATHS.about"
            [textLink]="HEADER.ABOUT"
            class="text-[1.1rem] min-[1500px]:text-2xl min-[1700px]:text-3xl"
            classNames="mr-4 ml-4"
            [isHeader]="true"
          ></navigate>
          <navigate
            [path]="PATHS.contact"
            [textLink]="HEADER.CONTACT"
            class="text-[1.1rem] min-[1500px]:text-2xl min-[1700px]:text-3xl"
            classNames="mr-4 ml-4"
            [isHeader]="true"
          ></navigate>
        </nav>

        <app-logo class="logo"></app-logo>

        <social-nav class="social-nav justify-self-center mt-6"></social-nav>
      </div>
    </div>
  `,
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  HEADER: any = HEADER;
  PATHS: any = PATHS;

  constructor() {}

  ngOnInit(): void {}
}
