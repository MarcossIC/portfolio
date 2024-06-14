import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { LittlePlantIconComponent } from '@icons/little-plant-icon.component';
import { ReverseLittlePlantIconComponent } from '@icons/reverse-little-plant-icon.component';
import { DevProductivityIconComponent } from '@icons/dev-productivity.component';
import { DevPullRequestIconComponent } from '@icons/dev-pull-req.component';
import { LogoIconComponent } from '@icons/logo-icon.component';

@Component({
  standalone: true,
  selector: 'bento-center-deco',
  templateUrl: './bento-center-deco.component.html',
  styleUrls: ['./bento-center-deco.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BentoItemComponent,
    LittlePlantIconComponent,
    ReverseLittlePlantIconComponent,
    LogoIconComponent,
    DevProductivityIconComponent,
    DevPullRequestIconComponent,
  ],
})
export class BentoItemDecoComponent {}
