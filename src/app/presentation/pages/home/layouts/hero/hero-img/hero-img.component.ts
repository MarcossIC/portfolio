import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'hero-img',
  templateUrl: './hero-img.component.html',
  styleUrls: ['./hero-img.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroImgComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
