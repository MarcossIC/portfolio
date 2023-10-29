import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  selector: 'skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

  @Input() public icon: string = '';
  @Input() public caption: string = '';
  @Input() public size: number = 50;

  constructor() { }

  ngOnInit() {
  }

}
