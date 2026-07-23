import {
  type ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { ProjectCardBodyComponent } from './project-card-body.component';

describe('ProjectCardBodyComponent', () => {
  let component: ProjectCardBodyComponent;
  let fixture: ComponentFixture<ProjectCardBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardBodyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCardBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
