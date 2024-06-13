import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SocialButtonComponent } from '@app/components/molecules/social-button/social-button.component';
import { LinkedinIconComponent } from '@app/components/icons/linkedin-icon.component';
import { CvIconComponent } from '@app/components/icons/cv-icon.component';
import { GithubIconComponent } from '@app/components/icons/github-icon.component';
import { GmailIconComponent } from '@app/components/icons/gmail-icon.component';

@Component({
  standalone: true,
  selector: 'hero-social-bar',
  templateUrl: './hero-social-bar.component.html',
  styleUrls: ['./hero-social-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SocialButtonComponent,
    LinkedinIconComponent,
    CvIconComponent,
    GithubIconComponent,
    GmailIconComponent,
  ],
})
export class HeroSocialBarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
