import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SiteModule } from './presentation/site.module';
import { AppRoutes } from './app.routing';

@NgModule({
  declarations: [	
    AppComponent
   ],
  imports: [
    BrowserModule, AppRoutes, SiteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
