import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ContactPageComponent } from "./contact.component";
import { TitleComponent } from "../../components/title/title.component";
import { ContactRoutes } from "./contact.routing";



@NgModule({
    imports: [
        CommonModule,
        ContactRoutes,
        TitleComponent,
    ],
    declarations: [
        ContactPageComponent
    ],
    providers: [],
    exports: [ContactPageComponent],
    bootstrap: [ContactPageComponent]
})
export class ContactModule { }