import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'custom-link',
  templateUrl: './custom-link.html',
  styleUrl: './custom-link.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomLink {
  @Input({ required: true }) public path = '';
  @Input() public rel = '';
  @Input() public target = '_blank';
  @Input() public classNames = '';
}
