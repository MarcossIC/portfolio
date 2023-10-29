import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'spaceSvg',
  templateUrl: './spaceSvg.component.html',
  styleUrls: ['./spaceSvg.component.css']
})
export class SpaceSvgComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
