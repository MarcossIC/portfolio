import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { ExpirenceItemComponent } from '@molecules/expirence-item/expirence-item.component';

@Component({
  standalone: true,
  selector: 'bento-item-expirence',
  templateUrl: './bento-item-expirence.component.html',
  styleUrls: ['./bento-item-expirence.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BentoItemComponent, ExpirenceItemComponent],
})
export class BentoItemExpirenceComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
