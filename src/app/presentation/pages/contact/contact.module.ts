import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ContactPageComponent } from "./contact.component";
import { TitleComponent } from "../../components/title/title.component";
import { ContactRoutes } from "./contact.routing";
import { NgToastModule } from "ng-angular-popup";



@NgModule({
    imports: [
        CommonModule,
        ContactRoutes,
        TitleComponent,
        NgToastModule
    ],
    declarations: [
        ContactPageComponent
    ],
    providers: [],
    exports: [ContactPageComponent],
    bootstrap: [ContactPageComponent]
})
export class ContactModule { }