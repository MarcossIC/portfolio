import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'PlaywrightIcon',
  templateUrl: '../../../../assets/tech/playwrite.svg',
  styleUrl: '../tech-icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaywrightIconComponent {}
