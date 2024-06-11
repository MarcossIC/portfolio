import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import Atropos from 'atropos';

@Directive({
  selector: '[useAtropos]',
  standalone: true,
})
export class AtroposDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    Atropos({
      el: this.el.nativeElement,
      alwaysActive: true,
      activeOffset: 40,
      rotateXMax: 15,
      rotateYMax: 15,
      shadowOffset: 40,
      duration: 300,
    });
  }
}
