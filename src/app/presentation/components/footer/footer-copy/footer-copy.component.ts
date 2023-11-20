import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'footer-copy',
  template: `
    <section class="footer-copy">
      <small class="text-xs">
        <p>&copy; 2023 <b>Marcos Lopez</b>. All rights reserved.</p>
      </small>
    </section>
    `,
  styleUrls: ['./footer-copy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterCopyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
