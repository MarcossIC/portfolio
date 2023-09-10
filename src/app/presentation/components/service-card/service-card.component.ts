import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import VanillaTilt from 'vanilla-tilt';

@Component({
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent implements AfterViewInit  {
  @Input() icon: string = "";
  @Input() title: string = "";
  @Input() index: number = 0;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    const tiltContainer = this.elementRef.nativeElement.querySelector('.tiltEffect') as any;
    VanillaTilt.init(tiltContainer, {
      max: 15,
      scale: 1.1,
      speed: 150,
    });
  }

  isMobile(){
    return window.innerWidth <= 768;
  }

}
