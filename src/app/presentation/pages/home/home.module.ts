import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HomePageComponent } from "./home.component";
import { HeroLayoutComponent } from "./layouts/hero/hero.component";
import { ProjectsLayoutComponent } from "./layouts/projects/projects.component";
import { SkillsLayoutComponent } from "./layouts/skills/skillsLayout.component";
import { ServiceLayoutComponent } from "./layouts/ourService/ourService.component";
import { SkillsGroupComponent } from "./layouts/skills/skills-group/skills-group.component";
import { ProjectCardComponent } from "../../components/project-card/project-card.component";
import { ServiceCardComponent } from "../../components/service-card/service-card.component";
import { SkillComponent } from "../../components/skill/skill.component";
import { TitleComponent } from "../../components/title/title.component";
import { HomeRoutes } from "./home.routing";


@NgModule({
    imports: [
        CommonModule, 
        HomeRoutes,
        TitleComponent,
        ProjectCardComponent,
        SkillComponent,
        ServiceCardComponent,

        HeroLayoutComponent
    ],
    declarations: [ 
        SkillsGroupComponent,

        ProjectsLayoutComponent,
        SkillsLayoutComponent,
        ServiceLayoutComponent,

        HomePageComponent
    ],
    providers: [],
    exports: [HomePageComponent],
    bootstrap: [HomePageComponent]
})
export class HomeModule { }