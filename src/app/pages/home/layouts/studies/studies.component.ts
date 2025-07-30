import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TimelineComponent } from '@app/components/organism/timeline/timeline.component';
import { TitleComponent } from '@app/components/atoms/title/title.component';
import { I18nService } from '@app/services/i18n.service';
import { ABOUT_USER } from '@constants/userConst';
import { STUDIES_TITLE } from '@constants/appConst';

@Component({
  standalone: true,
  selector: 'studies-layout',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineComponent, TitleComponent],
})
export class StudiesLayout {
  protected readonly i18nService = inject(I18nService);
  protected readonly STUDIES = computed(() => this.i18nService.getConstant('userConst')?.ABOUT_USER?.studies || ABOUT_USER.studies);
  protected readonly STUDIES_TITLE = computed(() => this.i18nService.getConstant('appConst')?.STUDIES_TITLE || STUDIES_TITLE);
  protected titleID = 't01agf453';
}
