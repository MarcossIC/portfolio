
import {
  Component,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@organism/footer/footer.component';
import { HeaderComponent } from '@organism/header/header.component';
import { ParticlesComponent } from '@molecules/particles/particles.component';
import { ToastComponent } from '@app/components/organism/toast/toast.component';
import { I18nService } from '@app/services/i18n.service';
import { AnimationModuleComponent } from '@app/components/atoms/animation-module/animation-module.component';
import { ScrollProgressBarComponent } from '@app/components/atoms/scroll-progress-bar/scroll-progress-bar.component';
import { CustomCursorComponent } from '@app/components/atoms/custom-cursor/custom-cursor.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    ParticlesComponent,
    HeaderComponent,
    FooterComponent,
    ToastComponent,
    AnimationModuleComponent,
    ScrollProgressBarComponent,
    CustomCursorComponent,
],
})
export class AppComponent {
  private readonly i18nService = inject(I18nService);

  constructor() {
    // Cargar constantes por defecto inmediatamente (funciona en SSR y browser)
    this.i18nService.loadDefaultLanguage();

    // Detección de idioma por geolocalización solo en el browser, post-hydration
    afterNextRender(() => {
      this.i18nService.initializeLanguage();
    });
  }
}
