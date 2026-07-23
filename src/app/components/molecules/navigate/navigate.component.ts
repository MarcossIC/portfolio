
import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { RouterLinkComponent } from '@atoms/router-link/router-link.component';

@Component({
  standalone: true,
  imports: [RouterLinkComponent],
  selector: 'navigate',
  templateUrl: './navigate.component.html',
  styleUrl: './navigate.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'onHostClick($event)',
    'data-cursor-interactive': '',
  },
})
export class NavigateComponent {
  public path = input<string>('');
  public fragment = input<string>('');
  public classNames = input<string>('');

  private readonly routerLink = viewChild.required(RouterLinkComponent);

  /**
   * El padding visual (ej. .nav-link) vive en este host, pero el <a> del atom
   * solo cubre el texto: los clicks en el padding nunca llegan al <a>.
   * Delegamos esos clicks al atom; los que caen sobre el <a> ya los maneja él.
   */
  protected onHostClick(event: MouseEvent): void {
    if (event.target instanceof Element && event.target.closest('a')) return;
    void this.routerLink().navigate();
  }
}
