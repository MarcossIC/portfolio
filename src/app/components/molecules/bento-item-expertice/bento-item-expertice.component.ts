import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlusNumberComponent } from '@atoms/plus-number/plus-number.component';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';

@Component({
  standalone: true,
  selector: 'bento-item-expertice',
  templateUrl: './bento-item-expertice.component.html',
  styleUrls: ['./bento-item-expertice.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BentoItemComponent, PlusNumberComponent],
})
export class BentoItemExperticeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
