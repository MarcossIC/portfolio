import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TagComponent } from '../tag/tag.component';

@Component({
  standalone: true,
  imports: [CommonModule, TagComponent, NgOptimizedImage],
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  @Input() public PROJECT: any;
  @Input() public num: number = 0;
  @Input() public textAnchor: string = "";

  constructor() { }

  ngOnInit() {
  }

}
