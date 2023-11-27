import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SpaceSvgComponent } from 'src/app/presentation/components/spaceSvg/spaceSvg.component';
import { TitleComponent } from 'src/app/presentation/components/title/title.component';
import { ABOUT_INTRO } from 'src/constants/appConst';

@Component({
  standalone: true,
  imports: [CommonModule, TitleComponent, SpaceSvgComponent],
  selector: 'about-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutIntroLayoutComponent implements OnInit {
  INTRODUCTION: any = ABOUT_INTRO;
  protected titleID: string = "gc39cb09";

  constructor() { }

  ngOnInit(): void {
  }

}
