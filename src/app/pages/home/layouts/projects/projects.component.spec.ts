import type { Type } from '@angular/core';
import {
  type ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { PROJECTS_V2 } from '@constants/appConst';
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

  const getIcon = (icon: string) =>
    (component as unknown as { getIconComponent(icon: string): Type<unknown> | null }).getIconComponent(icon);
  const usedIcons = [...new Set(PROJECTS_V2.flatMap((project) => project.ICONS))];

  it('resolves an icon component for every icon used by the projects', () => {
    for (const icon of usedIcons) {
      expect(getIcon(icon), `missing icon component for "${icon}"`).toBeTruthy();
    }
  });

  it('renders an svg for every icon used by the projects', () => {
    for (const icon of usedIcons) {
      const iconFixture = TestBed.createComponent(getIcon(icon)!);
      iconFixture.detectChanges();

      expect(iconFixture.nativeElement.querySelector('svg'), `"${icon}" renders no svg`).not.toBeNull();
    }
  });

  it('includes the Daimler Truck Financial Services project with its stack', () => {
    const dtfs = PROJECTS_V2.find((project) => project.ID === '7-project');

    expect(dtfs?.NAME).toBe('Daimler Truck Financial Services');
    expect(dtfs?.ICONS).toEqual(['angular', 'nestjs', 'spring', 'sqlserver', 'playwright', 'docker']);
  });

  it('names the school billing project Facturador++ as in the CV, with its deploy stack', () => {
    const facturador = PROJECTS_V2.find((project) => project.ID === '5-project');

    expect(facturador?.NAME).toBe('Facturador++');
    expect(facturador?.ICONS).toEqual(['react', 'sass', 'spring', 'docker']);
  });

  it('no longer shows the Books Leaks project', () => {
    expect(PROJECTS_V2.some((project) => project.NAME === 'Books Leaks')).toBe(false);
  });

  it('shows the Tauri/Rust desktop stack on the Codefend project', () => {
    const codefend = PROJECTS_V2.find((project) => project.ID === '1-project');

    expect(codefend?.ICONS).toEqual(['react', 'sass', 'tauri', 'rust']);
  });

  it('shows the IMPortas project right after Codefend with its Nuxt/NestJS stack', () => {
    const codefendIndex = PROJECTS_V2.findIndex((project) => project.ID === '1-project');
    const importas = PROJECTS_V2[codefendIndex + 1];

    expect(importas?.ID).toBe('8-project');
    expect(importas?.NAME).toBe('IMPortas');
    expect(importas?.IMG).toContain('assets/projects/importas.png');
    expect(importas?.REPOSITORY).toBeUndefined();
    expect(importas?.ICONS).toEqual(['nuxt', 'nestjs']);
  });

  it('no longer shows the Cash Now project', () => {
    expect(PROJECTS_V2.some((project) => project.ID === '6-project')).toBe(false);
  });
});
