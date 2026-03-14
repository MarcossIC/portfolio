import {
  type ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { ProjectsLayout } from './projects.component';

describe('ProjectsLayoutComponent', () => {
  let component: ProjectsLayout;
  let fixture: ComponentFixture<ProjectsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsLayout],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
