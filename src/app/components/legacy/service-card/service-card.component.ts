import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  inject,
  Input,
  PLATFORM_ID,
  ViewChild,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import VanillaTilt from 'vanilla-tilt';

@Component({
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCardComponent {
  @ViewChild('serviceCard', { static: true }) serviceCardRef!: ElementRef;
  @Input({ required: true }) public icon = '';
  @Input({ required: true }) public title = '';
  @Input({ required: true }) public index = 0;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    afterNextRender(() => {
      const tiltContainer = this.serviceCardRef.nativeElement;

      if (!this.isMobile) {
        VanillaTilt.init(tiltContainer, {
          max: 20,
          scale: 1.1,
          speed: 250,
          perspective: 1000,
          transition: true,
          reset: true,
          gyroscope: true,
        });
      }
    });
  }

  protected get isMobile(): boolean {
    return this.isBrowser ? window.innerWidth < 768 : false;
  }
}
