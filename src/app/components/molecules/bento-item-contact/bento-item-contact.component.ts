import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { StartIconComponent } from '@app/components/icons/star-icon.component';
import { EmailIconComponent } from '@app/components/icons/email-icon.component';

@Component({
  standalone: true,
  selector: 'bento-item-contact',
  templateUrl: './bento-item-contact.component.html',
  styleUrls: ['./bento-item-contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BentoItemComponent, StartIconComponent, EmailIconComponent],
})
export class BentoItemContactComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
