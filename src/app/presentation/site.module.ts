import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SiteComponent } from './site.component';
import { LogoComponent } from './components/header/logo/logo.component';
import { HeaderComponent } from './components/header/header.component';
import { SiteRoutes } from './site.routing';
import { HomePageComponent } from './pages/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { SocialNavComponent } from './components/social-nav/social-nav.component';
import { AboutPageComponent } from './pages/about/about.component';
import { NgParticlesModule } from 'ng-particles';
import { ParticlesComponent } from './components/particles/particles.component';
import { AboutIntroLayoutComponent } from './layouts/introduction/introduction.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { LinkComponent } from './components/link/link.component';
import { TitleComponent } from './components/title/title.component';
import { SpaceSvgComponent } from './components/spaceSvg/spaceSvg.component';
import { SkillComponent } from './components/skill/skill.component';
import { StudiesLayoutComponent } from './layouts/studies/studies.component';
import { TimelineElementComponent } from './components/timeline-element/timeline-element.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { HeroLayoutComponent } from './layouts/hero/hero.component';
import { HeroTextComponent } from './layouts/hero/hero-text/herotexto.component';
import { HeroImgComponent } from './layouts/hero/hero-img/hero-img.component';
import { SkillsGroupComponent } from './layouts/skills/skills-group/skills-group.component';
import { SkillsLayoutComponent } from './layouts/skills/skillsLayout.component';
import { ServiceLayoutComponent } from './layouts/ourService/ourService.component';
import { ProjectsLayoutComponent } from './layouts/projects/projects.component';
import { RatingComponent } from './components/rating/rating.component';
import { TagComponent } from './components/tag/tag.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ContactPageComponent } from './pages/contact/contact.component';


@NgModule({
  imports: [
    CommonModule, NgParticlesModule, BrowserAnimationsModule, SiteRoutes
  ],
  declarations: [
    SocialNavComponent,

    ParticlesComponent,

    LinkComponent,

    TimelineElementComponent,

    TimelineComponent,

    SkillComponent,

    TitleComponent,

    SpaceSvgComponent,

    ServiceCardComponent,

    LogoComponent,
    RatingComponent,

    TagComponent,
    ProjectCardComponent,

    HeaderComponent,
    FooterComponent,

    HeroImgComponent,
    HeroTextComponent,

    SkillsGroupComponent,

    HeroLayoutComponent,
    SkillsLayoutComponent,
    ServiceLayoutComponent,
    ProjectsLayoutComponent,
    StudiesLayoutComponent,
    AboutIntroLayoutComponent,

    HomePageComponent,
    AboutPageComponent,
    ContactPageComponent,

    SiteComponent,
    
  ]
})
export class SiteModule { }
