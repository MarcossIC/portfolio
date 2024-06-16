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
    [routerLink]="['']"
    (click)="navigate(path, fragment)"
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

  private readonly router: Router = inject(Router);
  private readonly viewportScroller: ViewportScroller =
    inject(ViewportScroller);

  protected navigate(path: string, fragment: string) {
    const usePath = path === '/' || path === '' ? [] : [path];

    this.router.navigate(usePath, { replaceUrl: true }).then(() => {
      this.viewportScroller.scrollToAnchor(fragment);
    });
  }
}
