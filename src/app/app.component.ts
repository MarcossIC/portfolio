
import {
  Component,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@organism/footer/footer.component';
import { HeaderComponent } from '@organism/header/header.component';
import { CosmicBackgroundComponent } from '@app/components/atoms/cosmic-background/cosmic-background.component';
import { ToastComponent } from '@app/components/organism/toast/toast.component';
import { I18nService } from '@app/services/i18n.service';
import { ScrollProgressBarComponent } from '@app/components/atoms/scroll-progress-bar/scroll-progress-bar.component';
import { CustomCursorComponent } from '@app/components/atoms/custom-cursor/custom-cursor.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    CosmicBackgroundComponent,
    HeaderComponent,
    FooterComponent,
    ToastComponent,
    ScrollProgressBarComponent,
    CustomCursorComponent,
],
})
export class AppComponent {
  private readonly i18nService = inject(I18nService);

  constructor() {
    this.i18nService.loadDefaultLanguage();

    // Detección de idioma por geolocalización solo en el browser, post-hydration
    afterNextRender(() => {
      this.i18nService.initializeLanguage();
    });
  }
}
