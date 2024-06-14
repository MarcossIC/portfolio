import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TimelineComponent } from '@app/components/organism/timeline/timeline.component';
import { TitleComponent } from '@app/components/atoms/title/title.component';
import { ABOUT_USER } from '@constants/userConst';

@Component({
  standalone: true,
  selector: 'studies-layout',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineComponent, TitleComponent],
})
export class StudiesLayoutComponent implements OnInit {
  protected STUDIES: any = ABOUT_USER.studies;
  protected titleID: string = 't01agf453';
  constructor() {}

  ngOnInit(): void {}
}
