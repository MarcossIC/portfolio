import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCardBodyComponent } from '../project-card-body/project-card-body.component';
import { ProjectCardHeader } from '@app/components/legacy/project-card-header/project-card-header.component';
import { ProjectCardFooter } from '@app/components/legacy/project-card-footer/project-card-footer.component';

@Component({
  standalone: true,
  imports: [
    ProjectCardBodyComponent,
    RouterLink,
    ProjectCardHeader,
    ProjectCardFooter,
  ],
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent implements OnInit {
  @Input() public PROJECT: any;
  @Input() public num: number = 0;
  @Input() public textAnchor: string = '';

  constructor() {}

  ngOnInit(): void {}
}
