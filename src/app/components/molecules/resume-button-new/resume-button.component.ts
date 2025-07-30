import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { User } from '@app/models/types';
import { I18nService } from '@app/services/i18n.service';
import { USER } from '@constants/userConst';

@Component({
  standalone: true,
  selector: 'header-resume-button',
  templateUrl: './resume-button.component.html',
  styleUrls: ['./resume-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeButtonNewComponent {
  protected readonly i18nService = inject(I18nService);
  protected readonly USER = computed(() => this.i18nService.getConstant('userConst')?.USER || USER);
}
