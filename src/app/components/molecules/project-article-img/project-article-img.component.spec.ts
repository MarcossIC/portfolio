import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectArticleImgComponent } from './project-article-img.component';

describe('ProjectArticleImgComponent', () => {
  let fixture: ComponentFixture<ProjectArticleImgComponent>;

  const render = () => {
    fixture = TestBed.createComponent(ProjectArticleImgComponent);
    fixture.componentRef.setInput('SRC', 'assets/projects/test.png');
    fixture.componentRef.setInput('TITLE', 'Test project');
    fixture.componentRef.setInput('ID', 'test-project');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectArticleImgComponent],
    }).compileComponents();
  });

  it('declares the square 400x400 size of the project screenshots', () => {
    const img = render().querySelector('img') as HTMLImageElement;

    expect(img.getAttribute('width')).toBe('400');
    expect(img.getAttribute('height')).toBe('400');
  });

  it('shows the screenshot without linking anywhere', () => {
    const host = render();

    expect(host.querySelector('a')).toBeNull();
    expect(host.querySelector('[href], [tabindex], [title]')).toBeNull();
  });
});
