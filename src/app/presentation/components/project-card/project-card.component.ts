import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TagComponent } from '../tag/tag.component';
import { ProjectCardBodyComponent } from './project-card-body/project-card-body.component';

@Component({
  standalone: true,
  imports: [CommonModule, TagComponent, NgOptimizedImage, ProjectCardBodyComponent],
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent implements OnInit {
  @Input() public PROJECT: any;
  @Input() public num: number = 0;
  @Input() public textAnchor: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  protected trackByFn(index: number, data: any): number | string{
    return index*2+1;
  }
}
