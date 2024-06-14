import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import AOS from 'aos';
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
export class AppComponent implements OnInit, AfterViewInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  ngAfterViewInit(): void {
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

  ngOnInit(): void {}
}
