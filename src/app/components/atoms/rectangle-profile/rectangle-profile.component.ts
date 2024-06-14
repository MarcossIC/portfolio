import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'rectangle-profile',
  template: `<img
    class="photo"
    [src]="src"
    [loading]="loading"
    [decoding]="decoding"
    width=" 135px"
    height="140px"
    [alt]="alt"
  />`,
  styles: `  .photo {
    object-fit: cover;
    object-position: center;
    border-radius: 14px;
    height: 100%;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RectangleProfileComponent {
  @Input() public src = '';
  @Input() public loading = 'lazy';
  @Input() public decoding = 'async';
  @Input() public alt = '';
}
