import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'OpenAiIcon',
  templateUrl: './openai.svg',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenAiIconComponent {}
