import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './presentation/components/header/header.component';
import { ParticlesComponent } from './presentation/components/particles/particles.component';
import { FooterComponent } from './presentation/components/footer/footer.component';

import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule, 
    BrowserModule, 
    
    AppRoutes,   
     
    ParticlesComponent,

    HeaderComponent,
    FooterComponent
  ],
  declarations: [	
    AppComponent
   ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
