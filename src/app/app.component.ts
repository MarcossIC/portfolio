import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@organism/footer/footer.component';
import { HeaderComponent } from '@organism/header/header.component';
import { ParticlesComponent } from '@molecules/particles/particles.component';
import { ToastComponent } from '@app/components/organism/toast/toast.component';
import { I18nService } from '@app/services/i18n.service';
import { AnimationModuleComponent } from '@app/components/atoms/animation-module/animation-module.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    RouterOutlet,
    ParticlesComponent,
    HeaderComponent,
    FooterComponent,
    ToastComponent,
    AnimationModuleComponent
  ],
})
export class AppComponent {
  private readonly i18nService = inject(I18nService);

  constructor() {
    this.i18nService.initializeLanguage();
  }

}
