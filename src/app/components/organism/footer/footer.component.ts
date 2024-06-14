import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LogoIconComponent } from '@icons/logo-icon.component';
import { CoffeeIconComponent } from '@icons/coffee-icon.component';
import { SocialButtonComponent } from '@molecules/social-button/social-button.component';
import { CvIconComponent } from '@icons/cv-icon.component';
import { GmailIconComponent } from '@icons/gmail-icon.component';
import { LinkedinIconComponent } from '@icons/linkedin-icon.component';
import { GithubIconComponent } from '@icons/github-icon.component';
import { RouterLinkComponent } from '@atoms/router-link/router-link.component';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LogoIconComponent,
    RouterLinkComponent,
    CoffeeIconComponent,
    SocialButtonComponent,
    CvIconComponent,
    GmailIconComponent,
    LinkedinIconComponent,
    GithubIconComponent,
  ],
})
export class FooterComponent implements OnInit {
  //
  constructor() {}

  ngOnInit(): void {}
}
