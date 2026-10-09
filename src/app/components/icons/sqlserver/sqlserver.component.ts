import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'SqlServerIcon',
  templateUrl: '../../../../assets/tech/sqlserver.svg',
  styleUrl: '../tech-icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqlServerIconComponent {}
