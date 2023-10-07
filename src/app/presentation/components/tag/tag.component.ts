import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  @Input() public tag: string = "";
  @Input() public background: string = "";
  @Input() public color: string = "";
  
  constructor() { }

  ngOnInit() {
  }

}
