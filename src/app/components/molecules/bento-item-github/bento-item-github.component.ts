import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';

@Component({
  standalone: true,
  selector: 'bento-item-github',
  templateUrl: './bento-item-github.component.html',
  styleUrls: ['./bento-item-github.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BentoItemComponent],
})
export class BentoItemGithubComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
