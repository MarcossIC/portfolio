import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { TitleComponent } from "@app/components/atoms/title/title.component";
import { TimelineExperiencyComponent } from "@app/components/organism/timeline-experiency/timeline-experiency.component";
import { I18nService } from "@app/services/i18n.service";
import { ABOUT_USER } from "@constants/userConst";

@Component({
  standalone: true,
  selector: 'experiency-layout',
  templateUrl: './experiency.component.html',
  styleUrls: ['./experiency.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleComponent,
    TimelineExperiencyComponent,
  ],
})
export class ExperiencyComponent {
 public readonly i18n = inject(I18nService);
 public readonly EXPERIENCIES = computed(() => this.i18n.getConstant('userConst')?.ABOUT_USER?.experiencies || ABOUT_USER.experiences);
}
