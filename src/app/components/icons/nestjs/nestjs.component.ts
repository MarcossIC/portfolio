import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'NestjsIcon',
  templateUrl: '../../../../assets/tech/nestjs.svg',
  styleUrl: '../tech-icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NestjsIconComponent {}
