import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'hero-img',
  templateUrl: './hero-img.component.html',
  styleUrls: ['./hero-img.component.css']
})
export class HeroImgComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
