import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResumeButtonNewComponent } from '@app/components/molecules/resume-button-new/resume-button.component';
import { USER } from '@constants/userConst';

@Component({
  standalone: true,
  selector: 'header-menu-options',
  templateUrl: './header-menu-options.component.html',
  styleUrls: ['./header-menu-options.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ResumeButtonNewComponent]
})
export class HeaderMenuOptionsComponent {
  protected readonly USER = USER;
}
