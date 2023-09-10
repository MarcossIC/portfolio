import { Component, OnInit } from '@angular/core';
import { PROJECTS } from 'src/constants/appConst';

@Component({
  selector: 'projects-layout',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsLayoutComponent implements OnInit {
  protected PROJECTS: any = PROJECTS;
  constructor() { }

  ngOnInit() {
  }

}
