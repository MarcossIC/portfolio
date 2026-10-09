import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectArticleImgComponent } from './project-article-img.component';

describe('ProjectArticleImgComponent', () => {
  let fixture: ComponentFixture<ProjectArticleImgComponent>;

  const render = (repo?: string) => {
    fixture = TestBed.createComponent(ProjectArticleImgComponent);
    if (repo !== undefined) fixture.componentRef.setInput('REPO', repo);
    fixture.componentRef.setInput('SRC', 'assets/projects/test.png');
    fixture.componentRef.setInput('TITLE', 'Test project');
    fixture.componentRef.setInput('ID', 'test-project');
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectArticleImgComponent],
    }).compileComponents();
  });

  it('links to the repository when one is provided', () => {
    const link = render('https://github.com/MarcossIC/Web-Games');

    expect(link.getAttribute('href')).toBe('https://github.com/MarcossIC/Web-Games');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('renders no link target for private projects without a repository', () => {
    const link = render();

    expect(link.hasAttribute('href')).toBe(false);
    expect(link.hasAttribute('target')).toBe(false);
  });
});
