import { NgClass, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'router-link',
  template: ` <a
    [ngClass]="classNames"
    [routerLink]="[path]"
    [fragment]="fragment"
    role="link"
    class="relative group outline-none focus:outline-none focus-within:outline-none"
  >
    <ng-content></ng-content>
  </a>`,
  styleUrl: './router-link.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterModule],
})
export class RouterLinkComponent {
  @Input() public path = '';
  @Input() public fragment = '';
  @Input() public classNames = '';
}
