import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BentoItemDecoComponent } from '@app/components/legacy/bento-center-deco/bento-center-deco.component';
import { BentoItemExpirenceComponent } from '@app/components/legacy/bento-item-expirence/bento-item-expirence.component';
import { BentoItemGithubComponent } from '@app/components/legacy/bento-item-github/bento-item-github.component';
import { BentoItemStackComponent } from '@app/components/legacy/bento-item-stack/bento-item-stack.component';
import { BentoItemWhoiamComponent } from '@app/components/legacy/bento-item-whoiam/bento-item-whoiam.component';
import { BentoItemExperticeComponent } from '@app/components/legacy/bento-item-expertice/bento-item-expertice.component';
import { BentoItemContactComponent } from '@app/components/legacy/bento-item-contact/bento-item-contact.component';
import { BentoItemProfileComponent } from '@app/components/legacy/bento-item-profile/bento-item-profile.component';

@Component({
  standalone: true,
  selector: 'bento-about',
  templateUrl: './bento.component.html',
  styleUrl: './bento.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BentoItemExperticeComponent,
    BentoItemExpirenceComponent,
    BentoItemProfileComponent,
    BentoItemDecoComponent,
    BentoItemWhoiamComponent,
    BentoItemGithubComponent,
    BentoItemStackComponent,
    BentoItemContactComponent,
  ],
})
export class BentoComponent {
  protected readonly titleID: string = 'bento-about-tt';
}
