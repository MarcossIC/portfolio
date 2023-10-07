import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SiteModule } from './presentation/site.module';
import { AppRoutes } from './app.routing';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [	
    AppComponent
   ],
  imports: [
    BrowserAnimationsModule, AppRoutes, SiteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
