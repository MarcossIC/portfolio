import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  selector: 'skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillComponent implements OnInit {

  @Input({ required: true }) public icon: string = '';
  @Input({ required: true }) public caption: string = '';
  @Input({ required: true }) public size: number = 50;

  constructor() { }

  ngOnInit(): void {
  }

}
