import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HEADER, PATHS } from 'src/constants/appConst';
import { LogoComponent } from '../../legacy/logo/logo.component';
import { SocialNavComponent } from '../../legacy/social-nav/social-nav.component';
import { NavigateComponent } from '../../molecules/navigate/navigate.component';
import { LogoIconComponent } from '@app/components/icons/logo-icon.component';

@Component({
  standalone: true,
  selector: 'app-header',
  template: `
    <header id="header" class="header">
      <div class="header-container">
        <LogoIcon />
        <nav class="navigation">
          @for(NAVIGATION of NAVIGATIONS; track NAVIGATION.ID) {
          <navigate
            [path]="NAVIGATION.PATH"
            [fragment]="NAVIGATION.FRAGMENT"
            class="text-[1.1rem] min-[1500px]:text-2xl min-[1700px]:text-3xl"
            [classNames]="$index == 0 ? 'mr-4' : 'mr-4 ml-4'"
            >{{ NAVIGATION.LABEL }}</navigate
          >
          }
        </nav>
      </div>
      <button class="button-resume">
        <a class="button-resume">
          View resume
          <svg
            class="arrow"
            aria-hidden="true"
            role="img"
            width="1.5em"
            height="1.5em"
            color="currentColor"
            stroke-linejoin="round"
            stroke-linecap="round"
            viewBox="0 0 24 24"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
          >
            <line y2="12" x2="19" y1="12" x1="5"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </button>
    </header>
  `,
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NavigateComponent, LogoIconComponent],
})
export class HeaderComponent implements OnInit {
  protected readonly NAVIGATIONS: any = HEADER;
  PATHS: any = PATHS;

  constructor() {}

  ngOnInit(): void {}
}
