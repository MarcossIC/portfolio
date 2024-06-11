import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeroLayoutComponent } from './layouts/hero/hero.component';
import { ProjectsLayoutComponent } from './layouts/projects/projects.component';

@Component({
  selector: 'home-page',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroLayoutComponent, ProjectsLayoutComponent],
})
export class HomePageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

export default HomePageComponent;
