import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
import { FooterComponent } from '@organism/footer/footer.component';
import { HeaderComponent } from '@organism/header/header.component';
import { ParticlesComponent } from '@molecules/particles/particles.component';
import { LayoutComponent } from './components/legacy/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    RouterOutlet,
    ParticlesComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
  ],
})
export class AppComponent implements AfterViewInit {
  private readonly document: Document = inject(DOCUMENT);
  private platform = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platform)) {
      this.document.onreadystatechange = function () {
        if (document.readyState == 'complete') {
          AOS.init({
            once: true,
            startEvent: 'DOMContentLoaded',
            easing: 'ease',
          });
          AOS.refresh();
        }
      };
    }
  }
}
