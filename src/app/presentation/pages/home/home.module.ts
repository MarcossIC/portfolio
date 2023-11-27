import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HomePageComponent } from "./home.component";
import { HeroLayoutComponent } from "./layouts/hero/hero.component";
import { ProjectsLayoutComponent } from "./layouts/projects/projects.component";
import { SkillsLayoutComponent } from "./layouts/skills/skillsLayout.component";
import { ServiceLayoutComponent } from "./layouts/ourService/ourService.component";
import { HomeRoutes } from "./home.routing";
import { NgOptimizedImage } from '@angular/common';

@NgModule({
    imports: [
        CommonModule, 
        HomeRoutes,
        NgOptimizedImage,
        HeroLayoutComponent,
        ServiceLayoutComponent,
        ProjectsLayoutComponent,
        SkillsLayoutComponent,
    ],
    declarations: [ 
        HomePageComponent
    ],
    providers: [],
    exports: [HomePageComponent],
    bootstrap: [HomePageComponent]
})
export class HomeModule { }