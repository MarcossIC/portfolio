import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '@app/services/i18n.service';
import { BentoItemComponent } from '@atoms/bento-item/bento-item.component';
import { ABOUT_USER, USER } from '@constants/userConst';

@Component({
  standalone: true,
  selector: 'bento-item-github',
  templateUrl: './bento-item-github.component.html',
  styleUrls: ['./bento-item-github.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BentoItemComponent],
})
export class BentoItemGithubComponent {
  protected readonly i18nService = inject(I18nService);
  protected readonly GITHUB = computed(() => this.i18nService.getConstant('userConst')?.USER?.gitHub || USER.gitHub);
  protected readonly GITHUB_BENTO = computed(() => this.i18nService.getConstant('userConst')?.ABOUT_USER?.githubBento || ABOUT_USER.githubBento);
}
