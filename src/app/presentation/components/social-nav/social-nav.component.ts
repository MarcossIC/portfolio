import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SOCIAL_URLS } from 'src/constants/userConst';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'social-nav',
  templateUrl: './social-nav.component.html',
  styleUrls: ['./social-nav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialNavComponent implements OnInit {
  protected SOCIAL_URLS: any = SOCIAL_URLS;

  constructor() { }

  ngOnInit(): void {
  }
}