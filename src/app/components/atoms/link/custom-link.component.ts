import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'custom-link',
  templateUrl: './custom-link.html',
  styleUrl: './custom-link.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomLink {
  public path = input.required<string>();
  public rel = input<string>('');
  public target = input<string>('_blank');
  public classNames = input<string>('');
}
