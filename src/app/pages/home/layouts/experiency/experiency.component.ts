import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { TitleComponent } from "@app/components/atoms/title/title.component";
import { TimelineExperiencyComponent } from "@app/components/organism/timeline-experiency/timeline-experiency.component";
import { I18nService } from "@app/services/i18n.service";
import { EXPERIENCE_TITLE } from "@constants/appConst";
import { ABOUT_USER } from "@constants/userConst";
import { ScrollAnimationDirective } from "@lib/directives/ScrollAnimation.directive";

@Component({
  standalone: true,
  selector: 'experiency-layout',
  templateUrl: './experiency.component.html',
  styleUrls: ['./experiency.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleComponent,
    TimelineExperiencyComponent,
    ScrollAnimationDirective,
  ],
})
export class ExperiencyComponent {
 public readonly i18n = inject(I18nService);
 public readonly ABOUT_USER = computed(() => this.i18n.getConstant('userConst')?.ABOUT_USER || ABOUT_USER);
 public readonly EXPERIENCE_TITLE = computed(() => this.i18n.getConstant('appConst')?.EXPERIENCE_TITLE || EXPERIENCE_TITLE);
 public readonly EXPERIENCIES = computed(() => this.ABOUT_USER().experiences);
}
