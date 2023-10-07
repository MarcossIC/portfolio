import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import VanillaTilt from 'vanilla-tilt';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent implements  AfterViewInit  {
  @Input() icon: string = "";
  @Input() title: string = "";
  @Input() index: number = 0;

  constructor(private elementRef: ElementRef) { 
  }

  ngAfterViewInit(): void {
    const tiltContainer = this.elementRef.nativeElement.querySelector('.card-container') as any;

    console.log("Is mobile: "+this.isMobile);
    if(!this.isMobile){
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
  }

  protected get isMobile() {
    return window.innerWidth < 768;
  }

}
