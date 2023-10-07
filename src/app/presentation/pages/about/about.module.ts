import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AboutPageComponent } from "./about.component";
import { TitleComponent } from "../../components/title/title.component";
import { StudiesLayoutComponent } from "./layouts/studies/studies.component";
import { AboutIntroLayoutComponent } from "./layouts/introduction/introduction.component";
import { TimelineComponent } from "../../components/timeline/timeline.component";
import { SpaceSvgComponent } from "../../components/spaceSvg/spaceSvg.component";
import { AboutRoutes } from "./about.routing";


@NgModule({
    imports: [
        CommonModule,
        AboutRoutes,
        TitleComponent,
        TimelineComponent,
        SpaceSvgComponent
    ],
    declarations: [
        AboutIntroLayoutComponent,
        StudiesLayoutComponent,

        AboutPageComponent
    ],
    providers: [],
    exports: [AboutPageComponent],
    bootstrap: [AboutPageComponent]
})
export class AboutModule { }