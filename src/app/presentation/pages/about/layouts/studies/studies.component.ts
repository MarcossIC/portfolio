import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TimelineComponent } from 'src/app/presentation/components/timeline/timeline.component';
import { TitleComponent } from 'src/app/presentation/components/title/title.component';
import { STUDIES } from 'src/constants/appConst';


@Component({
  standalone: true,
  imports: [CommonModule, TimelineComponent, TitleComponent],
  selector: 'studies-layout',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudiesLayoutComponent implements OnInit {
  protected STUDIES: any = STUDIES;

  constructor() { }

  ngOnInit(): void {
   
  }

}
