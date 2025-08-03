import { CommonModule, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HEADER } from '@constants/appConst';
import { NavigateComponent } from '../../molecules/navigate/navigate.component';
import { LogoIconComponent } from '@app/components/icons/logo-icon.component';
import { HeaderMenuOptionsComponent } from '@app/components/organism/header-menu-options/header-menu-options.component';
import { I18nService } from '@app/services/i18n.service';
import { LinksHeaderArray } from '@app/models/types';
import { ScrollProgressService } from '@app/services/ScrollProgressService.service';

@Component({
  standalone: true,
  selector: 'app-header',
  template: `
    <header id="header" class="header">
      <div class="header-container">
        <div class="header-left">
          <LogoIcon class="cursor-pointer" (click)="scrollToTop()" />
        </div>

        <div class="header-center">
          <nav class="navigation">
            @for(NAVIGATION of NAVIGATIONS(); track NAVIGATION.ID) {
            <navigate
              [path]="NAVIGATION.PATH"
              [fragment]="NAVIGATION.FRAGMENT"
              class="nav-link-responsive nav-link-item"
              >{{ NAVIGATION.LABEL }}</navigate
            >
            }
          </nav>
        </div>

        <div class="header-right">
          <header-menu-options></header-menu-options>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NavigateComponent,
    LogoIconComponent,
    HeaderMenuOptionsComponent,
  ],
})
export class HeaderComponent {
  private readonly scrollService = inject(ScrollProgressService);
  private readonly scroller = inject(ViewportScroller);
  protected readonly i18nService = inject(I18nService);
  protected readonly NAVIGATIONS = computed(() => this.i18nService.getConstant('appConst')?.HEADER || HEADER);

  protected scrollToTop() {
    // this.scroller.scrollToAnchor('hero');
    this.scrollService.scrollTo(0);
  }
}
