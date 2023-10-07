import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SocialNavComponent } from '../social-nav/social-nav.component';

@Component({
  standalone: true,
  imports: [CommonModule, SocialNavComponent],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
