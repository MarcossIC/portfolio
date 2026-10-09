import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'RustIcon',
  templateUrl: '../../../../assets/tech/rust.svg',
  styleUrl: '../tech-icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RustIconComponent {}
