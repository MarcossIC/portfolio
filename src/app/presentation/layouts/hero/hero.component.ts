import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from 'aos';

@Component({
  selector: 'hero-layout',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroLayoutComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void { AOS.init(); }

  ngAfterViewInit(): void {
    //gsap.registerPlugin(ScrollTrigger);
    //this.gsapCustomAnim();
  }

  gsapCustomAnim(): void{
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        scrub: 2,
      }
    });

    tl.to('.hero-text', {y: -200, ease: "power1.out", duration: 2, delay: 0.5});
    tl.to('.hero-img', {y: -300, ease: "power2.out", duration: 2, delay: 0.5}, '-=.2');
  }


}
