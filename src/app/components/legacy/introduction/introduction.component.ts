import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SpaceSvgComponent } from '@app/components/legacy/spaceSvg/spaceSvg.component';
import { TitleComponent } from '@app/components/atoms/title/title.component';
import { ABOUT_INTRO } from 'src/constants/appConst';

@Component({
  standalone: true,
  imports: [TitleComponent, SpaceSvgComponent],
  selector: 'about-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutIntroLayoutComponent implements OnInit {
  INTRODUCTION: any = ABOUT_INTRO;
  protected titleID: string = 'gc39cb09';

  constructor() {}

  ngOnInit(): void {}
}
