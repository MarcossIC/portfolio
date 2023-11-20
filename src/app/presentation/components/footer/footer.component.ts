import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SocialNavComponent } from '../social-nav/social-nav.component';
import { FooterContactComponent } from './footer-contact/footer-contact.component';
import { FooterCopyComponent } from './footer-copy/footer-copy.component';

@Component({
  standalone: true,
  imports: [CommonModule, SocialNavComponent, FooterContactComponent, FooterCopyComponent],
  selector: 'app-footer',
  template: `
    <div class="mt-[4em] bg-slate-900 text-light w-full pb-0 overflow-wrap break-all">

      <div class="footer-content">

        <span>Marcos Lopez</span>
        <social-nav class="mt-2"/>
        <footer-contact/>
        <footer-copy></footer-copy>

      </div>

    </div>
  `,
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
//
  constructor() { }

  ngOnInit():void {
  }

}
