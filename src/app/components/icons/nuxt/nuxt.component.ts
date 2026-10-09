import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'NuxtIcon',
  templateUrl: '../../../../assets/tech/nuxt.svg',
  styleUrl: '../tech-icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuxtIconComponent {}
