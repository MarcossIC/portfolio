import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'liquid-banner',
  template: `
    <picture
      class="liquid-container"
      data-aos="fade-up"
      data-aos-duration="700"
    >
      <div class="liquid">
        <div class="liquid-container">
          <img
            src="../../../../assets/utils/Programmer.webp"
            class="w-full h-auto"
            alt="Image of person programming"
            role="img"
          />
        </div>
      </div>
    </picture>
  `,
  styleUrls: ['./liquid-banner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiquidBannerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
