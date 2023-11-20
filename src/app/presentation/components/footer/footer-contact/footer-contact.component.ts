import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'footer-contact',
  templateUrl: './footer-contact.component.html',
  styleUrls: ['./footer-contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterContactComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
