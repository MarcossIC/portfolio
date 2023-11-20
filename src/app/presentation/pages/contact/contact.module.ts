import { CommonModule, NgOptimizedImage } from "@angular/common";
import { NgModule } from "@angular/core";
import { ContactPageComponent } from "./contact.component";
import { TitleComponent } from "../../components/title/title.component";
import { ContactRoutes } from "./contact.routing";
import { NgToastModule } from "ng-angular-popup";
import { LiquidBannerComponent } from "../../components/liquid-banner/liquid-banner.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        ContactRoutes,
        TitleComponent,
        NgToastModule,
        NgOptimizedImage,
        LiquidBannerComponent,
        ReactiveFormsModule, 
        FormsModule, 
    ],
    declarations: [
        ContactPageComponent
    ],
    providers: [],
    exports: [ContactPageComponent],
    bootstrap: [ContactPageComponent]
})
export class ContactModule { }