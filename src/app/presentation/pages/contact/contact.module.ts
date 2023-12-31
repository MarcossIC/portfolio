import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgModule } from "@angular/core";
import { ContactPageComponent } from "./contact.component";
import { TitleComponent } from "../../components/title/title.component";
import { ContactRoutes } from "./contact.routing";
import { LiquidBannerComponent } from "../../components/liquid-banner/liquid-banner.component";
import { ContactFormComponent } from "./contact-form/contact-form.component";
import { HttpClientModule } from '@angular/common/http';
import { ToastComponent } from "../../components/toast/toast.component";

@NgModule({
    imports: [
        CommonModule,
        ContactRoutes,
        TitleComponent,
        NgOptimizedImage,
        LiquidBannerComponent,
        ContactFormComponent,
        HttpClientModule,
        ToastComponent
    ],
    declarations: [
        ContactPageComponent
    ],
    providers: [],
    exports: [ContactPageComponent],
    bootstrap: [ContactPageComponent]
})
export class ContactModule { }