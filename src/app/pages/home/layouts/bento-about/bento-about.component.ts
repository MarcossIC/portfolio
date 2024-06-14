import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BentoComponent } from '@organism/bento/bento.component';
import { TitleComponent } from '@atoms/title/title.component';

@Component({
  standalone: true,
  selector: 'bento-about-layout',
  templateUrl: './bento-about.component.html',
  styleUrl: './bento-about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleComponent, BentoComponent],
})
export class BentoAboutLayout {
  protected readonly titleID: string = 'bento-about-tt';
}
