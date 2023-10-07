import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './presentation/components/header/header.component';
import { ParticlesComponent } from './presentation/components/particles/particles.component';
import { FooterComponent } from './presentation/components/footer/footer.component';
import { VerifyLinkService } from './data/services/VerifyLink.service';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  imports: [
    CommonModule, 
    BrowserAnimationsModule, 
    AppRoutes,     
    ParticlesComponent,
    HeaderComponent,
    FooterComponent,
    ToastrModule.forRoot({
      maxOpened: 5,
      autoDismiss: true,
      positionClass: 'toast-bottom-right'
    })
  ],
  declarations: [	
    AppComponent
   ],
  providers: [VerifyLinkService],
  bootstrap: [AppComponent]
})
export class AppModule { }
